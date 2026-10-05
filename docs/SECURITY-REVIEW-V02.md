# v0.2 dependency review

The original audit (GitHub Actions run 37294187461, job 111711426721) identified one underlying advisory, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting braces <=3.0.3. The three high-severity affected dependency nodes were braces, micromatch and fast-glob. They were not three independently established exploits.

The catalogue used fixed developer-supplied glob patterns, not arbitrary user-supplied patterns. Nevertheless, the dependency chain was unnecessary and has been removed. `scripts/discover.ts` walks only the three known roots, skips symlinks/templates, and preserves YAML and duplicate-ID checks.

The exact direct versions from the inspected installation are AJV 8.20.0, tsx 4.23.15 and yaml 2.9.1. `package-lock.json` records the transitive tree. CI uses `npm ci --ignore-scripts` and `npm audit --audit-level=high`. A successful audit is time-specific, not a guarantee against future advisories. Browser assets require no third-party runtime dependency or CDN.

Python recipe dependencies are separate: direct pins and a per-run resolved inventory are recorded. This document does not claim an npm audit covers Python packages or downloaded models. Acquisition has explicit HTTPS-source/size/hash checks, no archive-path extraction, no torch.hub execution and no implicit model download during inference.

No public hosting, analytics or upload endpoint is enabled. Routine validation and model-execution jobs are read-only; the trusted main catalogue generator commits only allowlisted generated outputs. The temporary feature-branch preparation workflow is removed before merging.
