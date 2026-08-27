# AI-Emergency-Traffic-Corridor-System

A frontend prototype that demonstrates how an AI-assisted traffic management system could create a green corridor for emergency vehicles such as ambulances and fire trucks. The current repository provides a scripted city simulation, simulated detection overlays, and run-based frontend analytics; live computer vision, route optimization, and traffic-controller integrations are planned extensions.


## Features
- **Frontend City Simulation:** Visual map rendering traffic nodes, civilian vehicles, and emergency-vehicle movement.
- **Simulated Smart Signaling:** Demonstrates intersections turning green ahead of the emergency vehicle.
- **Simulated Detection Feeds:** Demonstrates YOLO-style CCTV bounding boxes without live camera or inference integration.
- **Run-Based Analytics Dashboard:** Displays metrics derived from completed frontend simulation runs.

## Setup
```bash
npm install --legacy-peer-deps
npm run dev
```
