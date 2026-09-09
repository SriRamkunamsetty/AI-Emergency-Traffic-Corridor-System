# AI-Emergency-Traffic-Corridor-System

A frontend prototype demonstrating how an AI-assisted traffic management system could create a green corridor for emergency vehicles such as ambulances and fire trucks. The system simulates vehicle detection, smart signal preemption, and run-based performance analytics.

## Features

- **Frontend City Simulation:** Visual map rendering traffic nodes, civilian traffic, and emergency vehicle movement along a designated corridor.
- **Simulated Smart Signaling:** Intersections dynamically turn green ahead of the approaching emergency vehicle.
- **Simulated Detection Feeds:** YOLO-style CCTV bounding box visualization with offline fallback assets.
- **Run-Based Analytics Dashboard:** Real-time performance telemetry and metrics derived from completed simulation runs.
- **System Architecture Flow:** Visual overview of edge-sensing, cloud routing, and municipal actuation layers.

## Setup & Running

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start local development server
npm run dev
```

### Remote Preview Hosts

To preview on a remote or non-local host, specify allowed hostnames via `VITE_ALLOWED_HOSTS`:

```bash
VITE_ALLOWED_HOSTS=preview.example.com npm run dev
```

## Quality & Validation

Run the consolidated test, lint, and build validation pipeline:

```bash
npm run quality
```

Individual commands:
- `npm test` - Run Vitest unit test suites
- `npm run lint` - Run ESLint checks
- `npm run build` - Run TypeScript check and production Vite bundle
