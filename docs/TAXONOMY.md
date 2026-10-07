# Embedded intelligence taxonomy

> How the catalogue separates what a component is (model, pipeline, primitive) from where it runs.

The catalogue separates **what a component is** from **where it runs**.

## Models
Learned artifacts produced from data:
- neural networks: CNN, RNN, transformer, SNN, MLP
- classical ML: decision trees, random forests, SVM, regression
- learned policies: reinforcement learning and imitation learning
- learned representations/embeddings

## Intelligence primitives
Algorithms that can be essential to an intelligent embedded system without themselves being learned models:
- search and planning
- optimization
- SLAM
- state estimation and Kalman filtering
- sensor fusion
- tracking

## Control
- PID
- MPC
- CPG / oscillators
- learned control
- hybrid learned + deterministic control

These companion primitives should be documented separately from model manifests. A PID controller is not relabeled as an AI model simply because it participates in an AI system.

## Pipeline roles
A useful embedded system can be described as:

SENSE → PERCEIVE → ESTIMATE → DECIDE/PLAN → CONTROL → ACT

This lets the catalogue eventually compose compatible components into complete recipes.
