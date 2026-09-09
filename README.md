# AI-Emergency-Traffic-Corridor-System

An AI-powered traffic management system that automatically creates a green corridor for emergency vehicles such as ambulances and fire trucks. The system uses computer vision and AI-based traffic analysis to detect emergency vehicles, optimize routes, and dynamically control traffic signals to reduce response time during emergencies.


## Features
- **Live City Simulation:** Visual map rendering traffic nodes, cars, and ambulance movement.
- **Smart Signaling:** Intersections turn green ahead of the emergency vehicle.
- **AI Detection Feeds:** Simulated YOLOv8 CCTV camera object detection for ambulances vs regular traffic.
- **Real-Time Analytics Dashboard:** Performance metrics comparing response times with/without the system.

## Setup
```bash
npm install --legacy-peer-deps
npm run dev
```

### Remote preview hosts

The development server binds to available interfaces for hosted previews. For a non-local hostname, provide a comma-separated allowlist through `VITE_ALLOWED_HOSTS` before starting Vite:

```bash
VITE_ALLOWED_HOSTS=preview.example.com npm run dev
```

Leave `VITE_ALLOWED_HOSTS` unset for local development. The configuration does not enable unrestricted host allowlisting by default.
