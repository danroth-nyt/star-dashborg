import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generateNPC, generateTravelEncounter, rollOnTable } from '../../../data/oracles';
import { npcOracles, nameOracles } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';

export default function NPCGenerator() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleGenerateNPC = () => {
    const npc = generateNPC();
    setResult(npc);
    addLog(`NPC: ${npc.species} ${npc.role} - ${npc.demeanor}`, 'mission');
  };

  const handleGenerateTravelEncounter = () => {
    const encounter = generateTravelEncounter();
    setResult(encounter);
    addLog(`Travel Encounter: ${encounter.theme} - ${encounter.actor}`, 'mission');
  };

  const handleGenerateRebelContact = () => {
    const contact = rollOnTable(npcOracles.rebelContacts);
    setResult({ result: 'Rebel Contact', detail: contact });
    addLog(`Rebel Contact: ${contact}`, 'mission');
  };

  const handleGenerateWeirdoAlien = () => {
    const alien = rollOnTable(npcOracles.weirdoAliens);
    setResult({ result: 'Weirdo Alien', detail: alien });
    addLog(`Weirdo Alien: ${alien}`, 'mission');
  };

  const handleGenerateReaction = () => {
    const reaction = rollOnTable(npcOracles.reactions);
    setResult({ result: 'NPC Reaction', detail: reaction });
    addLog(`Reaction: ${reaction}`, 'roll');
  };

  return (
    <div className="space-y-4">
      {/* Main NPC Generator */}
      <div className="space-y-2">
        <Button onClick={handleGenerateNPC} variant="primary" className="w-full">
          Generate Full NPC
        </Button>
        <div className="text-xs text-gray-400 text-center font-orbitron">
          Role • Species • Motivation • Secret • Trait • Demeanor
        </div>
      </div>

      {/* Quick Generators */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleGenerateTravelEncounter} variant="ghost" className="text-xs py-2">
          Travel Encounter
        </Button>
        <Button onClick={handleGenerateReaction} variant="ghost" className="text-xs py-2">
          Reaction
        </Button>
        <Button onClick={handleGenerateRebelContact} variant="secondary" className="text-xs py-2">
          Rebel Contact
        </Button>
        <Button onClick={handleGenerateWeirdoAlien} variant="secondary" className="text-xs py-2">
          Weirdo Alien
        </Button>
      </div>

      {/* Result Display */}
      {result && (
        <OracleResultDisplay 
          result={result}
          variant="yellow"
        />
      )}
    </div>
  );
}

