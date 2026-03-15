import { Play, Square, Settings2, Route } from 'lucide-react';

interface ControlsProps {
  onStart: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export default function Controls({ onStart, onReset, isSimulating }: ControlsProps) {
  return (
    <div className="h-full flex flex-col pt-2 text-white">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-mono text-gray-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Simulation Parameters
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 px-2">
        {/* Route Details */}
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Route className="w-4 h-4" />
              <span>Active Route Calculation</span>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-mono mb-1">ORIGIN</label>
              <div className="bg-brand-navy/50 p-2 rounded border border-white/5 font-bold">
                AIIMS, New Delhi
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-mono mb-1">DESTINATION</label>
              <div className="bg-brand-navy/50 p-2 rounded border border-white/5 font-bold">
                Safdarjung Hospital
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Vehicle Class:</span>
              <select className="bg-brand-navy border border-white/20 rounded p-1.5 focus:outline-none focus:border-brand-green text-white">
                <option>Type-1 Ambulance</option>
                <option>Fire Engine</option>
                <option>Police Pursuit</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Civilian Traffic:</span>
              <select className="bg-brand-navy border border-white/20 rounded p-1.5 focus:outline-none focus:border-brand-green text-white">
                <option>High (Rush Hour)</option>
                <option>Medium</option>
                <option>Low (Night)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {!isSimulating ? (
              <button 
                onClick={onStart}
                className="flex-1 bg-brand-green text-brand-navy font-bold py-3 rounded hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2 glow-border shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                <Play className="w-5 h-5 fill-current" />
                TRIGGER EMERGENCY
              </button>
            ) : (
              <button 
                onClick={onReset}
                className="flex-1 bg-brand-red text-white font-bold py-3 rounded hover:bg-brand-red/90 transition-all flex items-center justify-center gap-2 glow-border-red shadow-[0_0_20px_rgba(255,59,59,0.2)]"
              >
                <Square className="w-5 h-5 fill-current" />
                RESET SIMULATION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
