from __future__ import annotations
import json
import platform
from pathlib import Path
import resource
import sys
import time
from .runner import fingerprint, percentile, write_json
from .adapters import ADAPTERS


def execute(request: dict) -> dict:
    factory = ADAPTERS[request['adapter']]
    began = time.perf_counter_ns()
    adapter = factory(request['config'])
    load_ms = (time.perf_counter_ns() - began) / 1e6
    start = time.perf_counter_ns()
    first = adapter.infer()
    first_ms = (time.perf_counter_ns() - start) / 1e6
    for _ in range(request['warmup']):
        adapter.infer()
    latency = []
    for _ in range(request['samples']):
        start = time.perf_counter_ns()
        adapter.infer()
        latency.append((time.perf_counter_ns() - start) / 1e6)
    check = adapter.check(first)
    if not all(value is True for key, value in check.items() if key.startswith('finite')):
        raise ValueError('Adapter output failed finite/shape smoke check')
    highwater = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    return {'adapter': request['adapter'], 'entry_id': adapter.entry_id, 'config': request['config'],
            'model': adapter.metadata, 'adapter_sha256': fingerprint(Path(__file__).with_name('adapters.py')),
            'load_ms': load_ms, 'first_inference_ms': first_ms,
            'warmup': request['warmup'], 'samples': request['samples'], 'latency_samples_ms': latency,
            'latency_ms': {'p50': percentile(latency, .5), 'p95': percentile(latency, .95), 'p99': percentile(latency, .99)},
            'throughput_calls_per_second': 1000 * len(latency) / sum(latency),
            'process_peak_rss_mb': highwater / 1e6 if platform.system() == 'Darwin' else highwater * 1024 / 1e6,
            'rss_method': 'resource.getrusage(RUSAGE_SELF).ru_maxrss; lifetime high-water mark',
            'output_check': check}


if __name__ == '__main__':
    request = json.loads(Path(sys.argv[1]).read_text())
    write_json(Path(sys.argv[2]), execute(request))
