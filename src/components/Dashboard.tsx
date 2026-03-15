import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, LayoutDashboard, LineChart, Network, Video } from 'lucide-react';
import MapSimulation from './MapSimulation';
import Sidebar from './Sidebar';
import EventLog from './EventLog';
import Controls from './Controls';
import DetectionFeed from './DetectionFeed';
import Analytics from './Analytics';
import Architecture from './Architecture';

type Tab = 'dashboard' | 'analytics' | 'architecture' | 'cameras';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [events, setEvents] = useState<{ id: number; text: string; time: string; type: 'info' | 'alert' | 'success' }[]>([]);

  // Simulation time loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const addEvent = (text: string, type: 'info' | 'alert' | 'success') => {
    setEvents(prev => [{
      id: Date.now(),
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }, ...prev].slice(0, 50));
  };

  const startSimulation = () => {
    setIsSimulating(true);
    addEvent("🚨 Emergency vehicle detected at AIIMS", "alert");
    setTimeout(() => addEvent("📡 Route calculated: AIIMS → Safdarjung Hospital", "info"), 1000);
    setTimeout(() => addEvent("🔔 Driver alert sent to 14 nearby vehicles", "info"), 2000);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationTime(0);
    setEvents([]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-brand-navy">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-brand-navy/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-6 h-6 text-brand-green" />
          <h1 className="text-xl font-bold font-sans tracking-wide">
            New Delhi 
            <span className="text-gray-500 font-mono text-sm ml-3 font-normal">LIVE TRAFFIC CONTROL</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-brand-red animate-pulse' : 'bg-brand-green animate-pulse'}`} />
            <span className="font-mono text-sm text-gray-300">
              {isSimulating ? 'EMERGENCY ACTIVE' : 'SYSTEM READY'}
            </span>
          </div>
          <div className="font-mono text-sm border font-bold border-white/20 px-3 py-1 rounded bg-black/30">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-amber rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar (Thin) */}
        <nav className="w-16 border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-brand-navy/50">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-brand-green/20 text-brand-green glow-border' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('cameras')} 
            className={`p-3 rounded-xl transition-all ${activeTab === 'cameras' ? 'bg-brand-green/20 text-brand-green glow-border' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="AI Detection Feeds"
          >
            <Video className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`p-3 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-brand-green/20 text-brand-green glow-border' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="Analytics"
          >
            <LineChart className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('architecture')} 
            className={`p-3 rounded-xl transition-all ${activeTab === 'architecture' ? 'bg-brand-green/20 text-brand-green glow-border' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="System Architecture"
          >
            <Network className="w-6 h-6" />
          </button>
        </nav>

        {/* Dynamic Content Panel */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'dashboard' && (
            <>
              {/* Left Panel - Live Stats */}
              <div className="w-80 border-r border-white/10 flex flex-col bg-brand-navy/30">
                <Sidebar 
                  isSimulating={isSimulating} 
                  simulationTime={simulationTime} 
                />
              </div>

              {/* Center Panel - Map & Controls */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 relative p-4">
                  <div className="absolute inset-4 border border-white/10 rounded-xl overflow-hidden bg-black/40">
                    <MapSimulation 
                      isSimulating={isSimulating} 
                      addEvent={addEvent} 
                    />
                  </div>
                </div>
                <div className="h-64 border-t border-white/10 bg-brand-navy/60 p-4">
                  <Controls 
                    onStart={startSimulation} 
                    onReset={resetSimulation} 
                    isSimulating={isSimulating} 
                  />
                </div>
              </div>

              {/* Right Panel - Event Log */}
              <div className="w-80 border-l border-white/10 flex flex-col bg-brand-navy/30">
                <EventLog events={events} />
              </div>
            </>
          )}

          {activeTab === 'cameras' && (
            <div className="w-full flex">
                <DetectionFeed isSimulating={isSimulating} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="w-full p-8 overflow-y-auto">
              <Analytics />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="w-full p-8 flex items-center justify-center overflow-y-auto">
              <Architecture />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
