# Image, video, skeleton and 3D catalogue expansion

> Per-task guides for image, video, skeleton and 3D work — what each component does, and what it does not prove.

Reviewed on 2026-10-05. This batch adds **27 distinct records**: 18 model entries, 8 pipeline/toolkit entries and 1 physics primitive. It documents projects; it does not bundle their weights, install their code or establish board compatibility.

## All additions

| Area | Entries |
|---|---|
| Activity and video analysis | [MoViNet-A0 Streaming](../catalog/video/action-recognition/movinet-a0-stream.yaml), [TSM + MobileNetV2](../catalog/video/action-recognition/tsm-mobilenetv2.yaml), [ST-GCN++ / PYSKL](../catalog/video/action-recognition/st-gcnpp.yaml), [TransNet V2](../catalog/video/shot-detection/transnet-v2.yaml) |
| Visual categories and search | [MobileCLIP2-S0](../catalog/vision/embeddings/mobileclip2-s0.yaml) |
| Enhancement and segmentation | [Zero-DCE++](../catalog/vision/enhancement/zero-dce-plus-plus.yaml), [RFDN](../catalog/vision/super-resolution/rfdn.yaml), [FastDVDnet](../catalog/video/denoising/fastdvdnet.yaml), [Robust Video Matting](../catalog/video/matting/robust-video-matting-mobilenetv3.yaml), [PIDNet-S](../catalog/vision/segmentation/pidnet-s.yaml) |
| Skeleton models | [MediaPipe Pose Lite](../catalog/vision/pose/mediapipe-pose-lite.yaml), [RTMPose-t](../catalog/vision/pose/rtmpose-t.yaml), [VideoPose3D](../catalog/vision/pose/videopose3d.yaml) |
| Pose and motion-capture tools | [rtmlib](../pipelines/pose/rtmlib.yaml), [Lightweight 3D Pose Demo](../pipelines/pose/lightweight-3d-pose.yaml), [EasyMocap](../pipelines/motion-capture/easymocap.yaml), [FreeMoCap](../pipelines/motion-capture/freemocap.yaml) |
| Depth | [ZipDepth](../catalog/vision/depth/zipdepth.yaml), [Lite-Mono](../catalog/vision/depth/lite-mono.yaml), [Depth Anything V2 Small](../catalog/vision/depth/depth-anything-v2-small.yaml), [LightStereo](../catalog/vision/depth/lightstereo.yaml), [Depth Anything 3 Small](../catalog/vision/depth/depth-anything-3-small.yaml) |
| Mapping and reconstruction | [ORB-SLAM3](../pipelines/mapping/orb-slam3.yaml), [RTAB-Map](../pipelines/mapping/rtabmap.yaml), [COLMAP](../pipelines/reconstruction/colmap.yaml), [Brush](../pipelines/reconstruction/brush.yaml) |
| Physics, not AI inference | [MuJoCo](../primitives/simulation/mujoco.yaml) |

Every manifest links to upstream evidence. Existing MoveNet, FastDepth, ByteTrack and other records are reused rather than duplicated.

## How to interpret the metadata

`kind` distinguishes a model from a collection, pipeline, toolkit or non-learned primitive. Companion records live under `pipelines/` and `primitives/`, but appear in the same generated README and JSON index.

`io` records input/output contracts, camera setup, temporal mode and coordinate conventions. **Framewise** means individual-frame processing; **causal** means the selected path can use present/past inputs; **windowed** requires a sequence and may require future context; **offline** is not a live inference claim. None of these labels guarantees a frame rate on a given board.

Parameter counts and file sizes are not memory budgets. Read `model.measurement_scope` for the exact variant, components and precision covered. Unknown RAM remains null. Code and weights licenses are separate. `reviewed` dates refer to documentation review, not a reproduced benchmark.

Compatibility remains per hardware target. A model running on a phone, Jetson or one Rockchip NPU is not proof that it runs on RV1106. See Rockchip's [model zoo support matrix](https://github.com/airockchip/rknn_model_zoo) before choosing a conversion path.

## Important distinctions and restrictions

- MobileCLIP2-S0's image encoder is approximately 11.4M parameters, but the text encoder adds approximately 63.4M. The record uses their approximate total, not the image-only count. Fixed-label deployment may precompute text embeddings. Its [model terms differ from its code license](https://github.com/apple-aiml-research/ml-mobileclip).
- RTMPose-t's reported size covers the pose network, not the person detector. MediaPipe Pose Lite is a detector/landmarker bundle. Neither estimated body-relative skeletons nor a relative depth map automatically establish coordinates in a calibrated room.
- DA3-SMALL is not a microcontroller model. The upstream [variant table](https://github.com/ByteDance-Seed/Depth-Anything-3) does not give it the Gaussian-splat head or metric-depth output available elsewhere in the family.
- [Zero-DCE++](https://github.com/Li-Chongyi/Zero-DCE_extension), [VideoPose3D](https://github.com/facebookresearch/VideoPose3D) and [OpenStereo](https://github.com/XiandaGuo/OpenStereo) have non-commercial restrictions. RVM, FreeMoCap and ORB-SLAM3 have copyleft code licenses. Body-model assets used by motion-capture tools can carry separate terms. Review exact versions and dependencies before product integration.
- PYSKL is [marked unmaintained](https://github.com/kennymckormick/pyskl). Preserve model/config/runtime versions in any experiment instead of assuming the original environment is still current.

## Proposed composition recipes — not implemented demos

### Live categories

A fixed-class temporal model such as MoViNet can consume a video stream. An image/text model can instead label sampled frames against a chosen vocabulary. A skeleton-action model consumes joint sequences. These solve different problems. Keep uncertainty, temporal smoothing and per-stream state explicit.

### Film Analyzer stickman replay

```text
video -> shot boundaries -> person tracks -> 2D joints
      -> optional 3D lifting -> smoothing -> timestamped skeleton data
      -> kinematic stickman viewer
```

Reset or reassess identity/state at shot cuts. Store joint convention, timestamps, confidence, coordinate frame, model version and missing-joint masks. Body-relative 3D can support pose replay without claiming the actor's world position. Physics simulation is a separate stage requiring body models, constraints and controls; MuJoCo is not necessary for simple replay.

### SEEN-0 environment representation

```text
occasionally: calibration + overlapping views -> static room/map layer
continuously: detections + tracks + skeletons -> dynamic entities layer
fusion:       common frame + synchronization + uncertainty
```

Start heavy fusion/reconstruction on a companion computer. Measure any board-side detector/pose/depth candidate alongside capture, hardware encoding, screen and network workloads. The proposed split is not a measured performance claim.

### Camera geometry

A fixed monocular view provides an estimate of visible depth, not measurements of all hidden surfaces. Overlapping views from a translating camera enable geometric reconstruction. Pure rotation around the optical centre adds coverage but not a translational stereo baseline. Stereo/multi-view triangulation needs calibration; moving subjects also need synchronized observations. See [OpenCV stereo geometry](https://docs.opencv.org/4.x/dd/d53/tutorial_py_depthmap.html) and [COLMAP](https://github.com/colmap/colmap).

A splat scene is useful for viewing but is not automatically a collision mesh, a metric survey or a semantic map. Keep rendering assets and geometric/semantic evidence separate.

## Maintaining the catalogue

```sh
npm install
npm run validate
npm test
npm run index
npm run index -- --check
```

Commit both `README.md` and `generated/catalog.json` after changing records. The JSON file is a summary index with stable IDs and manifest paths; detailed metadata remains in YAML. CI runs the same validation/tests and rejects stale generated files.
