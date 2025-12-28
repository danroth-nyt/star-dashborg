import { useState } from 'react';
import { cn } from '../../lib/utils';
import OracleQuickBar from './OracleQuickBar';
import OracleTable from './OracleTable';
import OracleResultDisplay from './OracleResultDisplay';
import MissionGenerator from './generators/MissionGenerator';
import NPCGenerator from './generators/NPCGenerator';
import PlanetGenerator from './generators/PlanetGenerator';
import {
  soloOracles,
  missionGenerators,
  worldOracles,
  dangerousLocations,
  npcOracles,
  nameOracles,
  characterOracles,
  classOracles,
  gmExtras,
  monsterOracles,
  equipmentOracles,
  enemyStats,
  titleGenerators,
  visualOracles,
  criminalOracles,
  rollOnTable,
  rollDangerousLocation,
  generateMonsterName,
  generateEpicTitle,
  generateEpisodeTitle,
  generateCrimeLord
} from '../../data/oracles';
import { useGame } from '../../context/GameContext';
import Accordion from '../ui/Accordion';

export default function OracleCompendium() {
  const [activeTab, setActiveTab] = useState('core');
  const [oracleResult, setOracleResult] = useState(null);
  const { addLog } = useGame();

  // Determine variant based on result type
  const getResultVariant = () => {
    if (!oracleResult) return 'cyan';
    if (oracleResult.result === 'Scene Shakeup') return 'yellow';
    if (oracleResult.verb) return 'red';
    return 'cyan';
  };

  const tabs = [
    { id: 'core', label: 'Core', color: 'cyan' },
    { id: 'missions', label: 'Missions', color: 'yellow' },
    { id: 'world', label: 'World', color: 'cyan' },
    { id: 'characters', label: 'Characters', color: 'yellow' },
    { id: 'combat', label: 'Combat', color: 'red' },
    { id: 'creation', label: 'Creation', color: 'cyan' }
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
      {/* Quick Action Bar */}
      <div className="border-3 border-accent-cyan bg-bg-secondary p-3">
        <OracleQuickBar setOracleResult={setOracleResult} />
      </div>

      {/* Centralized Oracle Result Display */}
      {oracleResult && (
        <OracleResultDisplay 
          result={oracleResult} 
          variant={getResultVariant()}
        />
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-6 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-2 py-2 border-2 transition-all font-orbitron font-bold uppercase text-xs',
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
      <div className="border-3 border-accent-yellow bg-bg-secondary p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {activeTab === 'core' && <CoreOraclesTab />}
        {activeTab === 'missions' && <MissionsTab />}
        {activeTab === 'world' && <WorldTab />}
        {activeTab === 'characters' && <CharactersTab />}
        {activeTab === 'combat' && <CombatTab />}
        {activeTab === 'creation' && <CreationTab />}
      </div>
    </div>
  );
}

// ==========================================
// TAB COMPONENTS
// ==========================================

function CoreOraclesTab() {
  return (
    <div className="space-y-4">
      <div className="text-accent-cyan font-orbitron text-lg font-bold uppercase mb-4">
        Core Solo Play Oracles
      </div>

      <Accordion title="Opening Scene (d20)" defaultOpen={false}>
        <OracleTable
          title="Opening Scene"
          table={soloOracles.openingScene}
          variant="cyan"
          diceType="d20"
        />
      </Accordion>

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

      <Accordion title="Visual Oracle / Boost (d20)" defaultOpen={false}>
        <OracleTable
          title="Inspiration Prompt"
          table={visualOracles.boost}
          variant="yellow"
          diceType="d20"
        />
      </Accordion>
    </div>
  );
}

function MissionsTab() {
  const { addLog } = useGame();

  const handleEpicTitle = () => {
    const title = generateEpicTitle();
    const titleString = `${title.col1} ${title.col2} ${title.col3} ${title.col4}`;
    addLog(`Epic Title: ${titleString}`, 'mission');
    return { result: 'Campaign Title', detail: titleString };
  };

  const handleEpisodeTitle = () => {
    const title = generateEpisodeTitle();
    const titleString = `${title.col1} ${title.col2} ${title.col3} ${title.col4}`;
    addLog(`Episode Title: ${titleString}`, 'mission');
    return { result: 'Episode Title', detail: titleString };
  };

  return (
    <div className="space-y-4">
      <div className="text-accent-yellow font-orbitron text-lg font-bold uppercase mb-4">
        Mission & Plot Generators
      </div>

      <Accordion title="Mission Generator" defaultOpen={true}>
        <MissionGenerator />
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
    </div>
  );
}

function WorldTab() {
  return (
    <div className="space-y-4">
      <div className="text-accent-cyan font-orbitron text-lg font-bold uppercase mb-4">
        World Building & Locations
      </div>

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

      <Accordion title="Dangerous Locations (d20)" defaultOpen={false}>
        <OracleTable
          title="Ship/Base Location"
          table={[]}
          variant="cyan"
          diceType="d20"
          rollFunction={() => rollDangerousLocation()}
        />
      </Accordion>
    </div>
  );
}

function CharactersTab() {
  const { addLog } = useGame();

  const handleNameRoll = (category, table) => {
    const name = rollOnTable(table);
    addLog(`${category}: ${name}`, 'roll');
    return { result: category, detail: name };
  };

  return (
    <div className="space-y-4">
      <div className="text-accent-yellow font-orbitron text-lg font-bold uppercase mb-4">
        Characters & Names
      </div>

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
            table={nameOracles.familyNames}
            variant="yellow"
            diceType="d10"
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
            title="Planet Name"
            table={nameOracles.planetNames}
            variant="cyan"
            diceType="d20"
          />
          <OracleTable
            title="Settlement Name"
            table={nameOracles.settlementNames}
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
        </div>
      </Accordion>
    </div>
  );
}

function CombatTab() {
  const { addLog } = useGame();

  const handleCrimeLord = () => {
    const lord = generateCrimeLord();
    addLog(`Crime Lord: ${lord.name}`, 'mission');
    return {
      result: lord.name,
      visage: lord.visage,
      weapon: lord.weapon,
      base: lord.base
    };
  };

  return (
    <div className="space-y-4">
      <div className="text-accent-red font-orbitron text-lg font-bold uppercase mb-4">
        Combat & Enemies
      </div>

      <Accordion title="Crime Lord Generator" defaultOpen={true}>
        <OracleTable
          title="Generate Crime Lord"
          table={[]}
          variant="red"
          diceType="multi"
          rollFunction={handleCrimeLord}
        />
      </Accordion>

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

      <Accordion title="Monster Generators" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Beast Adaptation"
            table={monsterOracles.beastAdaptations}
            variant="red"
            diceType="d6"
          />
          <OracleTable
            title="Monstrosity Adaptation"
            table={monsterOracles.monstrosityAdaptations}
            variant="red"
            diceType="d6"
          />
          <OracleTable
            title="Weak Spot"
            table={monsterOracles.weakSpots}
            variant="yellow"
            diceType="d6"
          />
          <OracleTable
            title="Monster Name"
            table={[]}
            variant="cyan"
            diceType="2d10"
            rollFunction={() => ({ result: generateMonsterName() })}
          />
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

function CreationTab() {
  return (
    <div className="space-y-4">
      <div className="text-accent-cyan font-orbitron text-lg font-bold uppercase mb-4">
        Character Creation
      </div>

      <Accordion title="Starting Character" defaultOpen={true}>
        <div className="space-y-4">
          <OracleTable
            title="Galactic Species"
            table={characterOracles.galacticSpecies}
            variant="cyan"
            diceType="d10"
          />
          <OracleTable
            title="Rebel Motivation"
            table={characterOracles.rebelMotivations}
            variant="yellow"
            diceType="d10"
          />
          <OracleTable
            title="Nick (Special Item)"
            table={characterOracles.nicks}
            variant="yellow"
            diceType="d6"
          />
          <OracleTable
            title="Knack (Special Ability)"
            table={characterOracles.knacks}
            variant="cyan"
            diceType="d6"
          />
        </div>
      </Accordion>

      <Accordion title="Starting Gear (Bobs)" defaultOpen={false}>
        <div className="space-y-4">
          <OracleTable
            title="Starting Weapon"
            table={characterOracles.bobsWeapons}
            variant="red"
            diceType="d6"
          />
          <OracleTable
            title="Starting Gear"
            table={characterOracles.bobsGear}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="Starting Armor"
            table={characterOracles.bobsArmor}
            variant="yellow"
            diceType="d6"
          />
        </div>
      </Accordion>

      <Accordion title="Class Tables" defaultOpen={false}>
        <div className="space-y-4">
          <div className="text-sm font-orbitron text-accent-cyan uppercase">Bot</div>
          <OracleTable
            title="Bot Function"
            table={classOracles.botFunctions}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="Bot Malfunction"
            table={classOracles.botMalfunctions}
            variant="red"
            diceType="d6"
          />
          <OracleTable
            title="Bot Mod"
            table={classOracles.botMods}
            variant="yellow"
            diceType="d6"
          />

          <div className="text-sm font-orbitron text-accent-cyan uppercase mt-4">Bounty Hunter</div>
          <OracleTable
            title="Bounty Hunter Skill"
            table={classOracles.bountyHunterSkills}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="Soft Spot"
            table={classOracles.bountyHunterSoftSpots}
            variant="yellow"
            diceType="d6"
          />

          <div className="text-sm font-orbitron text-accent-cyan uppercase mt-4">Other Classes</div>
          <OracleTable
            title="Magi Art"
            table={classOracles.magiArts}
            variant="cyan"
            diceType="d4"
          />
          <OracleTable
            title="Smuggler Trick"
            table={classOracles.smugglerTricks}
            variant="cyan"
            diceType="d6"
          />
          <OracleTable
            title="Technician Scratch Build"
            table={classOracles.technicianScratchBuilds}
            variant="yellow"
            diceType="d6"
          />
        </div>
      </Accordion>
    </div>
  );
}

