import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

/**
 * Formats oracle result for clipboard copying
 * Handles all result types intelligently
 */
function formatResultForCopy(result) {
  if (!result) return '';
  
  const lines = [];
  
  // Header
  lines.push('═══ ORACLE RESULT ═══');
  lines.push('');
  
  // Roll information
  if (result.roll !== undefined) {
    if (result.rolls && result.rollMode) {
      const mode = result.rollMode === 'advantage' ? 'ADV' : 'DIS';
      lines.push(`ROLL (${mode}): [${result.rolls.join(', ')}] = [${result.roll}]`);
    } else {
      lines.push(`ROLL: [${result.roll}]`);
    }
  }
  
  // Main result
  if (result.result) {
    lines.push(`RESULT: ${result.result}`);
  }
  
  // Handle different result types
  
  // Simple detail field
  if (result.detail && !result.weather && !result.size) {
    lines.push(`DETAIL: ${result.detail}`);
  }
  
  // Affirmation oracle (detail, size, weather, npcReaction)
  if (result.detail && result.size && result.weather && result.npcReaction) {
    lines.push(`DETAIL: ${result.detail}`);
    lines.push(`SIZE: ${result.size}`);
    lines.push(`WEATHER: ${result.weather}`);
    lines.push(`NPC REACTION: ${result.npcReaction}`);
  }
  
  // Quick Mission (action, target)
  if (result.action && result.target) {
    lines.push(`ACTION${result.actionRoll ? ` [${result.actionRoll}]` : ''}: ${result.action}`);
    lines.push(`TARGET${result.targetRoll ? ` [${result.targetRoll}]` : ''}: ${result.target}`);
  }
  
  // Scene (location, tone, obstacle)
  if (result.location && result.tone && result.obstacle) {
    lines.push(`LOCATION${result.locationRoll ? ` [${result.locationRoll}]` : ''}: ${result.location}`);
    lines.push(`TONE${result.toneRoll ? ` [${result.toneRoll}]` : ''}: ${result.tone}`);
    lines.push(`OBSTACLE${result.obstacleRoll ? ` [${result.obstacleRoll}]` : ''}: ${result.obstacle}`);
  }
  
  // Travel Encounter (theme, actor)
  if (result.theme && result.actor && !result.role) {
    lines.push(`THEME${result.themeRoll ? ` [${result.themeRoll}]` : ''}: ${result.theme}`);
    lines.push(`ACTOR${result.actorRoll ? ` [${result.actorRoll}]` : ''}: ${result.actor}`);
  }
  
  // Dangerous Location (ship, base, obstacle, search, threat)
  if (result.ship && result.base && result.obstacle && result.search && result.shipRoll) {
    lines.push(`SHIP [${result.shipRoll}]: ${result.ship}`);
    lines.push(`BASE [${result.baseRoll}]: ${result.base}`);
    if (result.threatRoll !== undefined) {
      lines.push(`THREAT [${result.threatRoll}] + [${result.threatDie}] = ${result.threatTotal}: ${result.obstacleTriggered ? '⚠ OBSTACLE TRIGGERED' : 'Safe'}`);
    }
    lines.push(`OBSTACLE [${result.obstacleRoll}]: ${result.obstacle}`);
    lines.push(`SEARCH [${result.searchRoll}]: ${result.search}`);
  }
  
  // Detailed Mission (type, goods, spot, reward)
  if (result.type && result.typeRoll) {
    lines.push(`TYPE [${result.typeRoll}]: ${result.type}`);
    lines.push(`GOODS [${result.goodsRoll}]: ${result.goods}`);
    lines.push(`SPOT [${result.spotRoll}]: ${result.spot}`);
    lines.push(`REWARD [${result.rewardRoll}]: ${result.reward}`);
  }
  
  // Event Oracle (verb, subject, description, activity, omen, specific)
  if (result.verb && result.verbRoll) {
    lines.push(`VERB [${result.verbRoll}]: ${result.verb}`);
    lines.push(`SUBJECT [${result.subjectRoll}]: ${result.subject}`);
    lines.push(`DESC [${result.descRoll}]: ${result.description}`);
    lines.push(`ACTIVITY [${result.activityRoll}]: ${result.activity}`);
    lines.push(`OMEN [${result.omenRoll}]: ${result.omen}`);
    lines.push(`SPECIFIC [${result.specificRoll}]: ${result.specific}`);
  }
  
  // NPC (role, species, motivation, secret, trait, demeanor)
  if (result.role && result.roleRoll) {
    if (result.name) {
      lines.push(`NPC NAME: ${result.name}`);
    }
    lines.push(`ROLE [${result.roleRoll}]: ${result.role}`);
    lines.push(`SPECIES [${result.speciesRoll}]: ${result.species}`);
    lines.push(`MOTIVATION [${result.motivationRoll}]: ${result.motivation}`);
    lines.push(`SECRET [${result.secretRoll}]: ${result.secret}`);
    lines.push(`TRAIT [${result.traitRoll}]: ${result.trait}`);
    lines.push(`DEMEANOR [${result.demeanorRoll}]: ${result.demeanor}`);
  }
  
  // Planet (terrain, weather, color, population, control)
  if (result.terrain) {
    if (result.name) {
      lines.push(`PLANET NAME${result.nameRoll ? ` [${result.nameRoll}]` : ''}: ${result.name}`);
    }
    lines.push(`TERRAIN${result.terrainRoll ? ` [${result.terrainRoll}]` : ''}: ${result.terrain}`);
    lines.push(`WEATHER${result.weatherRoll ? ` [${result.weatherRoll}]` : ''}: ${result.weather}`);
    lines.push(`COLOR${result.colorRoll ? ` [${result.colorRoll}]` : ''}: ${result.color}`);
    lines.push(`POPULATION${result.populationRoll ? ` [${result.populationRoll}]` : ''}: ${result.population}`);
    lines.push(`CONTROL${result.controlRoll ? ` [${result.controlRoll}]` : ''}: ${result.control}`);
  }
  
  // Settlement (appearance, knownFor, currentState, complication, leader, landmark, rumors, hookups)
  if (result.appearance) {
    if (result.name) {
      lines.push(`SETTLEMENT NAME${result.nameRoll ? ` [${result.nameRoll}]` : ''}: ${result.name}`);
    }
    lines.push(`APPEARANCE${result.appearanceRoll ? ` [${result.appearanceRoll}]` : ''}: ${result.appearance}`);
    lines.push(`KNOWN FOR${result.knownForRoll ? ` [${result.knownForRoll}]` : ''}: ${result.knownFor}`);
    lines.push(`STATE${result.currentStateRoll ? ` [${result.currentStateRoll}]` : ''}: ${result.currentState}`);
    lines.push(`COMPLICATION${result.complicationRoll ? ` [${result.complicationRoll}]` : ''}: ${result.complication}`);
    if (result.leader) lines.push(`LEADER${result.leaderRoll ? ` [${result.leaderRoll}]` : ''}: ${result.leader}`);
    if (result.landmark) lines.push(`LANDMARK${result.landmarkRoll ? ` [${result.landmarkRoll}]` : ''}: ${result.landmark}`);
    if (result.rumors) lines.push(`RUMORS${result.rumorsRoll ? ` [${result.rumorsRoll}]` : ''}: ${result.rumors}`);
    if (result.hookups) lines.push(`NPC HOOK-UPS${result.hookupsRoll ? ` [${result.hookupsRoll}]` : ''}: ${result.hookups}`);
  }
  
  // Villain (villain, goal, plan, means)
  if (result.villain && !result.visage) {
    lines.push(`VILLAIN${result.villainRoll ? ` [${result.villainRoll}]` : ''}: ${result.villain}`);
    lines.push(`GOAL${result.goalRoll ? ` [${result.goalRoll}]` : ''}: ${result.goal}`);
    lines.push(`PLAN${result.planRoll ? ` [${result.planRoll}]` : ''}: ${result.plan}`);
    lines.push(`MEANS${result.meansRoll ? ` [${result.meansRoll}]` : ''}: ${result.means}`);
  }
  
  // Crime Lord (name, visage, weapon, base)
  if (result.visage && result.visageRoll) {
    if (result.name) {
      lines.push(`NAME [${result.nameRoll}]: ${result.name}`);
    }
    lines.push(`VISAGE [${result.visageRoll}]: ${result.visage}`);
    lines.push(`WEAPON [${result.weaponRoll}]: ${result.weapon}`);
    lines.push(`BASE [${result.baseRoll}]: ${result.base}`);
  }
  
  // Monster (beast, monstrosity, weakSpot)
  if (result.beast && result.monstrosity && result.weakSpot && result.beastRoll) {
    if (result.name) {
      lines.push(`MONSTER NAME: ${result.name}`);
    }
    lines.push(`BEAST ADAPTATION [d6: ${result.beastRoll}]: ${result.beast}`);
    lines.push(`MONSTROSITY [d6: ${result.monstrosityRoll}]: ${result.monstrosity}`);
    lines.push(`WEAK SPOT [d6: ${result.weakSpotRoll}]: ${result.weakSpot}`);
  }
  
  // Incident (incident, followUpQuestions)
  if (result.incident) {
    lines.push(`INCIDENT: ${result.incident}`);
    if (result.followUpQuestions && result.followUpQuestions.length > 0) {
      lines.push('FOLLOW-UP QUESTIONS:');
      result.followUpQuestions.forEach(q => lines.push(`  - ${q}`));
    }
  }
  
  // Title Generator (col1, col2, col3, col4)
  if (result.titleType && result.col1 && result.col2 && result.col3 && result.col4) {
    lines.push(`TITLE TYPE: ${result.titleType === 'epic' ? 'Campaign Title' : 'Episode Title'}`);
    lines.push(`[${result.col1Roll}] ${result.col1}`);
    lines.push(`[${result.col2Roll}] ${result.col2}`);
    lines.push(`[${result.col3Roll}] ${result.col3}`);
    lines.push(`[${result.col4Roll}] ${result.col4}`);
    lines.push('');
    lines.push(`FULL TITLE: ${result.col1} ${result.col2} ${result.col3} ${result.col4}`);
  }
  
  // PV Two-Part Names (fullName, fullSurname)
  if ((result.fullName || result.fullSurname) && result.firstRoll && result.secondRoll && !result.nameFirstRoll) {
    lines.push(`1ST PART [d100: ${result.firstRoll}]: ${result.firstName || result.firstPart}`);
    lines.push(`2ND PART [d100: ${result.secondRoll}]: ${result.secondPart}`);
    lines.push('');
    lines.push(`FULL NAME: ${result.fullName || result.fullSurname}`);
  }
  
  // PV Full NPC Name (nameFirstRoll, nameSecondRoll, surnameFirstRoll, surnameSecondRoll)
  if (result.nameFirstRoll && result.nameSecondRoll && result.surnameFirstRoll && result.surnameSecondRoll) {
    lines.push(`NAME 1ST [d100: ${result.nameFirstRoll}]: ${result.firstName.split(' ')[0]}`);
    lines.push(`NAME 2ND [d100: ${result.nameSecondRoll}]: (combined in first name)`);
    lines.push(`SURNAME 1ST [d100: ${result.surnameFirstRoll}]: ${result.surname.split('')[0]}`);
    lines.push(`SURNAME 2ND [d100: ${result.surnameSecondRoll}]: (combined in surname)`);
    lines.push('');
    lines.push(`FULL NAME: ${result.fullName}`);
  }
  
  // PV Template-Based Names (template, quality, adjective, form, number, structure, noun)
  if (result.template && result.templateRoll && result.fullName) {
    lines.push(`TEMPLATE [d100: ${result.templateRoll}]: ${result.template}`);
    if (result.quality) lines.push(`QUALITY [${result.qualityRoll}]: ${result.quality}`);
    if (result.adjective) {
      let adjLine = `ADJECTIVE [${result.adjectiveRoll}]: ${result.adjective}`;
      if (result.adjectiveIsNPCName) adjLine += ' (NPC Name)';
      if (result.adjectiveIsNPCSurname) adjLine += ' (NPC Surname)';
      if (result.adjectiveIsPlaceName) adjLine += ' (Place)';
      lines.push(adjLine);
    }
    if (result.form) lines.push(`FORM [${result.formRoll}]: ${result.form}`);
    if (result.number !== undefined) lines.push(`NUMBER [3d10: ${result.numberRolls?.join(', ')}]: ${result.number}`);
    if (result.structure) lines.push(`STRUCTURE [${result.structureRoll}]: ${result.structure}`);
    if (result.noun) lines.push(`NOUN [${result.nounRoll}]: ${result.noun}`);
    lines.push('');
    lines.push(`GENERATED NAME: ${result.fullName}`);
  }
  
  // Simple string result
  if (typeof result === 'string') {
    lines.push(result);
  }
  
  lines.push('');
  lines.push('═════════════════════');
  
  return lines.join('\n');
}

export default function OracleResultDisplay({ result, variant = 'cyan', className, currentIndex = 0, totalResults = 0, onNavigate, onClear }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [slideDirection, setSlideDirection] = useState('none');

  // Handle result changes with slide animation
  useEffect(() => {
    if (result) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [result]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (currentIndex < totalResults - 1 && onNavigate) {
      setSlideDirection('right');
      setTimeout(() => {
        onNavigate(currentIndex + 1);
        setSlideDirection('none');
      }, 150);
    }
  }, [currentIndex, totalResults, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex > 0 && onNavigate) {
      setSlideDirection('left');
      setTimeout(() => {
        onNavigate(currentIndex - 1);
        setSlideDirection('none');
      }, 150);
    }
  }, [currentIndex, totalResults, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!onNavigate || totalResults <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalResults, onNavigate, handlePrevious, handleNext]);

  // Swipe gesture support
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handlePrevious,
    onSwipeRight: handleNext,
    threshold: 50
  });

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      const formattedText = formatResultForCopy(result);
      await navigator.clipboard.writeText(formattedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [result]);

  if (!result) {
    return null;
  }

  const isViewingHistory = currentIndex > 0;
  const hasHistory = totalResults > 1;

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
        'border-3 bg-bg-secondary scan-effect relative overflow-hidden',
        borderColors[variant],
        glowColors[variant],
        isVisible ? 'fade-in' : 'opacity-0',
        className
      )}
    >
      {/* Amber tint overlay when viewing history */}
      {isViewingHistory && (
        <div className="absolute inset-0 bg-accent-yellow/5 pointer-events-none z-0" />
      )}

      {/* Main content with swipe support */}
      <div
        {...swipeHandlers}
        className={cn(
          'p-4 relative z-10 transition-transform duration-150',
          slideDirection === 'left' && '-translate-x-2 opacity-80',
          slideDirection === 'right' && 'translate-x-2 opacity-80'
        )}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className={cn('text-xs font-orbitron uppercase tracking-wider flicker', textColors[variant])}>
              ░░░ TRANSMISSION RECEIVED ░░░
            </div>
            {isViewingHistory && (
              <div className="text-xs font-orbitron uppercase tracking-wider text-accent-yellow/80 bg-accent-yellow/10 px-2 py-1 border border-accent-yellow/30">
                HISTORY
              </div>
            )}
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

        {/* Navigation and Controls Footer */}
        <div className="flex items-center justify-between gap-4 pt-3 mt-3 border-t border-gray-700/50">
          {/* Left: Chevron Navigation */}
          {hasHistory ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex >= totalResults - 1}
                className={cn(
                  'p-1.5 sm:p-2 border-2 transition-all',
                  currentIndex >= totalResults - 1
                    ? 'border-gray-700 text-gray-700 cursor-not-allowed'
                    : 'border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
                )}
                aria-label="Previous result"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dot Pagination */}
              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: Math.min(totalResults, 10) }).map((_, idx) => {
                  // Reverse the visual order: leftmost = oldest (highest index), rightmost = newest (index 0)
                  const resultIndex = totalResults - 1 - idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => onNavigate && onNavigate(resultIndex)}
                      className={cn(
                        'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all border',
                        resultIndex === currentIndex
                          ? `${borderColors[variant]} bg-current scale-125`
                          : 'border-gray-600 bg-gray-600 hover:bg-gray-400'
                      )}
                      aria-label={`Go to result ${resultIndex + 1}`}
                    />
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex <= 0}
                className={cn(
                  'p-1.5 sm:p-2 border-2 transition-all',
                  currentIndex <= 0
                    ? 'border-gray-700 text-gray-700 cursor-not-allowed'
                    : 'border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
                )}
                aria-label="Next result"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Right: Clear All & Copy Buttons */}
          <div className="flex items-center gap-2">
            {/* Clear All Button - only show when history exists */}
            {hasHistory && onClear && (
              <button
                onClick={onClear}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-orbitron uppercase border-2 transition-all whitespace-nowrap',
                  'bg-transparent border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary'
                )}
                aria-label="Clear all results"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">CLEAR</span>
              </button>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-orbitron uppercase border-2 transition-all whitespace-nowrap',
                isCopied
                  ? 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow'
                  : 'bg-transparent border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
              )}
              disabled={isCopied}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">COPY</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

