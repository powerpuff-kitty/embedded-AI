"""Adapters time defined workloads and never download models implicitly."""
from __future__ import annotations
from pathlib import Path
import hashlib


def digest(path):
    h = hashlib.sha256()
    with open(path, 'rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


class DLinear:
    entry_id = 'dlinear'

    def __init__(self, config):
        import numpy as np
        from recipes.forecast import load_model, predict
        self.np, self.predict = np, predict
        self.model = load_model(Path(config['model']))
        self.x = np.arange(self.model['lookback'], dtype=np.float32)[None, :] / self.model['lookback']
        self.metadata = {'artifact_sha256': digest(config['model']), 'precision': 'float32',
                         'shape': list(self.x.shape), 'runtime': 'numpy',
                         'scope': 'One 96-to-24 forecast unless configured otherwise; no training in timed loop',
                         'input': 'synthetic fixed numerical window'}

    def infer(self):
        return self.predict(self.x, self.model)

    def check(self, output):
        return {'finite': bool(self.np.isfinite(output).all()), 'shape': list(output.shape),
                'quality_evaluated': False}


class Silero:
    entry_id = 'silero-vad'

    def __init__(self, config):
        import numpy as np
        from recipes.vad import VadModel
        self.np = np
        self.model = VadModel(Path(config['model']))
        self.chunk = np.zeros(512, dtype=np.float32)
        self.metadata = {'artifact_sha256': digest(config['model']), 'precision': 'float32',
                         'shape': [1, 576], 'runtime': 'onnxruntime-cpu',
                         'scope': '512 new samples plus 64 context samples at 16 kHz; stateful stream',
                         'input': 'synthetic silence'}

    def infer(self):
        return self.model(self.chunk)

    def check(self, output):
        return {'finite_probability': bool(self.np.isfinite(output) and 0 <= output <= 1),
                'probability': float(output), 'quality_evaluated': False}


class Pose:
    entry_id = 'rtmlib'

    def __init__(self, config):
        import numpy as np
        from rtmlib import RTMPose
        model = str(Path(config['model']).resolve())
        if not Path(model).is_file():
            raise ValueError('Provide a downloaded local RTMPose-S ONNX file')
        self.np = np
        self.model = RTMPose(model, model_input_size=(192, 256), backend='onnxruntime', device='cpu')
        self.image = np.zeros((256, 192, 3), dtype=np.uint8)
        self.metadata = {'artifact_sha256': digest(model), 'precision': 'float32', 'runtime': 'rtmlib-onnxruntime-cpu',
                         'shape': [1, 3, 256, 192], 'scope': 'RTMPose-S pose-only whole-frame crop; detector excluded',
                         'input': 'synthetic black crop, not a human-pose accuracy test'}

    def infer(self):
        return self.model(self.image)

    def check(self, output):
        joints, scores = output
        return {'finite': bool(self.np.isfinite(joints).all() and self.np.isfinite(scores).all()),
                'shape': list(joints.shape), 'quality_evaluated': False}


ADAPTERS = {'dlinear': DLinear, 'silero-vad': Silero, 'rtmpose': Pose}
