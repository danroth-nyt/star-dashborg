import { useEffect, useRef } from 'react';
import { Trash2, Zap, Shield, Target, AlertTriangle, Radio } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import Button from '../ui/Button';

const LOG_ICONS = {
  attack: Zap,
  defense: Shield,
  support: Target,
  damage: AlertTriangle,
  info: Radio,
  combat: Radio,
};

export default function CombatLog() {
  const { spaceCombat, updateSpaceCombat } = useSpaceCombat();
  const logEndRef = useRef(null);
  const logContainerRef = useRef(null);

  // Auto-scroll to bottom when new entries are added (within container only)
  useEffect(() => {
    if (logContainerRef.current) {
      const container = logContainerRef.current;
      const isScrolledToBottom = 
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      if (isScrolledToBottom) {
        // Scroll within container only, not the entire page
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [spaceCombat.combatLog]);

  const clearLog = () => {
    if (confirm('Clear combat log?')) {
      updateSpaceCombat((prev) => ({
        ...prev,
        combatLog: [],
      }));
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'attack':
        return 'text-accent-red border-accent-red/30';
      case 'defense':
        return 'text-accent-cyan border-accent-cyan/30';
      case 'support':
        return 'text-accent-yellow border-accent-yellow/30';
      case 'damage':
        return 'text-accent-red border-accent-red/30';
      case 'info':
        return 'text-accent-cyan border-accent-cyan/30';
      default:
        return 'text-text-primary border-gray-700';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-accent-cyan h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-accent-cyan/30">
        <h2 className="font-orbitron font-bold text-accent-cyan text-sm uppercase">
          Combat Log
        </h2>
        {spaceCombat.combatLog.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearLog}
            className="px-2 py-1 text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Log entries */}
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[300px] max-h-[600px] xl:max-h-[800px]"
      >
        {spaceCombat.combatLog.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm font-orbitron">
            <p>No combat events yet...</p>
          </div>
        ) : (
          <>
            {spaceCombat.combatLog.map((entry, index) => {
              const Icon = LOG_ICONS[entry.type] || LOG_ICONS.info;
              const isRecent = index < 3;
              const hasModifiers = entry.data && (entry.data.rollMode !== 'normal' || entry.data.drAdjust !== 0);
              
              return (
                <div
                  key={entry.id}
                  className={`border-l-3 pl-3 py-2 ${getLogColor(entry.type)} ${
                    isRecent ? 'log-entry-slide' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary break-words">
                        {entry.message}
                      </p>
                      
                      {/* Display modifier badges if present */}
                      {hasModifiers && (
                        <div className="flex gap-1 mt-1">
                          {entry.data.rollMode === 'advantage' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-orbitron font-bold uppercase bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30">
                              ADV
                            </span>
                          )}
                          {entry.data.rollMode === 'disadvantage' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-orbitron font-bold uppercase bg-accent-red/20 text-accent-red border border-accent-red/30">
                              DIS
                            </span>
                          )}
                          {entry.data.drAdjust !== 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-orbitron font-bold bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                              DR {entry.data.drAdjust > 0 ? '+' : ''}{entry.data.drAdjust}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-[10px] text-gray-500 mt-1 font-mono">
                        {formatTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={logEndRef} />
          </>
        )}
      </div>

      {/* Footer stats */}
      <div className="border-t-2 border-accent-cyan/30 p-2 bg-bg-primary/50">
        <p className="text-xs text-gray-400 font-orbitron text-center">
          {spaceCombat.combatLog.length} event{spaceCombat.combatLog.length !== 1 ? 's' : ''} logged
        </p>
      </div>
    </div>
  );
}
