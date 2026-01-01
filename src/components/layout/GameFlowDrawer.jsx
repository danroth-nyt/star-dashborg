import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, Play, Dice6, Target, Clock, Scroll, Map, Zap, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGame } from '../../context/GameContext';
import CompactOracleResult from '../oracles/CompactOracleResult';
import {
  rollOnTable,
  rollAffirmation,
  rollEventOracle,
  rollSceneShakeup,
  generateEpicTitle,
  generateEpisodeTitle,
  generateVillain,
  generateMission,
  generateQuickMission,
  generateScene,
  generateNPC,
  generatePlanet,
  generateOpeningScene,
  generateIncitingIncident,
  characterOracles,
  soloOracles,
  visualOracles
} from '../../data/oracles';

export default function GameFlowDrawer({ isOpen, onClose }) {
  const [expandedStep, setExpandedStep] = useState(null);
  const [stepResults, setStepResults] = useState({}); // Store results per step
  const { addLog, gameState } = useGame();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build actions list for Campaign Goal step based on source toggles
  const campaignGoalActions = [
    { label: "Generate Epic Title", specific: "epicTitle" },
    { label: "Generate Villain Plot", specific: "villain" }
  ];
  // Show Inciting Incident if either PV or Starforged is enabled
  if (gameState.includePVOracles || gameState.includeStarforgedOracles) {
    campaignGoalActions.push({ label: "Generate Inciting Incident", specific: "inciting" });
  }

  const gameFlowSteps = [
    {
      id: 1,
      title: "Create Character(s)",
      subtitle: "Campaign Start Only",
      icon: Play,
      color: "cyan",
      description: "Use the rules in the Star Borg Rebel Handbook to create your character.",
      actions: [
        { label: "Character Creation", tab: "creation" },
        { label: "Roll Species", specific: "species" },
        { label: "Roll Motivation", specific: "motivation" }
      ]
    },
    {
      id: 2,
      title: "Roll Campaign Goal",
      subtitle: "Campaign Start Only",
      icon: Target,
      color: "yellow",
      description: "Roll on the Epic and Damn Fool Idealistic Crusade Tables to determine your Rebel's main goal to save the galaxy.",
      actions: campaignGoalActions
    },
    {
      id: 3,
      title: "Current Mission",
      subtitle: "Session Play",
      icon: Scroll,
      color: "cyan",
      description: "Roll on the Episode and Mission Tables to determine your Rebel's current mission.",
      actions: [
        { label: "Generate Episode Title", specific: "episodeTitle" },
        { label: "Generate Mission", specific: "mission" }
      ]
    },
    {
      id: 4,
      title: "Set Threat & Tracks",
      subtitle: "Session Play",
      icon: Clock,
      color: "red",
      description: "Set the Threat Die to 1 and take note of any Mission Tracks and Danger Clocks.",
      actions: [
        { label: "Reset Threat Die", specific: "threatDie" },
        { label: "Add Mission Track", specific: "missionTrack" },
        { label: "Add Danger Clock", specific: "dangerClock" }
      ]
    },
    {
      id: 5,
      title: "Opening Scene",
      subtitle: "Session Play",
      icon: Zap,
      color: "yellow",
      description: "Roll on the Opening Scene table to determine how the action begins.",
      actions: [
        { label: "Roll Opening Scene", specific: "openingScene" },
        { label: "Generate Scene", specific: "scene" }
      ]
    },
    {
      id: 6,
      title: "Use Solo Tools",
      subtitle: "Session Play",
      icon: Dice6,
      color: "cyan",
      description: "Use the Solo Tools, tables, oracles, and your imagination to generate locations, obstacles, characters, and see where your adventure leads.",
      actions: [
        { label: "Ask Oracle", specific: "askOracle" },
        { label: "Generate NPC", specific: "npc" },
        { label: "Generate Planet", specific: "planet" }
      ]
    },
    {
      id: 7,
      title: "Resolve Actions",
      subtitle: "Session Play",
      icon: Target,
      color: "red",
      description: "Use the Star Borg Core and Solo rules to resolve your Rebel's actions, adjusting the Threat Die accordingly and take note of the consequences.",
      actions: [
        { label: "Roll Dice", specific: "dice" },
        { label: "Crit/Blunder Table", specific: "critBlunder" }
      ]
    },
    {
      id: 8,
      title: "Continue Scene",
      subtitle: "Session Play",
      icon: Zap,
      color: "yellow",
      description: "Roll a Scene Shakeup, Event, or reference the Boost Oracle to continue the scene.",
      actions: [
        { label: "Scene Shakeup", specific: "shakeup" },
        { label: "Event Oracle", specific: "event" },
        { label: "Boost Oracle", specific: "boost" }
      ]
    },
    {
      id: 9,
      title: "Record & Check Progress",
      subtitle: "Session Play",
      icon: CheckCircle,
      color: "cyan",
      description: "When a scene's action is completely resolved, record the pertinent details and check for progress on the Mission Tracks and Danger Clocks.",
      actions: [
        { label: "Update Journal", specific: "journal" },
        { label: "Check Tracks", specific: "tracks" }
      ]
    },
    {
      id: 10,
      title: "Prepare Next Scene",
      subtitle: "Session Play",
      icon: Map,
      color: "yellow",
      description: "Prepare the next scene by rolling on the Scene or Event Oracle Tables.",
      actions: [
        { label: "Generate Scene", specific: "scene" },
        { label: "Event Oracle", specific: "event" }
      ]
    }
  ];

  const handleStepClick = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleQuickAction = (stepId, actionType, variant = 'cyan') => {
    let result = null;
    let logMessage = '';

    switch (actionType) {
      case 'species':
        result = rollOnTable(characterOracles.galacticSpecies);
        logMessage = `Species: ${result}`;
        result = { result, roll: Math.floor(Math.random() * 10) + 1 };
        break;

      case 'motivation':
        result = rollOnTable(characterOracles.rebelMotivations);
        logMessage = `Motivation: ${result}`;
        result = { result, roll: Math.floor(Math.random() * 10) + 1 };
        break;

      case 'epicTitle':
        result = generateEpicTitle();
        result.titleType = 'epic';
        logMessage = `Epic Title [${result.col1Roll}, ${result.col2Roll}, ${result.col3Roll}, ${result.col4Roll}]: ${result.col1} ${result.col2} ${result.col3} ${result.col4}`;
        break;

      case 'villain':
        result = generateVillain();
        logMessage = `Villain: ${result.villain}`;
        break;

      case 'inciting':
        result = generateIncitingIncident(gameState.includePVOracles, gameState.includeStarforgedOracles);
        if (result) {
          logMessage = `Inciting Incident [${result.diceType} ${result.roll}]: ${result.incident}`;
        } else {
          result = { result: 'No inciting incident sources enabled' };
          logMessage = 'Inciting Incident: No sources enabled';
        }
        break;

      case 'episodeTitle':
        result = generateEpisodeTitle();
        result.titleType = 'episode';
        logMessage = `Episode Title [${result.col1Roll}, ${result.col2Roll}, ${result.col3Roll}, ${result.col4Roll}]: ${result.col1} ${result.col2} ${result.col3} ${result.col4}`;
        break;

      case 'mission':
        result = generateMission();
        logMessage = `Mission [${result.typeRoll}, ${result.goodsRoll}, ${result.spotRoll}, ${result.rewardRoll}]: ${result.type} ${result.goods} ${result.spot} for ${result.reward}`;
        break;

      case 'openingScene':
        result = generateOpeningScene(gameState.includePVOracles);
        if (result.incident) {
          logMessage = `Opening Scene [${result.roll}]: ${result.incident}`;
        } else {
          logMessage = `Opening Scene [${result.roll}]: ${result.result}`;
        }
        break;

      case 'scene':
        result = generateScene();
        logMessage = `Scene: ${result.location} - ${result.tone}`;
        break;

      case 'askOracle':
        result = rollAffirmation();
        logMessage = `Oracle (${result.roll}): ${result.result}`;
        break;

      case 'npc':
        result = generateNPC(gameState.includePVOracles);
        logMessage = `NPC: ${result.name} - ${result.role} - ${result.species}`;
        break;

      case 'planet':
        result = generatePlanet();
        logMessage = `Planet: ${result.terrain}${result.name ? ' - ' + result.name : ''}`;
        break;

      case 'shakeup':
        const threatDie = gameState.threatDie || 1;
        const shakeupCheck = rollSceneShakeup(threatDie);
        if (shakeupCheck.success) {
          result = {
            roll: shakeupCheck.total,
            result: 'Scene Shakeup',
            detail: shakeupCheck.shakeup.result
          };
          logMessage = `Scene Shakeup: ${shakeupCheck.shakeup.result}`;
        } else {
          result = {
            roll: shakeupCheck.total,
            result: 'No Scene Shakeup',
            detail: `Rolled ${shakeupCheck.total}, need 15+`
          };
          logMessage = `No Scene Shakeup (rolled ${shakeupCheck.total})`;
        }
        break;

      case 'event':
        result = rollEventOracle();
        logMessage = `Event: ${result.verb} ${result.subject} - ${result.specific}`;
        break;

      case 'boost':
        result = rollOnTable(visualOracles.boost);
        logMessage = `Boost Oracle: ${result}`;
        result = { result, roll: Math.floor(Math.random() * 20) + 1 };
        break;

      default:
        console.log('Quick action:', actionType);
        return;
    }

    if (result) {
      setStepResults((prev) => ({ ...prev, [stepId]: { result, variant } }));
      addLog(logMessage, 'roll');
    }
  };

  const clearStepResult = (stepId) => {
    setStepResults((prev) => {
      const updated = { ...prev };
      delete updated[stepId];
      return updated;
    });
  };

  const getStepIcon = (step) => {
    const Icon = step.icon;
    return <Icon className="w-5 h-5" />;
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black transition-opacity duration-300",
          isOpen ? "opacity-70 pointer-events-auto z-[9998]" : "opacity-0 pointer-events-none z-[-1]"
        )}
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Drawer - Floating over content */}
      <div
        className={cn(
          "fixed w-full md:w-[480px] bg-bg-primary border-r-3 border-accent-cyan transform transition-transform duration-300 ease-in-out scanlines overflow-hidden flex flex-col",
          isOpen ? "translate-x-0 z-[9999]" : "-translate-x-full z-[-1]"
        )}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          maxHeight: '100vh'
        }}
      >
        {/* Header */}
        <div className="border-b-3 border-accent-cyan bg-bg-secondary p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-accent-cyan font-orbitron font-bold text-xl uppercase text-glow-cyan">
              Game Flow Guide
            </h2>
            <p className="text-gray-400 text-xs font-orbitron mt-1">
              Solo Play Procedure
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-accent-red hover:text-accent-red hover:bg-accent-red hover:bg-opacity-20 p-2 transition-colors border-2 border-accent-red"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Campaign Start Section */}
          <div className="mb-6">
            <div className="text-accent-yellow font-orbitron text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-accent-yellow opacity-30" />
              <span>Campaign Start</span>
              <div className="h-px flex-1 bg-accent-yellow opacity-30" />
            </div>
            {gameFlowSteps.slice(0, 2).map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isExpanded={expandedStep === step.id}
                onToggle={() => handleStepClick(step.id)}
                onQuickAction={handleQuickAction}
                stepResult={stepResults[step.id]}
                onClearResult={clearStepResult}
              />
            ))}
          </div>

          {/* Session Play Section */}
          <div>
            <div className="text-accent-cyan font-orbitron text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-accent-cyan opacity-30" />
              <span>Session Play (Steps 3-10)</span>
              <div className="h-px flex-1 bg-accent-cyan opacity-30" />
            </div>
            {gameFlowSteps.slice(2).map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isExpanded={expandedStep === step.id}
                onToggle={() => handleStepClick(step.id)}
                onQuickAction={handleQuickAction}
                stepResult={stepResults[step.id]}
                onClearResult={clearStepResult}
              />
            ))}
          </div>

          {/* Footer Tip */}
          <div className="mt-6 p-4 border-2 border-accent-yellow bg-bg-secondary">
            <div className="text-accent-yellow font-orbitron text-xs uppercase mb-2">
              Pro Tip
            </div>
            <p className="text-gray-300 text-sm">
              Use the Quick Action buttons at the top of the Oracle Compendium for fast access to the most common rolls during play.
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

function StepCard({ step, isExpanded, onToggle, onQuickAction, stepResult, onClearResult }) {
  const Icon = step.icon;
  
  const colorClasses = {
    cyan: {
      border: 'border-accent-cyan',
      text: 'text-accent-cyan',
      bg: 'bg-accent-cyan',
      glow: 'glow-cyan'
    },
    yellow: {
      border: 'border-accent-yellow',
      text: 'text-accent-yellow',
      bg: 'bg-accent-yellow',
      glow: 'glow-yellow'
    },
    red: {
      border: 'border-accent-red',
      text: 'text-accent-red',
      bg: 'bg-accent-red',
      glow: 'glow-red'
    }
  };

  const colors = colorClasses[step.color];

  return (
    <div className={cn('border-2 mb-3 bg-bg-secondary transition-all', colors.border, isExpanded && colors.glow)}>
      {/* Step Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-3 flex items-center justify-between hover:bg-opacity-10 transition-all duration-200 active:scale-[0.99]',
          `hover:${colors.bg}`
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border-2', colors.border, colors.bg, 'bg-opacity-20')}>
            <span className={cn('font-orbitron font-bold text-sm', colors.text)}>
              {step.id}
            </span>
          </div>
          <div className="text-left">
            <div className={cn('font-orbitron font-bold text-sm uppercase', colors.text)}>
              {step.title}
            </div>
            <div className="text-gray-400 text-xs font-orbitron">
              {step.subtitle}
            </div>
          </div>
        </div>
        <ChevronRight
          className={cn(
            'w-5 h-5 transition-all duration-300',
            colors.text,
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn('border-t-2 p-4 space-y-3 accordion-reveal overflow-hidden', colors.border)}>
          <p className="text-gray-300 text-sm leading-relaxed">
            {step.description}
          </p>
          
          {step.actions && step.actions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-orbitron uppercase text-gray-400 mb-2">
                Quick Actions:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {step.actions.map((action, idx) => {
                  const isImplemented = action.specific && [
                    'species', 'motivation', 'epicTitle', 'villain', 'inciting', 'episodeTitle', 
                    'mission', 'openingScene', 'scene', 'askOracle', 'npc', 
                    'planet', 'shakeup', 'event', 'boost'
                  ].includes(action.specific);

                  const isReminder = action.tab || (!isImplemented && action.specific);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (action.specific && isImplemented) {
                          onQuickAction(step.id, action.specific, step.color);
                        } else {
                          console.log('Action not yet implemented:', action.specific || action.tab);
                        }
                      }}
                      disabled={isReminder}
                      className={cn(
                        'px-3 py-2 text-xs font-orbitron uppercase border-2 transition-all text-left',
                        isImplemented ? [
                          colors.border,
                          colors.text,
                          'hover:bg-opacity-20',
                          `hover:${colors.bg}`
                        ] : [
                          'border-gray-500',
                          'text-gray-400',
                          'hover:border-gray-400',
                          'italic'
                        ]
                      )}
                    >
                      {isReminder && '→ '}
                      {action.label}
                      {isReminder && ' (reminder)'}
                    </button>
                  );
                })}
              </div>

              {/* Display Result */}
              {stepResult && (
                <CompactOracleResult
                  result={stepResult.result}
                  variant={stepResult.variant}
                  onDismiss={() => onClearResult(step.id)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

