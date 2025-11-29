import React from 'react';
import { Artifact } from '../types';
import { X, Cpu, Shield, Activity, Scale, Zap, Radio } from 'lucide-react';

interface ArtifactDetailProps {
  artifact: Artifact | null;
  onClose: () => void;
}

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({ artifact, onClose }) => {
  if (!artifact) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Gateway': return <Radio className="w-6 h-6" />;
      case 'Kernel': return <Shield className="w-6 h-6" />;
      case 'Forge': return <Cpu className="w-6 h-6" />;
      case 'Protocol': return <Zap className="w-6 h-6" />;
      case 'Sanctuary': return <Scale className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-96 glass-panel border-l border-slate-800 p-6 shadow-2xl transform transition-transform duration-500 overflow-y-auto z-20">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="mt-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ color: artifact.color }}>
            {getIcon(artifact.type)}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
            {artifact.type}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
          {artifact.name}
        </h2>

        <div className="space-y-6">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Function</h3>
            <p className="text-slate-200 leading-relaxed font-light">
              {artifact.description}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <div className="pl-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wide">Testimony</h3>
              <p className="text-lg italic text-slate-300 font-serif leading-relaxed">
                "{artifact.testimony}"
              </p>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Syntropic Connections</h3>
             <div className="flex flex-wrap gap-2">
               {artifact.connections.map(c => (
                 <span key={c} className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                   {c.replace('-', ' ').toUpperCase()}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetail;