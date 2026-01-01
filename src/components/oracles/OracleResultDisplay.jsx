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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-sm font-orbitron">ROLL:</span>
            {result.rolls && result.rollMode ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-sm font-orbitron', 
                  result.rollMode === 'advantage' ? 'text-accent-yellow' : 'text-accent-red'
                )}>
                  {result.rollMode === 'advantage' ? 'ADV' : 'DIS'}
                </span>
                <span className="text-base sm:text-lg font-orbitron text-gray-500">
                  [{result.rolls.join(', ')}]
                </span>
                <span className="text-gray-500">=</span>
                <span className={cn('text-xl sm:text-2xl font-orbitron font-bold', textColors[variant], textGlowColors[variant])}>
                  [{result.roll}]
                </span>
              </div>
            ) : (
              <span className={cn('text-xl sm:text-2xl font-orbitron font-bold', textColors[variant], textGlowColors[variant])}>
                [{result.roll}]
              </span>
            )}
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
            <div className={cn('text-base sm:text-xl font-orbitron font-bold typewriter break-words', textColors[variant], textGlowColors[variant])}>
              {result.result}
            </div>
          </div>
        )}

        {/* Additional Fields - Two Column Layout for Affirmation Oracle */}
        {result.detail && result.size && result.weather && result.npcReaction && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1">
              <div className="text-sm font-orbitron uppercase text-gray-400">
                DETAIL:
              </div>
              <div className="text-base text-text-primary terminal-text break-words">
                {result.detail}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-orbitron uppercase text-gray-400">
                SIZE:
              </div>
              <div className="text-base text-text-primary terminal-text break-words">
                {result.size}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-orbitron uppercase text-gray-400">
                WEATHER:
              </div>
              <div className="text-base text-text-primary terminal-text break-words">
                {result.weather}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-orbitron uppercase text-gray-400">
                NPC REACTION:
              </div>
              <div className="text-base text-text-primary terminal-text break-words">
                {result.npcReaction}
              </div>
            </div>
          </div>
        )}

        {/* Fallback for individual fields (backward compatibility) */}
        {result.detail && !result.weather && (
          <div className="space-y-1">
            <div className="text-sm font-orbitron uppercase text-gray-400">
              DETAIL:
            </div>
            <div className="text-base sm:text-lg text-text-primary terminal-text break-words">
              {result.detail}
            </div>
          </div>
        )}

        {result.size && !result.weather && (
          <div className="space-y-1">
            <div className="text-sm font-orbitron uppercase text-gray-400">
              SIZE:
            </div>
            <div className="text-base sm:text-lg text-text-primary terminal-text break-words">
              {result.size}
            </div>
          </div>
        )}

        {/* Quick Mission special formatting */}
        {result.action && result.target && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                ACTION{result.actionRoll ? ` [${result.actionRoll}]` : ''}:
              </span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.action}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                TARGET{result.targetRoll ? ` [${result.targetRoll}]` : ''}:
              </span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.target}</span>
            </div>
          </div>
        )}

        {/* Scene special formatting */}
        {result.location && result.tone && result.obstacle && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                LOCATION{result.locationRoll ? ` [${result.locationRoll}]` : ''}:
              </span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.location}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                TONE{result.toneRoll ? ` [${result.toneRoll}]` : ''}:
              </span>
              <span className={cn('text-base terminal-text break-words', textColors[variant])}>{result.tone}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                OBSTACLE{result.obstacleRoll ? ` [${result.obstacleRoll}]` : ''}:
              </span>
              <span className={cn('text-base text-accent-red terminal-text break-words')}>{result.obstacle}</span>
            </div>
          </div>
        )}

        {/* Travel Encounter special formatting */}
        {result.theme && result.actor && !result.role && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                THEME{result.themeRoll ? ` [${result.themeRoll}]` : ''}:
              </span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.theme}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                ACTOR{result.actorRoll ? ` [${result.actorRoll}]` : ''}:
              </span>
              <span className={cn('text-base terminal-text break-words', textColors[variant])}>{result.actor}</span>
            </div>
          </div>
        )}

        {/* Dangerous Location special formatting - multi-roll results with threat */}
        {result.ship && result.base && result.obstacle && result.search && result.shipRoll && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[80px] sm:min-w-[120px]">SHIP [{result.shipRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.ship}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[80px] sm:min-w-[120px]">BASE [{result.baseRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text break-words', textColors[variant])}>{result.base}</span>
            </div>
            
            {/* Threat Roll */}
            {result.threatRoll !== undefined && (
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[80px] sm:min-w-[120px]">
                  THREAT [{result.threatRoll}] + [{result.threatDie}] = {result.threatTotal}:
                </span>
                <span className={cn('text-base font-bold break-words', result.obstacleTriggered ? 'text-accent-red' : 'text-gray-500')}>
                  {result.obstacleTriggered ? '⚠ OBSTACLE TRIGGERED' : 'Safe'}
                </span>
              </div>
            )}
            
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[80px] sm:min-w-[120px]">OBSTACLE [{result.obstacleRoll}]:</span>
              <span className={cn('text-base font-bold terminal-text break-words', result.obstacleTriggered ? 'text-accent-red text-glow-red' : 'text-gray-500')}>{result.obstacle}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[80px] sm:min-w-[120px]">SEARCH [{result.searchRoll}]:</span>
              <span className={cn('text-base text-accent-yellow terminal-text break-words')}>{result.search}</span>
            </div>
          </div>
        )}

        {/* Complex result rendering for compound generators (Detailed Mission) */}
        {result.type && result.typeRoll && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                TYPE [{result.typeRoll}]:
              </span>
              <span className={cn('text-base terminal-text font-bold break-words', textColors[variant])}>
                {result.type}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                GOODS [{result.goodsRoll}]:
              </span>
              <span className={cn('text-base terminal-text break-words', textColors[variant])}>
                {result.goods}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                SPOT [{result.spotRoll}]:
              </span>
              <span className={cn('text-base terminal-text break-words', textColors[variant])}>
                {result.spot}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                REWARD [{result.rewardRoll}]:
              </span>
              <span className={cn('text-base terminal-text text-accent-yellow break-words')}>
                {result.reward}
              </span>
            </div>
          </div>
        )}

        {/* Fallback for old-style mission results without roll numbers */}
        {result.type && !result.typeRoll && (
          <div className="space-y-2">
            {Object.entries(result).map(([key, value]) => {
              if (key === 'roll') return null;
              return (
                <div key={key} className="flex gap-2 flex-wrap">
                  <span className="text-sm font-orbitron uppercase text-gray-400 min-w-[70px] sm:min-w-[100px]">
                    {key}:
                  </span>
                  <span className={cn('text-base terminal-text break-words', textColors[variant])}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Event oracle special formatting - multi-roll */}
        {result.verb && result.verbRoll && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">VERB [{result.verbRoll}]:</span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>{result.verb}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SUBJECT [{result.subjectRoll}]:</span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>{result.subject}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">DESC [{result.descRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.description}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">ACTIVITY [{result.activityRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.activity}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">OMEN [{result.omenRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.omen}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SPECIFIC [{result.specificRoll}]:</span>
                <div className={cn('text-base font-bold break-words', textColors[variant], textGlowColors[variant])}>{result.specific}</div>
              </div>
            </div>
          </div>
        )}

        {/* NPC special formatting - multi-roll */}
        {result.role && result.roleRoll && (
          <div className="space-y-3">
            {/* NPC Name - Displayed First and Prominently */}
            {result.name && (
              <div className="space-y-1">
                <span className="text-xs font-orbitron uppercase text-gray-400">NPC NAME:</span>
                <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                  {result.name}
                </div>
              </div>
            )}
            
            {/* NPC Attributes Grid */}
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">ROLE [{result.roleRoll}]:</span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>{result.role}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SPECIES [{result.speciesRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.species}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">MOTIVATION [{result.motivationRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.motivation}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">SECRET [{result.secretRoll}]:</span>
                <div className="text-base text-accent-yellow break-words">{result.secret}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">TRAIT [{result.traitRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.trait}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">DEMEANOR [{result.demeanorRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.demeanor}</div>
              </div>
            </div>
          </div>
        )}

        {/* Planet special formatting */}
        {result.terrain && (
          <div className="space-y-3">
            {/* Planet Name - Displayed First */}
            {result.name && (
              <div className="space-y-1">
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  PLANET NAME{result.nameRoll ? ` [${result.nameRoll}]` : ''}:
                </span>
                <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                  {result.name}
                </div>
              </div>
            )}
            
            {/* Planet Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  TERRAIN{result.terrainRoll ? ` [${result.terrainRoll}]` : ''}:
                </span>
                <div className={cn('text-base break-words', textColors[variant])}>{result.terrain}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  WEATHER{result.weatherRoll ? ` [${result.weatherRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.weather}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  COLOR{result.colorRoll ? ` [${result.colorRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.color}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  POPULATION{result.populationRoll ? ` [${result.populationRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.population}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  CONTROL{result.controlRoll ? ` [${result.controlRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.control}</div>
              </div>
            </div>
          </div>
        )}

        {/* Settlement special formatting */}
        {result.appearance && (
          <div className="space-y-3">
            {/* Settlement Name - Displayed First */}
            {result.name && (
              <div className="space-y-1">
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  SETTLEMENT NAME{result.nameRoll ? ` [${result.nameRoll}]` : ''}:
                </span>
                <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                  {result.name}
                </div>
              </div>
            )}
            
            {/* Settlement Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  APPEARANCE{result.appearanceRoll ? ` [${result.appearanceRoll}]` : ''}:
                </span>
                <div className={cn('text-base break-words', textColors[variant])}>{result.appearance}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  KNOWN FOR{result.knownForRoll ? ` [${result.knownForRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.knownFor}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  STATE{result.currentStateRoll ? ` [${result.currentStateRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.currentState}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  COMPLICATION{result.complicationRoll ? ` [${result.complicationRoll}]` : ''}:
                </span>
                <div className="text-base text-accent-red break-words">{result.complication}</div>
              </div>
              {result.leader && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    LEADER{result.leaderRoll ? ` [${result.leaderRoll}]` : ''}:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.leader}</div>
                </div>
              )}
              {result.landmark && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    LANDMARK{result.landmarkRoll ? ` [${result.landmarkRoll}]` : ''}:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.landmark}</div>
                </div>
              )}
              {result.rumors && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    RUMORS{result.rumorsRoll ? ` [${result.rumorsRoll}]` : ''}:
                  </span>
                  <div className="text-base text-accent-yellow break-words">{result.rumors}</div>
                </div>
              )}
              {result.hookups && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    NPC HOOK-UPS{result.hookupsRoll ? ` [${result.hookupsRoll}]` : ''}:
                  </span>
                  <div className="text-base text-accent-cyan break-words">{result.hookups}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Villain special formatting */}
        {result.villain && !result.visage && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="sm:col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  VILLAIN{result.villainRoll ? ` [${result.villainRoll}]` : ''}:
                </span>
                <div className={cn('text-base sm:text-lg font-bold break-words', textColors[variant], textGlowColors[variant])}>
                  {result.villain}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  GOAL{result.goalRoll ? ` [${result.goalRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.goal}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  PLAN{result.planRoll ? ` [${result.planRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.plan}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  MEANS{result.meansRoll ? ` [${result.meansRoll}]` : ''}:
                </span>
                <div className="text-base text-text-primary break-words">{result.means}</div>
              </div>
            </div>
          </div>
        )}

        {/* Crime Lord special formatting - multi-roll */}
        {result.visage && result.visageRoll && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {result.name && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">NAME [{result.nameRoll}]:</span>
                  <div className={cn('text-base sm:text-lg font-bold break-words', textColors[variant], textGlowColors[variant])}>{result.name}</div>
                </div>
              )}
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">VISAGE [{result.visageRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.visage}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">WEAPON [{result.weaponRoll}]:</span>
                <div className="text-base text-accent-red break-words">{result.weapon}</div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">BASE [{result.baseRoll}]:</span>
                <div className="text-base text-text-primary break-words">{result.base}</div>
              </div>
            </div>
          </div>
        )}

        {/* Monster special formatting - multi-roll */}
        {result.beast && result.monstrosity && result.weakSpot && result.beastRoll && (
          <div className="space-y-2">
            {result.name && (
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">MONSTER NAME:</span>
                <div className={cn('text-base sm:text-lg font-bold break-words', textColors[variant], textGlowColors[variant])}>{result.name}</div>
              </div>
            )}
            <div>
              <span className="text-xs font-orbitron uppercase text-gray-400">BEAST ADAPTATION [d6: {result.beastRoll}]:</span>
              <div className="text-base text-text-primary break-words">{result.beast}</div>
            </div>
            <div>
              <span className="text-xs font-orbitron uppercase text-gray-400">MONSTROSITY [d6: {result.monstrosityRoll}]:</span>
              <div className="text-base text-text-primary break-words">{result.monstrosity}</div>
            </div>
            <div>
              <span className="text-xs font-orbitron uppercase text-gray-400">WEAK SPOT [d6: {result.weakSpotRoll}]:</span>
              <div className="text-base text-accent-yellow break-words">{result.weakSpot}</div>
            </div>
          </div>
        )}

        {/* Incident (Opening Scene or Inciting Incident) - PV or Starforged */}
        {result.incident && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-orbitron uppercase text-gray-400">
                INCIDENT:
              </div>
              <div className={cn('text-base sm:text-lg font-bold break-words', textColors[variant], textGlowColors[variant])}>
                {result.incident}
              </div>
            </div>
            
            {/* Follow-up questions only for PV entries */}
            {result.followUpQuestions && (
              <div className="space-y-2">
                <div className="text-sm font-orbitron uppercase text-gray-400">
                  FOLLOW-UP QUESTIONS:
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-text-primary italic">
                  {result.followUpQuestions.map((question, idx) => (
                    <li key={idx} className="break-words">{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Title Generator special formatting - 4 column rolls */}
        {result.titleType && result.col1 && result.col2 && result.col3 && result.col4 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  [{result.col1Roll}]
                </span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>
                  {result.col1}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  [{result.col2Roll}]
                </span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>
                  {result.col2}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  [{result.col3Roll}]
                </span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>
                  {result.col3}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  [{result.col4Roll}]
                </span>
                <div className={cn('text-base font-bold break-words', textColors[variant])}>
                  {result.col4}
                </div>
              </div>
            </div>
            
            {/* Full Title Display */}
            <div className="pt-2 border-t border-accent-cyan/30">
              <span className="text-xs font-orbitron uppercase text-gray-400">FULL TITLE:</span>
              <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                {result.col1} {result.col2} {result.col3} {result.col4}
              </div>
            </div>
          </div>
        )}

        {/* PV Two-Part Name Results (NPC Name, Surname, Space Opera) */}
        {(result.fullName || result.fullSurname) && result.firstRoll && result.secondRoll && !result.nameFirstRoll && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  1ST PART [d100: {result.firstRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  {result.firstName || result.firstPart}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  2ND PART [d100: {result.secondRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  {result.secondPart}
                </div>
              </div>
            </div>
            
            {/* Full Name Display */}
            <div className="pt-2 border-t border-accent-cyan/30">
              <span className="text-xs font-orbitron uppercase text-gray-400">FULL NAME:</span>
              <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                {result.fullName || result.fullSurname}
              </div>
            </div>
          </div>
        )}

        {/* PV Full NPC Name (4 rolls: first name + surname) */}
        {result.nameFirstRoll && result.nameSecondRoll && result.surnameFirstRoll && result.surnameSecondRoll && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  NAME 1ST [d100: {result.nameFirstRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  {result.firstName.split(' ')[0]}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  NAME 2ND [d100: {result.nameSecondRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  (combined in first name)
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  SURNAME 1ST [d100: {result.surnameFirstRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  {result.surname.split('')[0]}
                </div>
              </div>
              <div>
                <span className="text-xs font-orbitron uppercase text-gray-400">
                  SURNAME 2ND [d100: {result.surnameSecondRoll}]:
                </span>
                <div className="text-base text-text-primary break-words">
                  (combined in surname)
                </div>
              </div>
            </div>
            
            {/* Full Name Display */}
            <div className="pt-2 border-t border-accent-cyan/30">
              <span className="text-xs font-orbitron uppercase text-gray-400">FULL NAME:</span>
              <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                {result.fullName}
              </div>
            </div>
          </div>
        )}

        {/* PV Template-Based Names (Settlement, Faction) */}
        {result.template && result.templateRoll && result.fullName && (
          <div className="space-y-3">
            {/* Template */}
            <div>
              <span className="text-xs font-orbitron uppercase text-gray-400">
                TEMPLATE [d100: {result.templateRoll}]:
              </span>
              <div className="text-sm text-gray-400 break-words font-mono">
                {result.template}
              </div>
            </div>

            {/* Component Rolls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.quality && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    QUALITY [{result.qualityRoll}]:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.quality}</div>
                </div>
              )}
              {result.adjective && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    ADJECTIVE [{result.adjectiveRoll}]:
                  </span>
                  <div className="text-base text-text-primary break-words">
                    {result.adjective}
                    {result.adjectiveIsNPCName && <span className="text-xs text-gray-500"> (NPC Name)</span>}
                    {result.adjectiveIsNPCSurname && <span className="text-xs text-gray-500"> (NPC Surname)</span>}
                    {result.adjectiveIsPlaceName && <span className="text-xs text-gray-500"> (Place)</span>}
                  </div>
                </div>
              )}
              {result.form && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    FORM [{result.formRoll}]:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.form}</div>
                </div>
              )}
              {result.number !== undefined && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    NUMBER [3d10: {result.numberRolls?.join(', ')}]:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.number}</div>
                </div>
              )}
              {result.structure && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    STRUCTURE [{result.structureRoll}]:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.structure}</div>
                </div>
              )}
              {result.noun && (
                <div>
                  <span className="text-xs font-orbitron uppercase text-gray-400">
                    NOUN [{result.nounRoll}]:
                  </span>
                  <div className="text-base text-text-primary break-words">{result.noun}</div>
                </div>
              )}
            </div>

            {/* Full Name Display */}
            <div className="pt-2 border-t border-accent-cyan/30">
              <span className="text-xs font-orbitron uppercase text-gray-400">GENERATED NAME:</span>
              <div className={cn('text-base sm:text-xl font-bold break-words', textColors[variant], textGlowColors[variant])}>
                {result.fullName}
              </div>
            </div>
          </div>
        )}

        {/* Simple string result */}
        {typeof result === 'string' && (
          <div className={cn('text-base sm:text-lg terminal-text break-words', textColors[variant])}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

