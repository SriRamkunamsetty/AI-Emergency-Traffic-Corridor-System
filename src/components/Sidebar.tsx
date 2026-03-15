import { Clock, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isSimulating: boolean;
  simulationTime: number;
}

export default function Sidebar({ isSimulating, simulationTime }: SidebarProps) {
  // Mock data that changes during simulation
  const vehiclesInfo = isSimulating ? 1 : 0;
  const corridorsActive = isSimulating ? 3 : 0;
  const signalsOverridden = isSimulating ? 7 : 0;
  const confidence = isSimulating ? 97.3 : 0;
  const timeSaved = isSimulating ? 6 : 0; // minutes
  
  // Format simulation time into MM:SS

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 text-white font-sans overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
          Live Telemetry
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Active Emergencies</span>
            <AlertTriangle className={`w-4 h-4 ${isSimulating ? 'text-brand-red animate-pulse' : 'text-gray-600'}`} />
          </div>
          <div className="text-3xl font-mono font-bold">
            {vehiclesInfo}
          </div>
          {isSimulating && (
             <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-red opacity-50 shadow-[0_0_8px_#ff3b3b]" />
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Green Corridors</span>
            <Activity className={`w-4 h-4 ${isSimulating ? 'text-brand-green' : 'text-gray-600'}`} />
          </div>
          <div className="text-3xl font-mono font-bold">
            {corridorsActive}
          </div>
          {isSimulating && (
             <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-green opacity-50 shadow-[0_0_8px_#00ff88]" />
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Signals Overridden</span>
            <ShieldCheck className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="text-3xl font-mono font-bold">
            {signalsOverridden}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
          Performance
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Response Time Saved</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">
            {timeSaved} min {simulationTime % 60} sec
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">AI Detection Confidence</span>
            <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded">YOLOv8</span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div 
              className="bg-brand-green h-2 rounded-full shadow-[0_0_10px_#00ff88]"
              initial={{ width: '0%' }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono mt-1 text-gray-400">
            <span>0%</span>
            <span className={isSimulating ? 'text-brand-green font-bold' : ''}>{confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
