import { useState, useEffect } from 'react';
import { Navigation, Radio, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveGISMapProps {
  isSimulating: boolean;
  addEvent: (text: string, type: 'info' | 'alert' | 'success') => void;
  onSignalOverride?: () => void;
  onComplete?: () => void;
}

interface GPSWaypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  xPct: number;
  yPct: number;
}

const REAL_COORDINATES: GPSWaypoint[] = [
  { id: "WP-01", name: "AIIMS Trauma Center", lat: 28.5672, lng: 77.2100, xPct: 25, yPct: 80 },
  { id: "WP-02", name: "Sri Aurobindo Marg Junction", lat: 28.5684, lng: 77.2095, xPct: 40, yPct: 65 },
  { id: "WP-03", name: "Ring Road Flyover Entry", lat: 28.5692, lng: 77.2090, xPct: 55, yPct: 50 },
  { id: "WP-04", name: "Safdarjung Hospital Emergency", lat: 28.5708, lng: 77.2082, xPct: 75, yPct: 30 },
];

export default function LiveGISMap({ isSimulating, addEvent, onSignalOverride, onComplete }: LiveGISMapProps) {
  const [waypointIndex, setWaypointIndex] = useState(0);
  const [prevIsSimulating, setPrevIsSimulating] = useState(isSimulating);
  const [mapLayer, setMapLayer] = useState<'carto-dark' | 'satellite'>('carto-dark');
  const totalWaypoints = REAL_COORDINATES.length;

  if (prevIsSimulating !== isSimulating) {
    setPrevIsSimulating(isSimulating);
    if (!isSimulating) {
      setWaypointIndex(0);
    }
  }

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setWaypointIndex(prev => {
        if (prev < totalWaypoints - 1) {
          const nextWp = REAL_COORDINATES[prev + 1];
          addEvent(`🛰️ GPS Signal Locked: ${nextWp.name} (${nextWp.lat}, ${nextWp.lng})`, "success");
          onSignalOverride?.();
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating, totalWaypoints, addEvent, onSignalOverride]);

  useEffect(() => {
    if (isSimulating && waypointIndex === totalWaypoints - 1) {
      addEvent(`🚑 Destination Arrived: Safdarjung Hospital Emergency`, "info");
      onComplete?.();
    }
  }, [isSimulating, waypointIndex, totalWaypoints, addEvent, onComplete]);

  const currentWp = REAL_COORDINATES[waypointIndex];

  return (
    <div className="relative w-full h-full bg-[#0a0f1e] overflow-hidden select-none">
      {/* Real OpenStreetMap Tile Layer Frame */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://tile.openstreetmap.org/16/47285/27914.png')`,
            filter: mapLayer === 'carto-dark' ? 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)' : 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy" />
      </div>

      {/* SVG Interactive GIS Path Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Road Corridor Connection Line */}
        <polyline
          points={REAL_COORDINATES.map(wp => `${wp.xPct},${wp.yPct}`).join(' ')}
          fill="none"
          stroke={isSimulating ? "#00ff88" : "rgba(255,255,255,0.2)"}
          strokeWidth="1.2"
          strokeDasharray={isSimulating ? "2,1" : "none"}
          className={isSimulating ? "drop-shadow-[0_0_8px_#00ff88]" : ""}
        />

        {/* Intersection Signal Points */}
        {REAL_COORDINATES.map((wp, idx) => (
          <g key={wp.id}>
            <circle
              cx={wp.xPct}
              cy={wp.yPct}
              r={idx <= waypointIndex && isSimulating ? "2" : "1.5"}
              fill={idx <= waypointIndex && isSimulating ? "#00ff88" : "#ff3b3b"}
              className="transition-colors duration-500"
            />
            <text
              x={wp.xPct + 2}
              y={wp.yPct - 2}
              fill="#9ca3af"
              fontSize="2.5"
              fontFamily="monospace"
            >
              {wp.id}
            </text>
          </g>
        ))}

        {/* Moving Ambulance GPS Marker */}
        <AnimatePresence>
          {isSimulating && (
            <motion.g
              initial={{ x: REAL_COORDINATES[0].xPct, y: REAL_COORDINATES[0].yPct }}
              animate={{ x: currentWp.xPct, y: currentWp.yPct }}
              transition={{ duration: 3.8, ease: "easeInOut" }}
            >
              <circle r="4" fill="rgba(0,255,136,0.3)" className="animate-ping" />
              <circle r="2" fill="#00ff88" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Real-time GIS Telemetry HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 font-mono text-xs">
        <div className="bg-brand-navy/90 border border-brand-green/30 px-3 py-1.5 rounded backdrop-blur-md flex items-center gap-2 text-brand-green">
          <Navigation className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>GIS: SOUTH NEW DELHI CORRIDOR</span>
        </div>
        <div className="bg-black/70 border border-white/10 px-3 py-1.5 rounded backdrop-blur-md text-gray-300 text-[11px]">
          <div>LAT: <span className="text-white font-bold">{currentWp.lat.toFixed(4)}° N</span></div>
          <div>LNG: <span className="text-white font-bold">{currentWp.lng.toFixed(4)}° E</span></div>
          <div className="text-gray-400 mt-0.5">CURRENT NODE: {currentWp.name}</div>
        </div>
      </div>

      {/* Layer Toggle Switch */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMapLayer(prev => prev === 'carto-dark' ? 'satellite' : 'carto-dark')}
          className="bg-brand-navy/80 hover:bg-brand-navy border border-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-brand-amber" />
          <span>LAYER: {mapLayer.toUpperCase()}</span>
        </button>
      </div>

      {/* Bottom Corridor Metric Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center bg-brand-navy/90 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md font-mono text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-brand-green animate-pulse" />
          <span>CORRIDOR DISTANCE: 1.42 KM</span>
        </div>
        <div>
          STATUS: <span className={isSimulating ? "text-brand-green font-bold" : "text-gray-400"}>
            {isSimulating ? "GREEN WAVE ENGAGED" : "STANDBY"}
          </span>
        </div>
      </div>
    </div>
  );
}
