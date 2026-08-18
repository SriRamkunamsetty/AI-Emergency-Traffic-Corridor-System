import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapSimulationProps {
  isSimulating: boolean;
  addEvent: (text: string, type: 'info' | 'alert' | 'success') => void;
  onSignalOverride: () => void;
  onComplete: () => void;
}

// Fixed route coordinates matching the grid nodes
const ROUTE_NODES = [
  { id: '1,4', x: 20, y: 80, name: 'AIIMS' }, // Start
  { id: '2,4', x: 40, y: 80 },
  { id: '2,3', x: 40, y: 60 },
  { id: '3,3', x: 60, y: 60 },
  { id: '3,2', x: 60, y: 40 },
  { id: '4,2', x: 80, y: 40, name: 'Safdarjung' } // End
];

// Generates civilian traffic not interfering with the route
const generateCivilianRoutes = () => [
   { start: {x: 20, y: 20}, end: {x: 80, y: 20}, duration: 15 },
   { start: {x: 80, y: 80}, end: {x: 80, y: 60}, duration: 8 },
   { start: {x: 60, y: 80}, end: {x: 60, y: 95}, duration: 5 },
   { start: {x: 40, y: 40}, end: {x: 20, y: 40}, duration: 10 }
];

export default function MapSimulation({ isSimulating, addEvent, onSignalOverride, onComplete }: MapSimulationProps) {
  // We manage the ambulance current node index based on simulation progress
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const totalNodes = ROUTE_NODES.length;

  useEffect(() => {
    if (!isSimulating) {
      setCurrentNodeIndex(0);
      return;
    }

    // Move ambulance every 3 seconds
    const interval = setInterval(() => {
      setCurrentNodeIndex(prev => {
        if (prev < totalNodes - 1) {
          const nextNode = ROUTE_NODES[prev + 1];
          addEvent(`✅ Signal at ${nextNode.x},${nextNode.y} overridden to GREEN`, "success");
          onSignalOverride();
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating, totalNodes, addEvent, onSignalOverride]);

  useEffect(() => {
    if (isSimulating && currentNodeIndex === totalNodes - 1) {
      addEvent(`🚑 Ambulance reached destination. Corridor closing.`, "info");
      onComplete();
    }
  }, [isSimulating, currentNodeIndex, totalNodes, addEvent, onComplete]);

  // Determine signal color for a grid node
  const getSignalColor = (nodeX: number, nodeY: number) => {
    if (!isSimulating) return "fill-brand-red"; // Default all reds on grid intersections
    
    const isNextIntersections = ROUTE_NODES.findIndex(n => n.x === nodeX && n.y === nodeY) > currentNodeIndex;
    const isCurrent = ROUTE_NODES[currentNodeIndex].x === nodeX && ROUTE_NODES[currentNodeIndex].y === nodeY;
    
    // The node the ambulance is at, or the next ones on route turn green
    if (isCurrent || isNextIntersections) {
      return "fill-brand-green shadow-[0_0_10px_#00ff88]";
    }
    
    return "fill-brand-red";
  };

  // Helper to render the grid intersections
  const renderGrid = () => {
    const nodes = [];
    for(let x=20; x<=80; x+=20) {
      for(let y=20; y<=80; y+=20) {
        // Draw roads
        nodes.push(
          <line key={`lh-${x}-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        );
        nodes.push(
          <line key={`lv-${x}-${y}`} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        );
      }
    }
    
    const signals = [];
    for(let x=20; x<=80; x+=20) {
      for(let y=20; y<=80; y+=20) {
        // Intersection Signals
        signals.push(
          <circle 
            key={`sig-${x}-${y}`} 
            cx={x} cy={y} r="1.5"
            className={`${getSignalColor(x,y)} transition-colors duration-500`}
          />
        );
      }
    }

    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ambGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 255, 136, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
          </radialGradient>
        </defs>
        
        {nodes}
        
        {/* Active Corridor Highlights */}
        <AnimatePresence>
          {isSimulating && currentNodeIndex < totalNodes - 1 && (
            <motion.polyline
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              points={ROUTE_NODES.map(n => `${n.x},${n.y}`).join(' ')}
              fill="none"
              stroke="#00ff88"
              strokeWidth="1.5"
              strokeDasharray="2,1"
              className="drop-shadow-[0_0_5px_#00ff88]"
            />
          )}
        </AnimatePresence>

        {signals}

        {/* Civilian Cars (Random loops) */}
        {generateCivilianRoutes().map((route, i) => (
           <motion.circle
             key={`civ-${i}`}
             r="1"
             fill="#ffffff"
             initial={{ cx: route.start.x, cy: route.start.y }}
             animate={{ cx: route.end.x, cy: route.end.y }}
             transition={{ 
               duration: route.duration, 
               repeat: Infinity, 
               repeatType: 'reverse',
               ease: "linear"
             }}
           />
        ))}

        {/* The Ambulance */}
        <AnimatePresence>
          {isSimulating && (
            <motion.g
              initial={{ 
                x: ROUTE_NODES[0].x, 
                y: ROUTE_NODES[0].y 
              }}
              animate={{ 
                x: ROUTE_NODES[currentNodeIndex]?.x || ROUTE_NODES[totalNodes-1].x, 
                y: ROUTE_NODES[currentNodeIndex]?.y || ROUTE_NODES[totalNodes-1].y 
              }}
              transition={{ 
                duration: 4, 
                ease: "easeInOut"
              }}
            >
              <circle r="6" fill="url(#ambGlow)" className="animate-pulse" />
              <rect x="-2" y="-1.5" width="4" height="3" fill="#ffffff" rx="0.5" />
              <rect x="-0.5" y="-1.5" width="1" height="3" fill="#ff3b3b" />
              <rect x="-2" y="-0.5" width="4" height="1" fill="#ff3b3b" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Labels */}
        <text x="21" y="84" fill="#666" fontSize="3" fontFamily="monospace">AIIMS</text>
        <text x="75" y="38" fill="#666" fontSize="3" fontFamily="monospace">Safdarjung</text>
      </svg>
    );
  };

  return (
    <div className="w-full h-full bg-[#111624] relative">
      {/* Decorative Grid overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(10,15,30,0.8)_100%)] pointer-events-none" />
      {renderGrid()}
      
      {/* HUD Layer overlay */}
      <div className="absolute top-4 left-4 font-mono text-xs text-brand-green bg-brand-navy/80 px-3 py-1 rounded border border-brand-green/30 backdrop-blur-sm">
        CAM_VIEW: OVERHEAD_SAT
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-gray-500">
        LAT: 28.56708, LNG: 77.21004
      </div>
    </div>
  );
}
