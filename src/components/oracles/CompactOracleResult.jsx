import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CompactOracleResult({ result, variant = 'cyan', onDismiss }) {
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

  const textGlowColors = {
    cyan: 'text-glow-cyan',
    yellow: 'text-glow-yellow',
    red: 'text-glow-red',
  };

  return (
    <div
      className={cn(
        'border-2 bg-bg-primary p-3 mt-3 relative',
        borderColors[variant],
        isVisible ? 'fade-in' : 'opacity-0'
      )}
    >
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'absolute top-1 right-1 p-1 hover:bg-opacity-20 transition-colors',
            textColors[variant]
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <div className="space-y-2">
        {/* Roll Display */}
        {result.roll !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-orbitron">ROLL:</span>
            <span className={cn('font-orbitron font-bold', textColors[variant], textGlowColors[variant])}>
              [{result.roll}]
            </span>
          </div>
        )}

        {/* Main Result */}
        {result.result && (
          <div className={cn('text-sm font-orbitron font-bold', textColors[variant], textGlowColors[variant])}>
            {result.result}
          </div>
        )}

        {/* Detail */}
        {result.detail && !result.weather && (
          <div className="text-xs text-text-primary">
            {result.detail}
          </div>
        )}

        {/* Affirmation Oracle (Multi-field) */}
        {result.size && result.weather && result.npcReaction && (
          <div className="space-y-1 text-xs">
            <div><span className="text-gray-400">Detail:</span> {result.detail}</div>
            <div><span className="text-gray-400">Size:</span> {result.size}</div>
            <div><span className="text-gray-400">Weather:</span> {result.weather}</div>
            <div><span className="text-gray-400">NPC:</span> {result.npcReaction}</div>
          </div>
        )}

        {/* Detailed Mission */}
        {result.type && result.typeRoll && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Type [{result.typeRoll}]:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Goods [{result.goodsRoll}]:</span>{' '}
              <span className={textColors[variant]}>{result.goods}</span>
            </div>
            <div>
              <span className="text-gray-400">Spot [{result.spotRoll}]:</span>{' '}
              <span className={textColors[variant]}>{result.spot}</span>
            </div>
            <div>
              <span className="text-gray-400">Reward [{result.rewardRoll}]:</span>{' '}
              <span className="text-accent-yellow">{result.reward}</span>
            </div>
          </div>
        )}

        {/* Quick Mission */}
        {result.action && result.target && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Action:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.action}</span>
            </div>
            <div>
              <span className="text-gray-400">Target:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.target}</span>
            </div>
          </div>
        )}

        {/* Scene */}
        {result.location && result.tone && result.obstacle && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Location:</span>{' '}
              <span className={textColors[variant]}>{result.location}</span>
            </div>
            <div>
              <span className="text-gray-400">Tone:</span> {result.tone}
            </div>
            <div>
              <span className="text-gray-400">Obstacle:</span>{' '}
              <span className="text-accent-red">{result.obstacle}</span>
            </div>
          </div>
        )}

        {/* Event Oracle */}
        {result.verb && result.subject && (
          <div className="space-y-1 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Verb:</span> {result.verb}
              </div>
              <div>
                <span className="text-gray-400">Subject:</span> {result.subject}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Specific:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.specific}</span>
            </div>
          </div>
        )}

        {/* NPC */}
        {result.role && result.species && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Role:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.role}</span>
            </div>
            <div><span className="text-gray-400">Species:</span> {result.species}</div>
            <div><span className="text-gray-400">Motivation:</span> {result.motivation}</div>
            <div><span className="text-gray-400">Secret:</span> {result.secret}</div>
            <div><span className="text-gray-400">Trait:</span> {result.trait}</div>
          </div>
        )}

        {/* Planet */}
        {result.terrain && result.weather && !result.npcReaction && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Terrain:</span>{' '}
              <span className={textColors[variant]}>{result.terrain}</span>
            </div>
            <div><span className="text-gray-400">Weather:</span> {result.weather}</div>
            <div><span className="text-gray-400">Color:</span> {result.color}</div>
            <div><span className="text-gray-400">Population:</span> {result.population}</div>
            <div><span className="text-gray-400">Control:</span> {result.control}</div>
            {result.name && (
              <div>
                <span className="text-gray-400">Name:</span>{' '}
                <span className={cn('font-bold', textColors[variant], textGlowColors[variant])}>{result.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Villain */}
        {result.villain && !result.visage && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Villain:</span>{' '}
              <span className={cn('font-bold', textColors[variant])}>{result.villain}</span>
            </div>
            <div><span className="text-gray-400">Goal:</span> {result.goal}</div>
            <div><span className="text-gray-400">Plan:</span> {result.plan}</div>
            <div><span className="text-gray-400">Means:</span> {result.means}</div>
          </div>
        )}

        {/* Title Generator (Epic/Episode) */}
        {result.titleType && result.col1 && result.col2 && result.col3 && result.col4 && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-1 text-xs">
              <div className={textColors[variant]}>{result.col1}</div>
              <div className={textColors[variant]}>{result.col2}</div>
              <div className={textColors[variant]}>{result.col3}</div>
              <div className={textColors[variant]}>{result.col4}</div>
            </div>
            <div className={cn('text-sm font-bold font-orbitron', textColors[variant], textGlowColors[variant])}>
              {result.col1} {result.col2} {result.col3} {result.col4}
            </div>
          </div>
        )}

        {/* Simple string result */}
        {typeof result === 'string' && (
          <div className={cn('text-sm', textColors[variant])}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
