import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function OracleResultDisplay({ result, variant = 'cyan', className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [result]);

  if (!result) {
    return null;
  }

  const borderColors = {
    cyan: 'border-accent-cyan',
    yellow: 'border-accent-yellow',
    red: 'border-accent-red',
  };

  const textColors = {
    cyan: 'text-accent-cyan',
    yellow: 'text-accent-yellow',
    red: 'text-accent-red',
  };

  const glowColors = {
    cyan: 'glow-pulse-cyan',
    yellow: 'glow-pulse-yellow',
    red: 'glow-pulse-red',
  };

  const textGlowColors = {
    cyan: 'text-glow-cyan',
    yellow: 'text-glow-yellow',
    red: 'text-glow-red',
  };

  return (
    <div
      className={cn(
        'border-3 bg-bg-secondary p-4 scan-effect',
        borderColors[variant],
        glowColors[variant],
        isVisible ? 'fade-in' : 'opacity-0',
        className
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className={cn('text-xs font-orbitron uppercase tracking-wider flicker', textColors[variant])}>
          ░░░ TRANSMISSION RECEIVED ░░░
        </div>

        {/* Roll Display */}
        {result.roll !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-orbitron">ROLL:</span>
            <span className={cn('text-2xl font-orbitron font-bold', textColors[variant], textGlowColors[variant])}>
              [{result.roll}]
            </span>
          </div>
        )}

        {/* Divider */}
        <div className={cn('h-px', borderColors[variant])} style={{ opacity: 0.3 }} />

        {/* Main Result */}
        {result.result && (
          <div className="space-y-1">
            <div className={cn('text-sm font-orbitron uppercase text-gray-400')}>
              RESULT:
            </div>
            <div className={cn('text-xl font-orbitron font-bold typewriter', textColors[variant], textGlowColors[variant])}>
              {result.result}
            </div>
          </div>
        )}

        {/* Additional Fields */}
        {result.detail && (
          <div className="space-y-1">
            <div className="text-sm font-orbitron uppercase text-gray-400">
              DETAIL:
            </div>
            <div className="text-lg text-text-primary terminal-text">
              {result.detail}
            </div>
          </div>
        )}

        {result.size && (
          <div className="space-y-1">
            <div className="text-sm font-orbitron uppercase text-gray-400">
              SIZE:
            </div>
            <div className="text-lg text-text-primary terminal-text">
              {result.size}
            </div>
          </div>
        )}

        {/* Quick Mission special formatting */}
        {result.action && result.target && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">ACTION:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.action}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">TARGET:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.target}</span>
            </div>
          </div>
        )}

        {/* Scene special formatting */}
        {result.location && result.tone && result.obstacle && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">LOCATION:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.location}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">TONE:</span>
              <span className={cn('text-base terminal-text', textColors[variant])}>{result.tone}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">OBSTACLE:</span>
              <span className={cn('text-base text-accent-red terminal-text')}>{result.obstacle}</span>
            </div>
          </div>
        )}

        {/* Travel Encounter special formatting */}
        {result.theme && result.actor && !result.role && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">THEME:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.theme}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">ACTOR:</span>
              <span className={cn('text-base terminal-text', textColors[variant])}>{result.actor}</span>
            </div>
          </div>
        )}

        {/* Dangerous Location special formatting - multi-roll results with threat */}
        {result.ship && result.base && result.obstacle && result.search && result.shipRoll && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[120px]">SHIP [{result.shipRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.ship}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[120px]">BASE [{result.baseRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text', textColors[variant])}>{result.base}</span>
            </div>
            
            {/* Threat Roll */}
            {result.threatRoll !== undefined && (
              <div className="flex gap-2 items-center">
                <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[120px]">THREAT [{result.threatRoll}]:</span>
                <span className={cn('text-base font-bold', result.obstacleTriggered ? 'text-accent-red' : 'text-gray-500')}>
                  {result.obstacleTriggered ? '⚠ OBSTACLE TRIGGERED' : 'Safe'}
                </span>
              </div>
            )}
            
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[120px]">OBSTACLE [{result.obstacleRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text', result.obstacleTriggered ? 'text-accent-red text-glow-red' : 'text-gray-500')}>{result.obstacle}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[120px]">SEARCH [{result.searchRoll}]:</span>
              <span className={cn('text-base text-accent-yellow terminal-text')}>{result.search}</span>
            </div>
          </div>
        )}

        {/* Complex result rendering for compound generators (Detailed Mission) */}
        {result.type && (
          <div className="space-y-2">
            {Object.entries(result).map(([key, value]) => {
              if (key === 'roll') return null;
              return (
                <div key={key} className="flex gap-2">
                  <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[100px]">
                    {key}:
                  </span>
                  <span className={cn('text-base terminal-text', textColors[variant])}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Event oracle special formatting */}
        {result.verb && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">VERB:</span>
                <div className={cn('text-base font-bold', textColors[variant])}>{result.verb}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SUBJECT:</span>
                <div className={cn('text-base font-bold', textColors[variant])}>{result.subject}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">DESC:</span>
                <div className="text-base text-text-primary">{result.description}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">ACTIVITY:</span>
                <div className="text-base text-text-primary">{result.activity}</div>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">OMEN:</span>
                <div className="text-base text-text-primary">{result.omen}</div>
              </div>
            </div>
          </div>
        )}

        {/* NPC special formatting */}
        {result.role && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">ROLE:</span>
                <div className={cn('text-base font-bold', textColors[variant])}>{result.role}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SPECIES:</span>
                <div className="text-base text-text-primary">{result.species}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">MOTIVATION:</span>
                <div className="text-base text-text-primary">{result.motivation}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SECRET:</span>
                <div className="text-base text-accent-yellow">{result.secret}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">TRAIT:</span>
                <div className="text-base text-text-primary">{result.trait}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">DEMEANOR:</span>
                <div className="text-base text-text-primary">{result.demeanor}</div>
              </div>
            </div>
          </div>
        )}

        {/* Planet special formatting */}
        {result.terrain && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">TERRAIN:</span>
                <div className={cn('text-base', textColors[variant])}>{result.terrain}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">WEATHER:</span>
                <div className="text-base text-text-primary">{result.weather}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">COLOR:</span>
                <div className="text-base text-text-primary">{result.color}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">POPULATION:</span>
                <div className="text-base text-text-primary">{result.population}</div>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">CONTROL:</span>
                <div className="text-base text-text-primary">{result.control}</div>
              </div>
              {result.name && (
                <div className="col-span-2">
                  <span className="text-xs font-orbitron uppercase text-gray-400">NAME:</span>
                  <div className={cn('text-lg font-bold', textColors[variant], textGlowColors[variant])}>
                    {result.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settlement special formatting */}
        {result.appearance && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">APPEARANCE:</span>
                <div className={cn('text-base', textColors[variant])}>{result.appearance}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">KNOWN FOR:</span>
                <div className="text-base text-text-primary">{result.knownFor}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">STATE:</span>
                <div className="text-base text-text-primary">{result.currentState}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">COMPLICATION:</span>
                <div className="text-base text-accent-red">{result.complication}</div>
              </div>
              {result.name && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">NAME:</span>
                  <div className={cn('text-lg font-bold', textColors[variant], textGlowColors[variant])}>
                    {result.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Villain special formatting */}
        {result.villain && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">VILLAIN:</span>
                <div className={cn('text-lg font-bold', textColors[variant], textGlowColors[variant])}>
                  {result.villain}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">GOAL:</span>
                <div className="text-base text-text-primary">{result.goal}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">PLAN:</span>
                <div className="text-base text-text-primary">{result.plan}</div>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">MEANS:</span>
                <div className="text-base text-text-primary">{result.means}</div>
              </div>
            </div>
          </div>
        )}

        {/* Crime Lord special formatting */}
        {result.visage && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">VISAGE:</span>
                <div className="text-base text-text-primary">{result.visage}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">WEAPON:</span>
                <div className="text-base text-accent-red">{result.weapon}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">BASE:</span>
                <div className="text-base text-text-primary">{result.base}</div>
              </div>
            </div>
          </div>
        )}

        {/* Simple string result */}
        {typeof result === 'string' && (
          <div className={cn('text-lg terminal-text', textColors[variant])}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

