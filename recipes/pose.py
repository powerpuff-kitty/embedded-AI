"""Video -> local YOLOX-tiny + RTMPose-S -> COCO-17 skeleton JSONL.

Tracking uses gated centre-distance association, not biometric identity. It can
switch identities at crossings. Neither joints nor IDs establish world position.
"""
from __future__ import annotations
import argparse
import json
import math
from pathlib import Path
import time
import numpy as np
from bench.runner import fingerprint


class Tracker:
    def __init__(self, max_distance=.15, max_age=10):
        self.tracks, self.next_id = {}, 0
        self.max_distance, self.max_age = max_distance, max_age

    def update(self, poses, width, height):
        centres = []
        for pose in poses:
            valid = [j for j in pose if j is not None and j[2] >= .3]
            centres.append(np.mean([[j[0]/width,j[1]/height] for j in valid], axis=0) if valid else None)
        pairs = []
        for i, centre in enumerate(centres):
            if centre is None:
                continue
            for ident, old in self.tracks.items():
                distance = float(np.linalg.norm(centre-old['centre']))
                if distance <= self.max_distance:
                    pairs.append((distance,i,ident))
        assignments, used = {}, set()
        for _, i, ident in sorted(pairs):
            if i not in assignments and ident not in used:
                assignments[i] = ident
                used.add(ident)
        for old in self.tracks.values():
            old['age'] += 1
        for i, centre in enumerate(centres):
            if centre is None:
                continue
            if i not in assignments:
                assignments[i] = self.next_id
                self.next_id += 1
            self.tracks[assignments[i]] = {'centre': centre, 'age': 0}
        self.tracks = {k:v for k,v in self.tracks.items() if v['age'] <= self.max_age}
        return [{'track_id': assignments.get(i), 'joints': pose} for i,pose in enumerate(poses)]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input', type=Path, required=True)
    p.add_argument('--detector', type=Path, required=True)
    p.add_argument('--pose', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--fps', type=float, help='Explicit override for missing/incorrect constant frame rate metadata')
    p.add_argument('--max-frames', type=int, default=3000)
    p.add_argument('--threshold', type=float, default=.3)
    a = p.parse_args()
    if a.max_frames < 1 or not 0 <= a.threshold <= 1:
        p.error('Invalid frame cap or threshold')
    import cv2
    from rtmlib import Body
    for model in [a.detector, a.pose]:
        if not model.is_file():
            p.error(f'Missing local model: {model}; run recipes.download explicitly')
    body = Body(det=str(a.detector.resolve()), det_input_size=(416,416), pose=str(a.pose.resolve()),
                pose_input_size=(192,256), to_openpose=False, backend='onnxruntime', device='cpu')
    capture = cv2.VideoCapture(str(a.input))
    if not capture.isOpened():
        p.error('Cannot decode the input video')
    fps = a.fps or capture.get(cv2.CAP_PROP_FPS)
    if not math.isfinite(fps) or fps <= 0:
        capture.release()
        p.error('Missing frame rate; provide --fps')
    tracker = Tracker()
    a.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = a.output.with_suffix(a.output.suffix + '.tmp')
    previous_histogram = None
    try:
        with temporary.open('w') as out:
            out.write(json.dumps({'type':'metadata','schema_version':1,'skeleton':'coco-17','coordinates':'image-pixels',
                                  'fps':fps,'timestamp_basis':'constant-fps frame-index; resample VFR video first',
                                  'models':{'detector_sha256':fingerprint(a.detector),'pose_sha256':fingerprint(a.pose)},
                                  'tracking':'gated-centre-baseline; scene-cut heuristic resets IDs; not re-identification'})+'\n')
            for index in range(a.max_frames):
                ok, image = capture.read()
                if not ok:
                    break
                gray = cv2.cvtColor(cv2.resize(image,(64,64)),cv2.COLOR_BGR2GRAY)
                histogram = cv2.calcHist([gray],[0],None,[32],[0,256]); cv2.normalize(histogram,histogram)
                cut = previous_histogram is not None and cv2.compareHist(previous_histogram,histogram,cv2.HISTCMP_BHATTACHARYYA) > .7
                if cut:
                    tracker.tracks.clear()
                previous_histogram = histogram
                start = time.perf_counter()
                points, scores = body(image)
                poses = [[([float(x),float(y),float(s)] if np.isfinite([x,y,s]).all() and s>=a.threshold else None)
                          for (x,y),s in zip(person,confidence)] for person,confidence in zip(points,scores)]
                height,width = image.shape[:2]
                record = {'type':'frame','index':index,'time_seconds':index/fps,'width':width,'height':height,
                          'scene_cut':bool(cut),'people':tracker.update(poses,width,height),
                          'processing_ms':(time.perf_counter()-start)*1000}
                out.write(json.dumps(record,allow_nan=False)+'\n')
        temporary.replace(a.output)
    finally:
        capture.release()
        temporary.unlink(missing_ok=True)
    print(f'Wrote {a.output}; open the skeleton viewer and select this JSONL file')


if __name__ == '__main__':
    main()
