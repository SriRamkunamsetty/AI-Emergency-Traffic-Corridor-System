import { Activity, CheckCircle2, Clock, Route } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { buildAnalyticsData, formatDuration, type SimulationRun } from '../lib/analytics';

interface AnalyticsProps {
  runs: SimulationRun[];
}

const chartTooltipStyle = {
  backgroundColor: '#0a0f1e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
};

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-lg">
      <p className="text-gray-500 font-mono text-xs text-center max-w-xs">{message}</p>
    </div>
  );
}

export default function Analytics({ runs }: AnalyticsProps) {
  const { summary, durationData, signalData, vehicleTypeData } = buildAnalyticsData(runs);
  const hasCompletedRuns = summary.completedRuns > 0;

  return (
    <div className="flex flex-col h-full text-white max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-sans font-bold tracking-wide text-brand-green mb-2">SYSTEM ANALYTICS & IMPACT</h2>
        <p className="text-gray-400 font-mono text-sm border-b border-white/10 pb-4">
          Derived from {summary.totalRuns} recorded simulation run{summary.totalRuns === 1 ? '' : 's'}; cancelled runs are excluded from completion metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2">COMPLETED RUNS</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            {summary.completedRuns} <Activity className="w-8 h-8 text-brand-green opacity-50" />
          </div>
          <div className="text-xs text-gray-500 font-mono mt-2">{summary.completionRate.toFixed(0)}% completion rate</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2">AVG. CORRIDOR TIME</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            {hasCompletedRuns ? formatDuration(summary.averageElapsedSeconds) : '—'} <Clock className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
          <div className="text-xs text-gray-500 font-mono mt-2">minutes:seconds per completed run</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2">AVG. SIGNALS OVERRIDDEN</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            {hasCompletedRuns ? summary.averageSignalsOverridden.toFixed(1) : '—'} <Route className="w-8 h-8 text-brand-amber opacity-50" />
          </div>
          <div className="text-xs text-gray-500 font-mono mt-2">per completed corridor</div>
        </div>
      </div>

      {!hasCompletedRuns && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-brand-amber/30 bg-brand-amber/5 p-4 text-sm text-gray-300">
          <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0" />
          <p className="font-mono">Complete a corridor simulation from the Dashboard tab to populate these analytics. Metrics are intentionally blank until the system has measured a run.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-[400px]">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col min-h-[320px]">
          <h3 className="font-mono text-sm text-gray-400 mb-6 uppercase tracking-widest">Completed Run Duration (Minutes)</h3>
          <div className="flex-1 w-full relative">
            {hasCompletedRuns ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="run" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={chartTooltipStyle} formatter={(value) => [value == null ? '—' : `${Number(value).toFixed(2)} min`, 'Duration']} />
                  <Bar dataKey="duration" name="Duration" fill="#00ff88" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChartState message="No completed runs yet." />}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex flex-col">
            <h3 className="font-mono text-sm text-gray-400 mb-4 uppercase tracking-widest">Signals Overridden per Run</h3>
            <div className="flex-1 w-full relative">
              {hasCompletedRuns ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signalData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="run" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line type="monotone" dataKey="signals" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1e', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyChartState message="Complete a run to measure signal changes." />}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex items-center justify-between">
            <div className="flex flex-col h-full justify-center gap-4 min-w-0">
              <h3 className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-2">Completed Vehicle Types</h3>
              {vehicleTypeData.length > 0 ? vehicleTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-mono text-gray-300 truncate">{item.name}</span>
                  <span className="font-bold ml-auto">{Math.round((item.value / summary.completedRuns) * 100)}%</span>
                </div>
              )) : <p className="text-xs text-gray-500 font-mono">No completed vehicle data.</p>}
            </div>
            <div className="h-full w-48 relative shrink-0">
              {vehicleTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={vehicleTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                      {vehicleTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ ...chartTooltipStyle, border: 'none' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyChartState message="No vehicle mix yet." />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
