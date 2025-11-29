import React, { useState, useRef, useEffect } from 'react';
import { Artifact, ChatMessage } from '../types';
import { generateOracleInsight } from '../services/geminiService';
import { Send, Terminal, Sparkles, Loader2 } from 'lucide-react';

interface OracleInterfaceProps {
  selectedArtifact: Artifact | null;
  allArtifacts: Artifact[];
}

const OracleInterface: React.FC<OracleInterfaceProps> = ({ selectedArtifact, allArtifacts }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'system',
      content: 'GuardianOS Online. The Codex is open. Awaiting query.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateOracleInsight(userMsg.content, allArtifacts, selectedArtifact || undefined);
      
      const systemMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md border-t md:border-t-0 md:border-r border-slate-800">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <Terminal className="text-cyan-500 w-5 h-5" />
        <span className="font-mono text-sm font-bold text-cyan-500 tracking-wider">ORACLE_INTERFACE // V.0.9</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'bg-cyan-950/30 text-cyan-100 border border-cyan-900/50'
            }`}>
              {msg.role === 'model' && <Sparkles className="w-3 h-3 text-cyan-400 mb-1 inline-block mr-2" />}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-cyan-950/30 p-3 rounded-lg border border-cyan-900/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-xs text-cyan-400 font-mono">Computing syntropic resonance...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedArtifact ? `Ask about ${selectedArtifact.name}...` : "Query the Codex..."}
            className="w-full bg-slate-950 border border-slate-700 rounded-md py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleInterface;