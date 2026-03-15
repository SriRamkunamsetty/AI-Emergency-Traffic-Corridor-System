import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="w-screen h-screen overflow-hidden bg-brand-navy text-white font-sans selection:bg-brand-green/30">
      {currentView === 'landing' ? (
        <Landing onLaunch={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
