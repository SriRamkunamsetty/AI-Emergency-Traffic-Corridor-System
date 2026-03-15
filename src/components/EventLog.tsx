import { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Info, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventProps {
  id: number;
  text: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}

interface EventLogProps {
  events: EventProps[];
}

export default function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-black/20 text-white overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
        <Terminal className="w-5 h-5 text-gray-400" />
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest font-bold flex-1">
          System Event Log
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
          </span>
          <span className="text-xs font-mono text-brand-green">LIVE</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-3 font-mono text-sm scroll-smooth custom-scrollbar flex flex-col-reverse"
      >
        <AnimatePresence>
          {events.length === 0 ? (
            <div className="text-gray-600 flex flex-col items-center justify-center h-full gap-2">
              <Radio className="w-8 h-8 opacity-20" />
              <span>Awaiting telemetry data...</span>
            </div>
          ) : (
            // Since array is prepended in reverse, rendering as-is but setting flex-col-reverse ensures new items come at the bottom.
            [...events].reverse().map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded border border-white/5 bg-white/5 flex items-start gap-3 relative overflow-hidden
                  ${event.type === 'alert' ? 'border-brand-red/30 bg-brand-red/10' : ''}
                  ${event.type === 'success' ? 'border-brand-green/30 bg-brand-green/5' : ''}
                `}
              >
                {getIcon(event.type)}
                <div className="flex-1">
                  <div className="text-gray-300 leading-snug">{event.text}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{event.time}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
