"""Run explicit local argv workloads together; record process-tree observations.

Does not provide camera/encoder/display drivers or infer dropped-frame counts.
Only run trusted commands. No shell interpolation is used.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import math
import os
import subprocess
import time
from .runner import host, stop, write_json


def measure(config: dict) -> dict:
    import psutil
    duration = float(config.get('duration_seconds', 30))
    jobs = config.get('processes', [])
    if not math.isfinite(duration) or not 0 < duration <= 3600 or not 1 <= len(jobs) <= 8:
        raise ValueError('Provide 1–8 processes and duration in (0,3600] seconds')
    if len({j.get('id') for j in jobs}) != len(jobs):
        raise ValueError('Unique process IDs required')
    for job in jobs:
        if not isinstance(job.get('id'), str) or not job['id'] or not isinstance(job.get('argv'), list) or not job['argv'] or any(not isinstance(a,str) or not a for a in job['argv']):
            raise ValueError('Each process requires an id and nonempty argv string array')
    processes, peak, ticks = [], 0, 0
    start = time.monotonic()
    try:
        for job in jobs:
            p = subprocess.Popen(job['argv'], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                 stderr=subprocess.DEVNULL, start_new_session=os.name == 'posix')
            processes.append((job,p))
        while time.monotonic()-start < duration:
            rss, seen = 0,set()
            for job,p in processes:
                if p.poll() is not None:
                    raise RuntimeError(f"{job['id']} exited before the workload interval (code {p.returncode})")
                try:
                    parent=psutil.Process(p.pid)
                    for child in [parent,*parent.children(recursive=True)]:
                        if child.pid not in seen:
                            seen.add(child.pid)
                            try: rss+=child.memory_info().rss
                            except (psutil.NoSuchProcess,psutil.AccessDenied): pass
                except psutil.NoSuchProcess: pass
            peak=max(peak,rss);ticks+=1;time.sleep(.02)
    finally:
        for _,p in reversed(processes): stop(p)
    return {'schema_version':1,'record_type':'coexistence-observation','hardware':host(),
            'duration_seconds':time.monotonic()-start,'processes':jobs,'sampled_process_tree_peak_rss_mb':peak/1e6,
            'poll_samples':ticks,'poll_interval_ms':20,'dropped_frames':None,'end_to_end_latency_ms':None,
            'notes':['Process RSS only; shared pages can be double-counted. Short peaks may be missed.',
                     'Provide real camera/API/display commands on the actual board. Survival is not real-time correctness.',
                     'Frame/queue/power/thermal metrics must come from the application or instruments.']}


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--config',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    try: write_json(a.output,measure(json.loads(a.config.read_text())))
    except (ValueError,RuntimeError,OSError) as error:p.exit(1,str(error)+'\n')
