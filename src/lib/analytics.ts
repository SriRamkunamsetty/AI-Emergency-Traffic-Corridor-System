export type SimulationRunStatus = 'completed' | 'cancelled';

export interface SimulationRun {
  id: string;
  vehicleType: string;
  origin: string;
  destination: string;
  startedAt: number;
  completedAt: number;
  elapsedSeconds: number;
  signalsOverridden: number;
  status: SimulationRunStatus;
}

export interface AnalyticsSummary {
  totalRuns: number;
  completedRuns: number;
  completionRate: number;
  averageElapsedSeconds: number;
  averageSignalsOverridden: number;
}

export interface DurationDataPoint {
  run: string;
  duration: number;
  vehicleType: string;
}

export interface SignalDataPoint {
  run: string;
  signals: number;
}

export interface VehicleTypeDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  durationData: DurationDataPoint[];
  signalData: SignalDataPoint[];
  vehicleTypeData: VehicleTypeDataPoint[];
}

const VEHICLE_COLORS = ['#00ff88', '#f59e0b', '#3b82f6', '#a78bfa', '#f43f5e'];

export function getCompletedRuns(runs: SimulationRun[]): SimulationRun[] {
  return runs.filter(run => run.status === 'completed');
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function formatDuration(totalSeconds: number): string {
  const roundedSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function buildAnalyticsData(runs: SimulationRun[]): AnalyticsData {
  const completedRuns = getCompletedRuns(runs);
  const vehicleCounts = completedRuns.reduce<Record<string, number>>((counts, run) => {
    counts[run.vehicleType] = (counts[run.vehicleType] ?? 0) + 1;
    return counts;
  }, {});

  const vehicleTypeData = Object.entries(vehicleCounts).map(([name, value], index) => ({
    name,
    value,
    color: VEHICLE_COLORS[index % VEHICLE_COLORS.length],
  }));

  return {
    summary: {
      totalRuns: runs.length,
      completedRuns: completedRuns.length,
      completionRate: runs.length === 0 ? 0 : (completedRuns.length / runs.length) * 100,
      averageElapsedSeconds: average(completedRuns.map(run => run.elapsedSeconds)),
      averageSignalsOverridden: average(completedRuns.map(run => run.signalsOverridden)),
    },
    durationData: completedRuns.map((run, index) => ({
      run: `Run ${index + 1}`,
      duration: Number((run.elapsedSeconds / 60).toFixed(2)),
      vehicleType: run.vehicleType,
    })),
    signalData: completedRuns.map((run, index) => ({
      run: `Run ${index + 1}`,
      signals: run.signalsOverridden,
    })),
    vehicleTypeData,
  };
}
