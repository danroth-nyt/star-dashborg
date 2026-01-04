import { useState } from 'react';
import { cn } from '../../lib/utils';
import OracleQuickBar from './OracleQuickBar';
import OracleTable from './OracleTable';
import OracleResultDisplay from './OracleResultDisplay';
import MissionGenerator from './generators/MissionGenerator';
import NPCGenerator from './generators/NPCGenerator';
import PlanetGenerator from './generators/PlanetGenerator';
import MonsterGenerator from './generators/MonsterGenerator';
import CrimeLordGenerator from './generators/CrimeLordGenerator';
import SiteExplorer from '../trackers/SiteExplorer';
import VisualBoostOracle from './VisualBoostOracle';
import { OracleHistoryProvider, useOracleHistoryContext } from '../../context/OracleHistoryContext';
import {
  soloOracles,
  missionGenerators,
  worldOracles,
  nameOracles,
  characterOracles,
  gmExtras,
  equipmentOracles,
  enemyStats,
  rollOnTable,
  rollDangerousLocation,
  rollDice,
  generateEpicTitle,
  generateEpisodeTitle,
  generatePVNPCSurname,
  generateSpaceOperaName,
  generatePVFactionName,
  generateScene
} from '../../data/oracles';
import { useGame } from '../../context/GameContext';
import Accordion from '../ui/Accordion';

export default function OracleCompendium() {
  const [activeTab, setActiveTab] = useState('core');

  const tabs = [
    { id: 'core', label: 'Core', color: 'cyan' },
    { id: 'story', label: 'Story', color: 'yellow' },
    { id: 'world', label: 'World', color: 'cyan' },
    { id: 'characters', label: 'Characters', color: 'yellow' },
    { id: 'combat', label: 'Combat', color: 'red' }
  ];

  const tabColors = {
    cyan: {
      active: 'bg-accent-cyan text-bg-primary border-accent-cyan',
      inactive: 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
    },
    yellow: {
      active: 'bg-accent-yellow text-bg-primary border-accent-yellow',
      inactive: 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow hover:text-bg-primary'
    },
    red: {
      active: 'bg-accent-red text-bg-primary border-accent-red',
      inactive: 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red hover:text-bg-primary'
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-1 sm:px-2 py-2 border-2 transition-all font-orbitron font-bold uppercase text-[10px] sm:text-xs leading-tight',
              activeTab === tab.id 
                ? tabColors[tab.color].active 
                : tabColors[tab.color].inactive
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="border-3 border-accent-yellow bg-bg-secondary p-4 overflow-y-auto flex-1">
        {activeTab === 'core' && (
          <OracleHistoryProvider>
            <CoreOraclesTab />
          </OracleHistoryProvider>
        )}
        {activeTab === 'story' && (
          <OracleHistoryProvider>
            <StoryTab />
          </OracleHistoryProvider>
        )}
        {activeTab === 'world' && (
          <OracleHistoryProvider>
            <WorldTab />
          </OracleHistoryProvider>
        )}
        {activeTab === 'characters' && (
          <OracleHistoryProvider>
            <CharactersTab />
          </OracleHistoryProvider>
        )}
        {activeTab === 'combat' && (
          <OracleHistoryProvider>
            <CombatTab />
          </OracleHistoryProvider>
        )}
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function MoraleButton({ morale, label, onCheck }) {
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const checkResult = onCheck(morale);
    setResult(checkResult);
    setTimeout(() => setResult(null), 3000);
  };

  return (
    <button
      onClick={handleCheck}
      className="w-full px-3 py-2 bg-transparent border-2 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary transition-all font-orbitron text-sm flex items-center justify-between"
    >
      <span>{label}</span>
      {result && (
        <span className={result.success ? 'text-accent-yellow font-bold' : 'text-accent-cyan'}>
          {result.success ? result.result : 'HOLDS'}
        </span>
      )}
    </button>
  );
}

// ==========================================
// TAB COMPONENTS
// ==========================================

function CoreOraclesTab() {
  const history = useOracleHistoryContext();
  
  return (
    <div className="space-y-4">
      <div className="text-accent-cyan font-orbitron text-lg font-bold uppercase mb-4">
        Core Solo Play Oracles
      </div>

      {/* Quick Action Bar */}
      <div className="border-2 border-accent-cyan bg-bg-primary p-3">
        <OracleQuickBar />
      </div>

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult} 
          variant={
            history.currentResult.result === 'Scene Shakeup' ? 'yellow' :
            history.currentResult.verb ? 'red' : 'cyan'
          }
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
          onClear={history.clearHistory}
        />
      )}

      <Accordion title="Crit & Blunder (d4)" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Critical Hit Effect"
            table={soloOracles.critBlunder.crit}
            variant="cyan"
            diceType="d4"
          />
          <OracleTable
            title="Blunder Effect"
            table={soloOracles.critBlunder.blunder}
            variant="red"
            diceType="d4"
          />
        </div>
      </Accordion>

      <Accordion title="Broken (When HP Hits 0)" defaultOpen={false}>
        <OracleTable
          title="Roll D4 When Broken"
          table={characterOracles.broken.map(b => b.result)}
          variant="red"
          diceType="d4"
        />
      </Accordion>

      <Accordion title="Visual Oracle / Boost (d20)" defaultOpen={false}>
        <VisualBoostOracle />
      </Accordion>
    </div>
  );
}

function StoryTab() {
  const { gameState } = useGame();
  const history = useOracleHistoryContext();
  const diceType = gameState.includePVOracles ? 'd30' : 'd20';

  const handleGenerateScene = () => {
    const scene = generateScene();
    // Just return result - OracleTable handles history.addResult() and logging
    return {
      result: 'Scene',
      location: scene.location,
      tone: scene.tone,
      obstacle: scene.obstacle,
      locationRoll: scene.locationRoll,
      toneRoll: scene.toneRoll,
      obstacleRoll: scene.obstacleRoll
    };
  };

  const handleEpicTitle = () => {
    const title = generateEpicTitle();
    // Just return result - OracleTable handles history.addResult() and logging
    return { 
      result: 'Campaign Title', 
      titleType: 'epic',
      ...title 
    };
  };

  const handleEpisodeTitle = () => {
    const title = generateEpisodeTitle();
    // Just return result - OracleTable handles history.addResult() and logging
    return { 
      result: 'Episode Title',
      titleType: 'episode',
      ...title 
    };
  };

  return (
    <div className="space-y-4">
      <div className="text-accent-yellow font-orbitron text-lg font-bold uppercase mb-4">
        Story & Plot Generators
      </div>

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult} 
          variant="yellow"
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
          onClear={history.clearHistory}
        />
      )}

      <Accordion title="Scene Generator (3d6)" defaultOpen={true}>
        <OracleTable
          title="Generate Scene"
          table={[]}
          variant="cyan"
          diceType="3d6"
          rollFunction={handleGenerateScene}
        />
      </Accordion>

      <Accordion title={`Opening Scene (${diceType})`} defaultOpen={false}>
        <OracleTable
          title="Opening Scene"
          table={soloOracles.openingScene}
          variant="cyan"
          diceType={diceType}
        />
        {gameState.includePVOracles && (
          <div className="mt-4 p-3 border-2 border-accent-yellow bg-bg-secondary">
            <div className="text-accent-yellow font-orbitron text-xs uppercase mb-2">
              Perilous Void Entries (21-30)
            </div>
            <p className="text-gray-300 text-sm">
              Rolls 21-30 use structured incidents with follow-up questions from The Perilous Void.
            </p>
          </div>
        )}
      </Accordion>

      <Accordion title="Mission Generator" defaultOpen={false}>
        <MissionGenerator />
      </Accordion>

      <Accordion title="Title Generators" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Epic Campaign Title"
            table={[]}
            variant="yellow"
            diceType="4d6"
            rollFunction={handleEpicTitle}
          />
          <OracleTable
            title="Episode/Session Title"
            table={[]}
            variant="cyan"
            diceType="4d6"
            rollFunction={handleEpisodeTitle}
          />
        </div>
      </Accordion>

      <Accordion title="Pre-Made Scenarios (d6)" defaultOpen={false}>
        <OracleTable
          title="Campaign Scenario"
          table={missionGenerators.scenarios}
          variant="yellow"
          diceType="d6"
          formatResult={(result) => ({ result: result.title, detail: result.desc })}
        />
      </Accordion>
    </div>
  );
}

function WorldTab() {
  const { gameState } = useGame();
  const history = useOracleHistoryContext();
  
  return (
    <div className="space-y-4">
      <div className="text-accent-cyan font-orbitron text-lg font-bold uppercase mb-4">
        World Building & Locations
      </div>

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult} 
          variant="cyan"
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
          onClear={history.clearHistory}
        />
      )}

      <Accordion title="World Generator" defaultOpen={true}>
        <PlanetGenerator />
      </Accordion>

      <Accordion title="Obstacles & Mishaps" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Urgent Obstacle"
            table={worldOracles.urgentObstacles}
            variant="red"
            diceType="d6"
          />
          <OracleTable
            title="General Mishap"
            table={worldOracles.generalMishaps}
            variant="yellow"
            diceType="d6"
            formatResult={(result) => ({
              roll: result.roll,
              result: result.title,
              detail: result.desc
            })}
          />
          <OracleTable
            title="Space Obstacle"
            table={worldOracles.spaceObstacles}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="Hyperspace Mishap"
            table={worldOracles.hyperspaceMishaps}
            variant="red"
            diceType="d6"
          />
        </div>
      </Accordion>

      <Accordion title="Site Explorer (Dangerous Locations)" defaultOpen={false}>
        <SiteExplorer />
      </Accordion>

      <Accordion title="Dangerous Location Quick Roll" defaultOpen={false}>
        <OracleTable
          title="Ship/Base Location"
          table={[]}
          variant="cyan"
          diceType="d20"
          rollFunction={() => rollDangerousLocation(gameState.threatDie || 1)}
        />
      </Accordion>
    </div>
  );
}

function CharactersTab() {
  const { addLog, gameState } = useGame();

  const handleFamilyName = () => {
    // Unified Family Name: combines original d10 names with PV surnames when enabled
    if (gameState.includePVOracles && rollDice(2) === 2) {
      // 50% chance: Use PV surname generator
      const surname = generatePVNPCSurname();
      addLog(`Family Name (PV) [${surname.firstRoll}, ${surname.secondRoll}]: ${surname.fullSurname}`, 'roll');
      return { 
        result: 'Family Name', 
        detail: surname.fullSurname,
        source: 'perilousVoid',
        firstRoll: surname.firstRoll,
        secondRoll: surname.secondRoll
      };
    } else {
      // 50% chance or PV disabled: Use original family names
      const name = rollOnTable(nameOracles.familyNames);
      addLog(`Family Name: ${name}`, 'roll');
      return { result: 'Family Name', detail: name };
    }
  };

  const handleSpaceOperaName = () => {
    const name = generateSpaceOperaName();
    addLog(`Space Opera Name [${name.firstRoll}, ${name.secondRoll}]: ${name.fullName}`, 'roll');
    return name;
  };

  const handlePVFactionName = () => {
    const faction = generatePVFactionName();
    addLog(`PV Faction Name: ${faction.fullName}`, 'roll');
    return faction;
  };

  const history = useOracleHistoryContext();

  return (
    <div className="space-y-4">
      <div className="text-accent-yellow font-orbitron text-lg font-bold uppercase mb-4">
        Characters & Names
      </div>

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult} 
          variant="yellow"
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
          onClear={history.clearHistory}
        />
      )}

      <Accordion title="NPC Generator" defaultOpen={true}>
        <NPCGenerator />
      </Accordion>

      <Accordion title="Name Generators" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <OracleTable
            title="Baseline Name"
            table={nameOracles.baselineFirst}
            variant="yellow"
            diceType="d10"
          />
          <OracleTable
            title="Family Name"
            table={[]}
            variant="yellow"
            diceType={gameState.includePVOracles ? "d10/2d100" : "d10"}
            rollFunction={handleFamilyName}
          />
          <OracleTable
            title="Bot Name"
            table={nameOracles.botNames}
            variant="cyan"
            diceType="d10"
          />
          <OracleTable
            title="Ship Name"
            table={nameOracles.shipNames}
            variant="cyan"
            diceType="d10"
          />
          <OracleTable
            title="Legionary Name"
            table={nameOracles.legionaryNames}
            variant="red"
            diceType="d10"
          />
          <OracleTable
            title="Bounty Hunter"
            table={nameOracles.bountyHunterNames}
            variant="red"
            diceType="d8"
          />
          <OracleTable
            title="Crime Lord"
            table={nameOracles.crimeLordNames}
            variant="red"
            diceType="d10"
          />
          <OracleTable
            title="Pirate Crew"
            table={nameOracles.pirateCrewNames}
            variant="red"
            diceType="d10"
          />
          
          {/* Perilous Void Name Generators */}
          {gameState.includePVOracles && (
            <>
              <OracleTable
                title="Space Opera"
                table={[]}
                variant="cyan"
                diceType="2d100"
                rollFunction={handleSpaceOperaName}
              />
              <OracleTable
                title="PV Faction"
                table={[]}
                variant="cyan"
                diceType="Template"
                rollFunction={handlePVFactionName}
              />
            </>
          )}
        </div>
      </Accordion>
    </div>
  );
}

function CombatTab() {
  const { addLog } = useGame();
  const history = useOracleHistoryContext();

  const checkMorale = (targetMorale) => {
    const die1 = rollDice(6);
    const die2 = rollDice(6);
    const total = die1 + die2;
    const success = total > targetMorale;

    if (success) {
      const resultRoll = rollDice(6);
      const result = resultRoll <= 4 ? 'FLEES' : 'SURRENDERS';
      addLog(`Morale Check [${die1}, ${die2}] = ${total} vs ${targetMorale} → FAIL! Enemy ${result}`, 'danger');
      return { success: true, total, result };
    } else {
      addLog(`Morale Check [${die1}, ${die2}] = ${total} vs ${targetMorale} → Holds firm`, 'roll');
      return { success: false, total };
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-accent-red font-orbitron text-lg font-bold uppercase mb-4">
        Combat & Enemies
      </div>

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult} 
          variant="red"
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
          onClear={history.clearHistory}
        />
      )}

      {/* Morale Check */}
      <Accordion title="Morale Check (2D6)" defaultOpen={false}>
        <div className="space-y-3">
          <p className="text-gray-300 text-sm mb-3">
            Roll when: Leader killed, Half group eliminated, or Single enemy at 1/3 HP
          </p>
          <div className="space-y-2">
            <MoraleButton morale={6} label="MRL 6 (Foot Soldiers)" onCheck={checkMorale} />
            <MoraleButton morale={7} label="MRL 7 (Pirates, Minions)" onCheck={checkMorale} />
            <MoraleButton morale={8} label="MRL 8 (Squad, Gangsters)" onCheck={checkMorale} />
            <MoraleButton morale={9} label="MRL 9 (Officer, Beasts)" onCheck={checkMorale} />
            <MoraleButton morale={10} label="MRL 10 (Elite, Leaders)" onCheck={checkMorale} />
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Success (roll &gt; MRL): Roll d6 → 1-4 Flees, 5-6 Surrenders
          </p>
        </div>
      </Accordion>

      {/* Enemy Generators - Combined */}
      <Accordion title="Enemy Generators" defaultOpen={true}>
        <div className="space-y-4">
          <MonsterGenerator />
          <div className="border-t-2 border-accent-red/30" />
          <CrimeLordGenerator />
        </div>
      </Accordion>

      {/* Enemy Reference */}
      <Accordion title="Enemy Reference" defaultOpen={false}>
        <div className="space-y-3">
          <div className="text-sm font-orbitron text-accent-cyan uppercase mb-2">Personnel</div>
          {enemyStats.personnel.map((enemy, idx) => (
            <div key={idx} className="border-2 border-accent-red p-2 bg-bg-primary">
              <div className="text-accent-red font-orbitron font-bold">{enemy.name}</div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-300 mt-1">
                <div>HP: {enemy.hp}</div>
                <div>Morale: {enemy.morale}</div>
                <div>Armor: {enemy.armor}</div>
                <div>Weapon: {enemy.weapon}</div>
                <div className="col-span-2 text-gray-400">{enemy.notes}</div>
              </div>
            </div>
          ))}
          
          <div className="text-sm font-orbitron text-accent-cyan uppercase mt-4 mb-2">Monsters</div>
          {enemyStats.monsters.map((enemy, idx) => (
            <div key={idx} className="border-2 border-accent-red p-2 bg-bg-primary">
              <div className="text-accent-red font-orbitron font-bold">{enemy.name}</div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-300 mt-1">
                <div>HP: {enemy.hp}</div>
                <div>Morale: {enemy.morale}</div>
                <div>Armor: {enemy.armor}</div>
                <div>Weapon: {enemy.weapon}</div>
                <div className="col-span-2 text-gray-400">{enemy.notes}</div>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Equipment & Loot" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Melee Weapon"
            table={equipmentOracles.meleeWeapons}
            variant="cyan"
            diceType="d10"
          />
          <OracleTable
            title="Ranged Weapon"
            table={equipmentOracles.rangedWeapons}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="General Gear"
            table={equipmentOracles.gear}
            variant="cyan"
            diceType="d8"
          />
          <OracleTable
            title="Space Junk"
            table={gmExtras.spaceJunk}
            variant="yellow"
            diceType="d8"
          />
        </div>
      </Accordion>
    </div>
  );
}


