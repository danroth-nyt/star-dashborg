import Button from '../../ui/Button';
import { generateNPC, generateTravelEncounter, rollOnTable } from '../../../data/oracles';
import { npcOracles } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';
import { useOracleHistoryContext } from '../../../context/OracleHistoryContext';

export default function NPCGenerator() {
  const { addLog, gameState } = useGame();
  const history = useOracleHistoryContext();

  const handleGenerateNPC = () => {
    const npc = generateNPC(gameState.includePVOracles);
    if (history) history.addResult(npc);
    addLog(`NPC: ${npc.name} - ${npc.species} ${npc.role} - ${npc.demeanor}`, 'mission');
  };

  const handleGenerateTravelEncounter = () => {
    const threatDie = gameState.threatDie || 1;
    const encounterCheck = generateTravelEncounter(threatDie);
    
    if (encounterCheck.success) {
      const result = {
        theme: encounterCheck.encounter.theme,
        actor: encounterCheck.encounter.actor,
        themeRoll: encounterCheck.encounter.themeRoll,
        actorRoll: encounterCheck.encounter.actorRoll,
        checkRoll: encounterCheck.checkRoll,
        total: encounterCheck.total
      };
      if (history) history.addResult(result);
      addLog(`Travel Encounter Check [${encounterCheck.checkRoll}] + [${threatDie}] = ${encounterCheck.total} ✓ → ${encounterCheck.encounter.theme} - ${encounterCheck.encounter.actor}`, 'mission');
    } else {
      const result = {
        result: 'No Travel Encounter',
        detail: `Rolled [${encounterCheck.checkRoll}] + [${threatDie}] = ${encounterCheck.total}, need 12+`,
        checkRoll: encounterCheck.checkRoll,
        threatDie,
        total: encounterCheck.total,
        success: false
      };
      if (history) history.addResult(result);
      addLog(`Travel Encounter Check [${encounterCheck.checkRoll}] + [${threatDie}] = ${encounterCheck.total} ✗ No encounter`, 'roll');
    }
  };

  const handleGenerateRebelContact = () => {
    const contact = rollOnTable(npcOracles.rebelContacts);
    const result = { result: 'Rebel Contact', detail: contact };
    if (history) history.addResult(result);
    addLog(`Rebel Contact: ${contact}`, 'mission');
  };

  const handleGenerateWeirdoAlien = () => {
    const alien = rollOnTable(npcOracles.weirdoAliens);
    const result = { result: 'Weirdo Alien', detail: alien };
    if (history) history.addResult(result);
    addLog(`Weirdo Alien: ${alien}`, 'mission');
  };

  const handleGenerateReaction = () => {
    const reaction = rollOnTable(npcOracles.reactions);
    const result = { result: 'NPC Reaction', detail: reaction };
    if (history) history.addResult(result);
    addLog(`Reaction: ${reaction}`, 'roll');
  };

  return (
    <div className="space-y-4">
      {/* Main NPC Generator */}
      <Button onClick={handleGenerateNPC} variant="primary" className="w-full text-base py-3">
        GENERATE FULL NPC
      </Button>
      <div className="text-xs text-gray-400 text-center font-orbitron -mt-2">
        Name • Role • Species • Motivation • Secret • Trait • Demeanor
      </div>

      {/* Quick Generators - Secondary Options */}
      <div className="pt-2 border-t border-accent-yellow/30">
        <div className="text-xs text-gray-400 font-orbitron uppercase mb-2">Quick Generators:</div>
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
      </div>

    </div>
  );
}

