"""Local Silero ONNX inference, 16 kHz mono signed-16-bit PCM WAV input.

Implements a small independent streaming adapter matching the upstream ONNX
input/state contract. Segment postprocessing is intentionally a simple baseline,
not a copy of Silero's full timestamp algorithm.
"""
from __future__ import annotations
import argparse
from pathlib import Path
import wave
import numpy as np
from bench.runner import fingerprint, write_json


class VadModel:
    def __init__(self, model: Path):
        import onnxruntime as ort
        if not model.is_file():
            raise ValueError('Download the model explicitly with recipes.download first')
        options = ort.SessionOptions()
        options.inter_op_num_threads = options.intra_op_num_threads = 1
        self.session = ort.InferenceSession(str(model), sess_options=options, providers=['CPUExecutionProvider'])
        if {x.name for x in self.session.get_inputs()} != {'input', 'state', 'sr'}:
            raise ValueError('Unexpected ONNX input contract')
        self.reset()

    def reset(self):
        self.state = np.zeros((2, 1, 128), dtype=np.float32)
        self.context = np.zeros((1, 64), dtype=np.float32)

    def __call__(self, chunk):
        if chunk.shape != (512,) or not np.isfinite(chunk).all():
            raise ValueError('Expected 512 finite mono samples')
        audio = np.concatenate([self.context, chunk.astype(np.float32)[None, :]], axis=1)
        probability, self.state = self.session.run(None, {'input': audio, 'state': self.state,
                                                        'sr': np.array(16000, dtype=np.int64)})
        self.context = audio[:, -64:].copy()
        return float(probability.reshape(-1)[0])


def segments(probabilities, duration, threshold=.5, min_speech=.25, silence=.1):
    if not 0 < threshold < 1 or duration < 0:
        raise ValueError('Invalid threshold or duration')
    found, begin, quiet = [], None, None
    for index, probability in enumerate(probabilities):
        t = index * 512 / 16000
        if probability >= threshold:
            if begin is None:
                begin = t
            quiet = None
        elif begin is not None:
            quiet = t if quiet is None else quiet
            if t + .032 - quiet >= silence:
                if quiet - begin >= min_speech:
                    found.append({'start': begin, 'end': min(quiet, duration)})
                begin, quiet = None, None
    if begin is not None:
        end = min(quiet if quiet is not None else duration, duration)
        if end - begin >= min_speech:
            found.append({'start': begin, 'end': end})
    return found


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input', type=Path, required=True)
    p.add_argument('--model', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--threshold', type=float, default=.5)
    a = p.parse_args()
    model = VadModel(a.model)
    probabilities = []
    with wave.open(str(a.input)) as stream:
        if (stream.getnchannels(), stream.getframerate(), stream.getsampwidth(), stream.getcomptype()) != (1,16000,2,'NONE'):
            p.error('Convert input to uncompressed mono 16 kHz PCM16 WAV first; no silent resampling')
        duration = stream.getnframes()/16000
        if duration > 3600:
            p.error('This reference CLI caps input at one hour')
        while raw := stream.readframes(512):
            chunk = np.frombuffer(raw, dtype='<i2').astype(np.float32)/32768
            probabilities.append(model(np.pad(chunk, (0,512-len(chunk)))))
    write_json(a.output, {'schema_version': 1, 'entry_id': 'silero-vad', 'sample_rate': 16000,
                         'duration_seconds': duration, 'model_sha256': fingerprint(a.model),
                         'input_sha256': fingerprint(a.input), 'threshold': a.threshold,
                         'segments_seconds': segments(probabilities, duration, a.threshold),
                         'frame_probabilities': probabilities, 'postprocessing': 'simple threshold/min-duration baseline'})
    print(f'{a.output}: {len(probabilities)} chunks processed offline')


if __name__ == '__main__':
    main()
