"""Run the three real inference paths on explicitly synthetic fixtures.

Model acquisition is a separate, explicit prerequisite. No quality metric is
inferred for VAD or pose from these plumbing checks.
"""
from pathlib import Path
import json
import subprocess
import sys


def call(*args):
    subprocess.run([sys.executable,*args],check=True)


root=Path('runs');root.mkdir(exist_ok=True)
call('-m','recipes.samples','--output-dir','runs/sample','--video')
call('-m','recipes.forecast','--input','runs/sample/workload.csv','--output-dir','runs/forecast')
call('-m','recipes.vad','--input','runs/sample/silence.wav','--model','.models/silero.onnx','--output','runs/vad.json')
call('-m','recipes.pose','--input','runs/sample/stickman.avi','--detector','.models/detector.onnx','--pose','.models/pose.onnx','--max-frames','5','--output','runs/pose.jsonl')
for adapter,file in [('dlinear','runs/forecast/model.npz'),('silero-vad','.models/silero.onnx'),('rtmpose','.models/pose.onnx')]:
    config=root/f'{adapter}-config.json';config.write_text(json.dumps({'model':file}))
    call('-m','bench.runner',adapter,'--config',str(config),'--samples','15','--warmup','3','--timeout','180','--output',f'runs/benchmarks/{adapter}.json')
assert json.loads(Path('runs/vad.json').read_text())['duration_seconds']==3
assert len(Path('runs/pose.jsonl').read_text().splitlines())==6
print('Three real inference adapters completed; fixtures are synthetic, task accuracy is not certified.')
