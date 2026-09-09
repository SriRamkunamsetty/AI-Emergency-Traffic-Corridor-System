import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldAlert, Activity, CheckCircle } from 'lucide-react';

interface LandingProps {
  onLaunch: () => void;
}

export default function Landing({ onLaunch }: LandingProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-navy via-transparent to-brand-navy z-10" />
        
        {/* Moving dots simulating traffic */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`dot-h-${i}`}
            className="absolute h-1 w-1 bg-white/30 rounded-full"
            initial={{ left: '-10%', top: `${(i + 1) * 5}%` }}
            animate={{ left: '110%' }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 10,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`dot-v-${i}`}
            className="absolute h-1 w-1 bg-white/30 rounded-full"
            initial={{ top: '-10%', left: `${(i + 1) * 5}%` }}
            animate={{ top: '110%' }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 10,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-20 max-w-4xl text-center flex flex-col items-center">
        {/* Glowing Ambulance Icon / Corridor animation */}
        <div className="relative mb-12 flex justify-center items-center w-full max-w-md h-16">
          <div className="absolute w-full h-2 bg-brand-navy border-y border-brand-green/30 rounded-full overflow-hidden">
             {/* The glowing corridor line */}
             <motion.div 
               className="h-full bg-brand-green shadow-[0_0_15px_#00ff88]"
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             />
          </div>
          <motion.div 
            className="absolute z-10 text-brand-amber bg-brand-navy p-2 rounded-full glow-border-amber"
            initial={{ x: -200 }}
            animate={{ x: 200 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldAlert className="w-8 h-8" />
          </motion.div>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Emergency <br/> Traffic Corridor System
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-400 mb-12 max-w-2xl font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Smart AI Traffic Management for Emergency Vehicles. Detecting critical response units and autonomously clearing the path.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            onClick={onLaunch}
            className="group relative px-8 py-4 bg-brand-green text-brand-navy font-bold text-lg rounded-sm hover:bg-brand-green/90 transition-all flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(0,255,136,0.5)]"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            Launch Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white font-bold text-lg rounded-sm transition-all flex items-center justify-center gap-3">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col items-center p-6 bg-brand-navy/50 border border-white/10 rounded-lg backdrop-blur-sm">
            <Activity className="w-8 h-8 text-brand-green mb-3 opacity-80" />
            <div className="text-3xl font-mono font-bold text-white mb-1">8+ min</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Saved per signal</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-brand-navy/50 border border-white/10 rounded-lg backdrop-blur-sm">
            <Play className="w-8 h-8 text-brand-amber mb-3 opacity-80" />
            <div className="text-3xl font-mono font-bold text-white mb-1">40-50%</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Faster Response</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-brand-navy/50 border border-white/10 rounded-lg backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-blue-400 mb-3 opacity-80" />
            <div className="text-3xl font-mono font-bold text-white mb-1">15+</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Cities Ready</div>
          </div>
        </motion.div>
      </div>

      {/* Footer / Watermark */}
      <div className="absolute bottom-4 right-6 text-xs text-white/30 font-mono text-right z-20 pointer-events-none">
        AI Emergency Traffic Corridor System • Open-source prototype<br/>
        <span className="text-brand-green/70">Community-built emergency response research demo</span>
      </div>
    </div>
  );
}
