import { motion } from 'framer-motion';
import { Camera, Cpu, Route, ShieldCheck, Smartphone, ArrowRight, Server } from 'lucide-react';

export default function Architecture() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-sans font-bold tracking-wide text-white mb-3">System Architecture & Data Flow</h2>
        <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
          Real-time integration between edge-computing vision nodes, cloud-based route optimization, and municipal traffic controllers.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full relative flex flex-col items-center gap-16"
      >
        {/* Step 1: Input */}
        <motion.div variants={item} className="flex items-center gap-8 w-full justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-brand-navy border border-blue-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] relative group">
              <Camera className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="font-bold text-white tracking-wide">CCTV Feeds</div>
              <div className="text-xs font-mono text-blue-400">Edge Capture</div>
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-white/20" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-brand-navy border border-blue-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] relative group">
              <Cpu className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-blue-400/5 rounded-2xl animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="font-bold text-white tracking-wide">YOLOv8 Vision</div>
              <div className="text-xs font-mono text-blue-400">Object Detection</div>
            </div>
          </div>
        </motion.div>

        {/* Vertical Pipeline Arrow */}
        <div className="h-16 w-1 bg-gradient-to-b from-blue-400/20 to-brand-green/20 relative">
           <motion.div 
              className="absolute top-0 w-3 h-3 -left-1 rounded-full bg-white shadow-[0_0_10px_#fff]"
              animate={{ y: [0, 64] }}
              transition={{ repeat: Infinity, duration: 2 }}
           />
        </div>

        {/* Step 2: Decision / Routing */}
        <motion.div variants={item} className="p-8 rounded-3xl bg-[#0a0f1e] border border-brand-green/30 glow-border w-full max-w-3xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0f1e] px-4 font-mono text-xs text-brand-green font-bold">
            EMERGENCY DETECTED: TRUE
          </div>
          
          <div className="flex justify-between items-center gap-8">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 rounded-xl bg-black/50 border border-brand-green/20 flex items-center justify-center">
                <Server className="w-8 h-8 text-brand-green" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-sm">Path Optimizer</div>
                <div className="text-[10px] font-mono text-brand-green">A* Algorithm (Live)</div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-brand-green/50" />

            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-20 h-20 rounded-xl bg-black/50 border border-brand-green/20 flex items-center justify-center">
                <Route className="w-8 h-8 text-brand-green" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-sm">Target Route</div>
                <div className="text-[10px] font-mono text-brand-green">Nodes Assessed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Splitting Arrows */}
        <div className="flex gap-48 relative h-16 w-full justify-center">
          <div className="absolute top-0 w-1/2 h-1 border-t border-r border-l border-white/20 border-b-0 rounded-t-xl" />
          <motion.div 
              className="absolute top-0 left-1/4 w-3 h-3 -ml-1.5 -mt-1 rounded-full bg-brand-green shadow-[0_0_10px_#00ff88]"
              animate={{ x: [0, -100, -100, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        </div>

        {/* Step 3: Outcomes */}
        <motion.div variants={item} className="flex gap-16 justify-center w-full">
          <div className="flex flex-col items-center gap-3 w-64 p-6 rounded-2xl bg-brand-navy border border-brand-green/30 glow-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-brand-green/10 transition-colors"></div>
            <ShieldCheck className="w-12 h-12 text-brand-green relative z-10" />
            <div className="text-center relative z-10">
              <div className="font-bold text-white">Signal Controller</div>
              <div className="text-xs font-mono text-brand-green mt-1">Preempt IoT Relays</div>
              <p className="text-[10px] text-gray-400 mt-2 leading-tight">Clears path by forcing green lights ahead of the emergency vehicle.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-64 p-6 rounded-2xl bg-brand-navy border border-brand-amber/30 glow-border-amber relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-amber/5 group-hover:bg-brand-amber/10 transition-colors"></div>
            <Smartphone className="w-12 h-12 text-brand-amber relative z-10" />
            <div className="text-center relative z-10">
              <div className="font-bold text-white">Driver Alert System</div>
              <div className="text-xs font-mono text-brand-amber mt-1">Push Notifications</div>
              <p className="text-[10px] text-gray-400 mt-2 leading-tight">Notifies civilian drivers on the route via maps integration to pull over.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
