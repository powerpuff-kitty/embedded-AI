"""DLinear architecture, fitted by ridge least squares. No pretrained weights.

The decomposition/two-linear-head architecture follows LTSF-Linear. This small
NumPy recipe uses a different optimizer from the upstream training scripts.
"""
from __future__ import annotations
import argparse
import csv
import json
from pathlib import Path
import numpy as np
from bench.runner import write_json


def decompose(x: np.ndarray, kernel: int = 25):
    if kernel < 1 or kernel % 2 == 0 or x.ndim != 2:
        raise ValueError('Expected [batch,time] and an odd positive moving-average kernel')
    pad = kernel // 2
    windows = np.lib.stride_tricks.sliding_window_view(np.pad(x, ((0, 0), (pad, pad)), mode='edge'), kernel, axis=1)
    trend = windows.mean(axis=-1)
    return x - trend, trend


def predict(x: np.ndarray, model: dict) -> np.ndarray:
    if x.ndim != 2 or x.shape[1] != model['lookback'] or not np.isfinite(x).all():
        raise ValueError('Invalid forecast input shape or non-finite data')
    normalized = (x.astype(np.float32) - model['mean']) / model['scale']
    seasonal, trend = decompose(normalized, model['kernel'])
    output = seasonal @ model['ws'] + model['bs'] + trend @ model['wt'] + model['bt']
    return output * model['scale'] + model['mean']


def fit(values, lookback=96, horizon=24, kernel=25, ridge=1.0):
    values = np.asarray(values, dtype=np.float64)
    if values.ndim != 1 or not np.isfinite(values).all() or len(values) < 2 * (lookback + horizon):
        raise ValueError('Need a finite one-dimensional series of at least 2*(lookback+horizon) points')
    if lookback < 2 or horizon < 1 or ridge < 0:
        raise ValueError('Invalid lookback, horizon or ridge penalty')
    train_end, validation_end = int(len(values) * .6), int(len(values) * .8)
    mean, scale = float(values[:train_end].mean()), max(float(values[:train_end].std()), 1e-6)
    windows = np.lib.stride_tricks.sliding_window_view(values, lookback + horizon)
    starts = np.arange(len(windows)) + lookback
    train = starts + horizon <= train_end
    validation = (starts >= train_end) & (starts + horizon <= validation_end)
    test = starts >= validation_end
    if not all(mask.any() for mask in [train, validation, test]):
        raise ValueError('Series too short for disjoint train/validation/test target windows')
    x, y = windows[:, :lookback], windows[:, lookback:]
    seasonal, trend = decompose((x[train] - mean) / scale, kernel)
    design = np.column_stack([seasonal, trend, np.ones((train.sum(), 2))])
    penalty = np.eye(design.shape[1]) * ridge
    penalty[-2:, -2:] = 0
    weights = np.linalg.lstsq(design.T @ design + penalty, design.T @ ((y[train] - mean) / scale), rcond=None)[0]
    model = {'ws': weights[:lookback].astype(np.float32), 'wt': weights[lookback:2*lookback].astype(np.float32),
             'bs': weights[-2].astype(np.float32), 'bt': weights[-1].astype(np.float32),
             'lookback': lookback, 'horizon': horizon, 'kernel': kernel, 'mean': mean, 'scale': scale}
    metrics = {}
    for name, mask in [('validation', validation), ('test', test)]:
        expected = y[mask]
        forecast = predict(x[mask], model)
        naive = np.repeat(x[mask, -1:], horizon, axis=1)
        period = min(24, lookback)
        seasonal_naive = np.tile(x[mask, -period:], (1, (horizon + period - 1)//period))[:, :horizon]
        metrics[name] = {'windows': int(mask.sum()), 'mae': float(np.abs(forecast-expected).mean()),
                         'rmse': float(np.sqrt(((forecast-expected)**2).mean())),
                         'last_value_mae': float(np.abs(naive-expected).mean()),
                         'seasonal_naive_mae': float(np.abs(seasonal_naive-expected).mean())}
    return model, {'split': {'train_end_exclusive': train_end, 'validation_end_exclusive': validation_end,
                            'test_end_exclusive': len(values), 'scaler_fit_on': 'train-only'},
                   'parameters': 2*(lookback*horizon+horizon), 'metrics': metrics,
                   'optimizer': 'ridge least squares, not upstream Adam',
                   'note': 'Overlapping windows within a split are not independent test examples. No profit claim.'}


def save_model(path: Path, model: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('wb') as output:
        np.savez(output, **model)


def load_model(path: Path) -> dict:
    with np.load(path, allow_pickle=False) as source:
        result = {key: source[key].copy() for key in ['ws', 'wt', 'bs', 'bt']}
        result.update({key: int(source[key]) for key in ['lookback', 'horizon', 'kernel']})
        result.update({key: float(source[key]) for key in ['mean', 'scale']})
    if result['scale'] <= 0 or result['ws'].shape != (result['lookback'], result['horizon']) or result['wt'].shape != result['ws'].shape or result['bs'].shape != (result['horizon'],) or result['bt'].shape != (result['horizon'],) or result['kernel'] < 1 or result['kernel'] % 2 != 1:
        raise ValueError('Invalid DLinear artifact')
    if any(not np.isfinite(v).all() for v in result.values()):
        raise ValueError('Non-finite artifact')
    return result


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input', type=Path, required=True, help='CSV with strictly increasing timestamp and value columns')
    p.add_argument('--output-dir', type=Path, required=True)
    a = p.parse_args()
    with a.input.open() as stream:
        rows = list(csv.DictReader(stream))
    from datetime import datetime
    stamps = [datetime.fromisoformat(row['timestamp']) for row in rows]
    if any(b <= x for x, b in zip(stamps, stamps[1:])):
        p.error('Timestamps must be strictly increasing')
    if len(stamps) > 2 and len({(b-x).total_seconds() for x,b in zip(stamps,stamps[1:])}) != 1:
        p.error('Resample irregular observations before using this recipe')
    values = np.array([float(row['value']) for row in rows])
    model, report = fit(values)
    save_model(a.output_dir / 'model.npz', model)
    report['input_sha256'] = __import__('hashlib').sha256(a.input.read_bytes()).hexdigest()
    report['input_provenance'] = 'user-supplied; synthetic if created by recipes.samples'
    report['next_forecast'] = predict(values[-96:][None, :], model)[0].tolist()
    write_json(a.output_dir / 'evaluation.json', report)
    write_json(a.output_dir / 'benchmark-config.json', {'model': str((a.output_dir / 'model.npz').resolve())})
    print(json.dumps(report['metrics'], indent=2))


if __name__ == '__main__':
    main()
