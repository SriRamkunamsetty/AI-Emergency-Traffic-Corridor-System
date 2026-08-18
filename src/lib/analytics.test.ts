import { describe, expect, it } from 'vitest';
import { buildAnalyticsData, formatDuration, getCompletedRuns, type SimulationRun } from './analytics';

const completedRun: SimulationRun = {
  id: 'run-1',
  vehicleType: 'Type-1 Ambulance',
  origin: 'AIIMS, New Delhi',
  destination: 'Safdarjung Hospital',
  startedAt: 1_000,
  completedAt: 21_000,
  elapsedSeconds: 20,
  signalsOverridden: 5,
  status: 'completed',
};

const cancelledRun: SimulationRun = {
  ...completedRun,
  id: 'run-2',
  vehicleType: 'Fire Engine',
  status: 'cancelled',
};

describe('analytics aggregation', () => {
  it('returns an empty, safe summary when no runs exist', () => {
    const analytics = buildAnalyticsData([]);

    expect(analytics.summary).toEqual({
      totalRuns: 0,
      completedRuns: 0,
      completionRate: 0,
      averageElapsedSeconds: 0,
      averageSignalsOverridden: 0,
    });
    expect(analytics.durationData).toEqual([]);
    expect(analytics.vehicleTypeData).toEqual([]);
  });

  it('excludes cancelled runs from operational metrics', () => {
    const analytics = buildAnalyticsData([completedRun, cancelledRun]);

    expect(analytics.summary.totalRuns).toBe(2);
    expect(analytics.summary.completedRuns).toBe(1);
    expect(analytics.summary.completionRate).toBe(50);
    expect(analytics.summary.averageElapsedSeconds).toBe(20);
    expect(analytics.summary.averageSignalsOverridden).toBe(5);
    expect(analytics.vehicleTypeData).toEqual([
      { name: 'Type-1 Ambulance', value: 1, color: '#00ff88' },
    ]);
  });

  it('aggregates multiple completed vehicle runs', () => {
    const secondRun: SimulationRun = {
      ...completedRun,
      id: 'run-3',
      vehicleType: 'Fire Engine',
      elapsedSeconds: 40,
      signalsOverridden: 7,
    };
    const analytics = buildAnalyticsData([completedRun, secondRun]);

    expect(analytics.summary.averageElapsedSeconds).toBe(30);
    expect(analytics.summary.averageSignalsOverridden).toBe(6);
    expect(analytics.durationData).toEqual([
      { run: 'Run 1', duration: 0.33, vehicleType: 'Type-1 Ambulance' },
      { run: 'Run 2', duration: 0.67, vehicleType: 'Fire Engine' },
    ]);
    expect(analytics.vehicleTypeData.map(item => item.name)).toEqual(['Type-1 Ambulance', 'Fire Engine']);
  });

  it('formats elapsed seconds as minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(125.8)).toBe('2:06');
    expect(formatDuration(-10)).toBe('0:00');
  });

  it('filters completed runs through the public helper', () => {
    expect(getCompletedRuns([completedRun, cancelledRun])).toEqual([completedRun]);
  });
});
