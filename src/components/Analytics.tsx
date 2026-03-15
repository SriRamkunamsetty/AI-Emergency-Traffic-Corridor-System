import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

const responseTimeData = [
  { city: 'Delhi', before: 18.5, after: 9.2 },
  { city: 'Mumbai', before: 22.1, after: 11.4 },
  { city: 'Bangalore', before: 24.5, after: 10.8 }
];

const dailyIncidentsData = [
  { day: 'Mon', count: 142 },
  { day: 'Tue', count: 156 },
  { day: 'Wed', count: 189 },
  { day: 'Thu', count: 165 },
  { day: 'Fri', count: 210 },
  { day: 'Sat', count: 195 },
  { day: 'Sun', count: 130 }
];

const vehicleTypesData = [
  { name: 'Ambulance', value: 60, color: '#00ff88' },
  { name: 'Fire Truck', value: 25, color: '#ff3b3b' },
  { name: 'Police', value: 15, color: '#3b82f6' }
];

export default function Analytics() {
  return (
    <div className="flex flex-col h-full text-white max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-sans font-bold tracking-wide text-brand-green mb-2">SYSTEM ANALYTICS & IMPACT</h2>
        <p className="text-gray-400 font-mono text-sm border-b border-white/10 pb-4">
          Data aggregated across deploying smart cities over 30 days.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2 hover:text-white transition-colors">TOTAL EMERGENCIES HANDLED</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            1,247 <Activity className="w-8 h-8 text-brand-green opacity-50" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2 hover:text-white transition-colors">AVG. TIME SAVED</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            6.4 <span className="text-xl mt-2 text-gray-500">min</span> <Clock className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="text-gray-400 font-mono text-sm mb-2 hover:text-white transition-colors">EST. LIVES IMPACTED</div>
          <div className="text-4xl font-bold font-mono text-white flex items-center gap-3">
            3,200+ <ShieldCheck className="w-8 h-8 text-brand-amber opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-[400px]">
        {/* Chart 1 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <h3 className="font-mono text-sm text-gray-400 mb-6 uppercase tracking-widest">Response Time: Before vs After (Mins)</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="city" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="before" name="Before System" fill="#4b5563" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="after" name="With AI System" fill="#00ff88" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 and 3 Stack */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex flex-col">
            <h3 className="font-mono text-sm text-gray-400 mb-4 uppercase tracking-widest">7-Day Incident Trend</h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyIncidentsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#0a0f1e', strokeWidth: 2}} activeDot={{r: 6, fill: '#3b82f6'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex items-center justify-between">
            <div className="flex flex-col h-full justify-center gap-4">
              <h3 className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-2">Vehicle Types Detected</h3>
              {vehicleTypesData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-mono text-gray-300">{item.name}</span>
                  <span className="font-bold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="h-full w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {vehicleTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', border: 'none', borderRadius: '4px' }} itemStyle={{ color: '#fff' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
