# BridgePilot (QueuePilot Demo)

A playful hackathon demo for Yas Island: predict queue waits, crowd fairness, and goofy captain recommendations.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Flow (90s)

1. Pick Yas Mall or Ferrari World from the left panel.
2. Show wait now vs later, then toggle Fairness Mode.
3. Open \"Add Check-in\", submit mood + queue length to trigger confetti.
4. Hit \"Simulate Crowd Surge\" and watch the map pulse + toast.
5. Enable Captain Voice and let the recommendation speak.
6. Scroll to Live Feed + metrics for impact.

## Notes

- All data is synthetic and in-memory (`lib/sim.ts`).
- Live updates refresh every 10 seconds.
- API routes are under `/app/api/*` for demo realism.
