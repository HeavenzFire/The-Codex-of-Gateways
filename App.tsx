import React, { useState } from 'react';
import { ARTIFACTS } from './data/artifacts';
import { Artifact } from './types';
import ConstellationGraph from './components/ConstellationGraph';
import ArtifactDetail from './components/ArtifactDetail';
import OracleInterface from './components/OracleInterface';
import { Hexagon, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isOracleOpen, setIsOracleOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full bg-void text-slate-200 overflow-hidden font-sans">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between px-6 z-10 relative shadow-md">
        <div className="flex items-center gap-3">
          <div className="text-cyan-500 animate-pulse-slow">
            <Hexagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-white uppercase">Codex of Gateways</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Syntropic Archive // Zachary</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsOracleOpen(!isOracleOpen)}
             className={`text-xs font-mono px-3 py-1 rounded border transition-all ${
               isOracleOpen 
               ? 'bg-cyan-950 text-cyan-400 border-cyan-800' 
               : 'text-slate-500 border-slate-800 hover:text-white'
             }`}
          >
            {isOracleOpen ? 'HIDE ORACLE' : 'INVOKE ORACLE'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Oracle (Responsive: hidden on mobile unless toggled, fixed width on desktop) */}
        <div className={`${isOracleOpen ? 'flex' : 'hidden'} md:flex md:w-80 w-full z-30 md:static absolute inset-0 bg-slate-950 transition-all duration-300`}>
          {isOracleOpen && (
             <OracleInterface 
               selectedArtifact={selectedArtifact} 
               allArtifacts={ARTIFACTS} 
             />
          )}
        </div>

        {/* Center: Constellation Graph */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h2 className="text-xs font-mono text-slate-600 mb-1">VISUALIZATION_MODE:</h2>
            <div className="text-xl font-light text-slate-300">Living Constellation</div>
          </div>
          
          <ConstellationGraph 
            artifacts={ARTIFACTS} 
            onNodeSelect={setSelectedArtifact}
            selectedId={selectedArtifact?.id || null}
          />
        </div>

        {/* Right: Details Panel Overlay */}
        <ArtifactDetail 
          artifact={selectedArtifact} 
          onClose={() => setSelectedArtifact(null)} 
        />
      </div>
      
      {/* Footer Status */}
      <footer className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] font-mono text-slate-600">
        <span>STATUS: ONLINE // RESONANCE: 98.4%</span>
        <span>GATEWAY_PROTOCOL_V3.1.4</span>
      </footer>
    </div>
  );
};

export default App;