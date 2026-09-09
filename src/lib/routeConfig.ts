export const DEMO_ROUTE = {
  name: 'AIIMS → Safdarjung Hospital',
  mode: 'fixed-demo-route',
  description: 'A scripted demonstration path; live congestion-aware route optimization is not connected.',
} as const;

export const ROUTE_NODES = [
  { id: '1,4', x: 20, y: 80, name: 'AIIMS' },
  { id: '2,4', x: 40, y: 80 },
  { id: '2,3', x: 40, y: 60 },
  { id: '3,3', x: 60, y: 60 },
  { id: '3,2', x: 60, y: 40 },
  { id: '4,2', x: 80, y: 40, name: 'Safdarjung' },
] as const;
