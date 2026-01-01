import { useState } from 'react';
import { CHARACTER_CLASSES, SPECIES } from '../../types/starborg';
import { 
  rollStatWithModifier, 
  rollHP, 
  rollDestinyPoints, 
  rollD, 
  rollTable 
} from '../../utils/dice';
import { characterOracles } from '../../data/oracles';
import {
  botData,
  bountyHunterData,
  magiKnightData,
  smugglerData,
  technicianData,
  youngsterData
} from '../../data/characterData';
import { nameOracles, generatePVNPCFullName } from '../../data/oracles';
import { useCharacter } from '../../context/CharacterContext';
import Button from '../ui/Button';
import { RefreshCw, Plus, Trash2, Save, Dices } from 'lucide-react';

const classData = {
  bot: botData,
  bountyHunter: bountyHunterData,
  magiKnight: magiKnightData,
  smuggler: smugglerData,
  technician: technicianData,
  youngster: youngsterData
};

export default function CharacterGenerator({ onSave, onCancel }) {
  const { saveCharacter } = useCharacter();
  const [step, setStep] = useState(1); // 1: class selection, 2: generating, 3: results
  const [selectedClass, setSelectedClass] = useState(null);
  const [character, setCharacter] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Format modifier with +/- prefix (show + for positive, nothing for zero, - already included)
  const formatModifier = (value) => {
    if (value > 0) return `+${value}`;
    return `${value}`;
  };

  // Generate complete character
  const generateCharacter = (classId) => {
    setGenerating(true);
    setStep(2);

    // Simulate generation delay for animation
    setTimeout(() => {
      const classInfo = CHARACTER_CLASSES[classId];
      const isBot = classId === 'bot';

      // Roll stats with class modifiers
      const stats = {
        agi: classInfo.statModifiers?.agi 
          ? rollStatWithModifier(
              classInfo.statModifiers.agi.count,
              classInfo.statModifiers.agi.sides,
              classInfo.statModifiers.agi.modifier
            )
          : rollStatWithModifier(3, 6, 0),
        knw: classInfo.statModifiers?.knw
          ? rollStatWithModifier(
              classInfo.statModifiers.knw.count,
              classInfo.statModifiers.knw.sides,
              classInfo.statModifiers.knw.modifier
            )
          : rollStatWithModifier(3, 6, 0),
        prs: classInfo.statModifiers?.prs
          ? rollStatWithModifier(
              classInfo.statModifiers.prs.count,
              classInfo.statModifiers.prs.sides,
              classInfo.statModifiers.prs.modifier
            )
          : rollStatWithModifier(3, 6, 0),
        str: classInfo.statModifiers?.str
          ? rollStatWithModifier(
              classInfo.statModifiers.str.count,
              classInfo.statModifiers.str.sides,
              classInfo.statModifiers.str.modifier
            )
          : rollStatWithModifier(3, 6, 0),
      };

      // Roll HP
      const hp = rollHP(stats.str, classInfo.hpDice);

      // Roll destiny points
      const destiny = rollDestinyPoints(classInfo.destinyDice);

      // Roll species (skip for Bot)
      const species = isBot ? 'Bot' : SPECIES[rollD(10) - 1].name;

      // Roll rebel motivation (D10)
      const motivationRoll = rollD(10);
      const motivation = characterOracles.rebelMotivations[motivationRoll - 1];

      // Roll bits (1-3 = No Bits, 4-6 = You got Bits)
      const bitsRoll = rollD(6);
      const bits = bitsRoll >= 4 ? 1 : 0;

      // Roll equipment (3 Bobs)
      const equipment = [
        characterOracles.bobsWeapons[rollD(6) - 1],
        characterOracles.bobsArmor[rollD(6) - 1],
        characterOracles.bobsGear[rollD(6) - 1],
      ];

      // Auto-add class-specific equipment
      if (classId === 'magiKnight') {
        equipment.unshift('Blazer Sword (2D6 damage)');
      }

      // Roll class-specific features
      const classFeatures = rollClassFeatures(classId);

      const newCharacter = {
        name: '',
        class: classId,
        className: classInfo.name,
        species,
        motivation,
        stats,
        base_stats: { ...stats }, // Store original stats for respec
        hp_max: hp,
        hp_current: hp,
        base_hp_max: hp, // Store original HP for respec
        destiny_points: destiny,
        bits,
        equipment,
        classFeatures,
      };

      setCharacter(newCharacter);
      setGenerating(false);
      setStep(3);
    }, 1500);
  };

  // Roll class-specific features with roll values
  const rollClassFeatures = (classId) => {
    const data = classData[classId];
    const features = {};

    switch (classId) {
      case 'bot': {
        const functionRoll = rollD(6);
        const malfunctionRoll = rollD(6);
        const upgradeRoll = rollD(6);
        features.function = { roll: functionRoll, ...data.functions[functionRoll - 1] };
        features.malfunction = { roll: malfunctionRoll, ...data.malfunctions[malfunctionRoll - 1] };
        features.upgrade = { roll: upgradeRoll, result: data.upgrades[upgradeRoll - 1] };
        break;
      }
      case 'bountyHunter': {
        const skillRoll = rollD(6);
        const heirloomRoll = rollD(6);
        const softSpotRoll = rollD(6);
        features.skill = { roll: skillRoll, ...data.skills[skillRoll - 1] };
        features.heirloom = { roll: heirloomRoll, ...data.heirlooms[heirloomRoll - 1] };
        features.softSpot = { roll: softSpotRoll, result: data.softSpots[softSpotRoll - 1] };
        break;
      }
      case 'magiKnight': {
        const artRoll = rollD(4);
        const nemesisRoll = rollD(6);
        const identityRoll = rollD(6);
        features.art = { roll: artRoll, ...data.arts[artRoll - 1] };
        
        // If nemesis roll is 6 ("Roll 2"), automatically roll twice more without replacement
        if (nemesisRoll === 6) {
          const firstRoll = rollD(5); // Roll 1-5 to avoid getting "Roll 2" again
          let secondRoll = rollD(5);
          // Re-roll if duplicate
          while (secondRoll === firstRoll) {
            secondRoll = rollD(5);
          }
          const nemesis1 = data.dragoonNemeses[firstRoll - 1];
          const nemesis2 = data.dragoonNemeses[secondRoll - 1];
          features.nemesis = { 
            roll: nemesisRoll, 
            result: `${nemesis1} & ${nemesis2}`,
            multiple: true,
            nemeses: [nemesis1, nemesis2]
          };
        } else {
          features.nemesis = { roll: nemesisRoll, result: data.dragoonNemeses[nemesisRoll - 1] };
        }
        
        features.identity = { roll: identityRoll, ...data.burnerIdentities[identityRoll - 1] };
        features.dragoonThreshold = 5; // Detection threshold, increases by 1 each use
        break;
      }
      case 'smuggler': {
        const trickRoll = rollD(6);
        const contrabandRoll = rollD(6);
        const crimeLordRoll = rollD(6);
        const containmentRoll = rollD(6);
        features.trick = { roll: trickRoll, result: data.tricks[trickRoll - 1] };
        features.contraband = { roll: contrabandRoll, ...data.contraband[contrabandRoll - 1] };
        features.containmentPoints = containmentRoll; // D6 Containment Points
        features.crimeLord = { roll: crimeLordRoll, result: data.crimeLords[crimeLordRoll - 1] };
        features.ownsShip = true; // HUNK OF JUNK: You own a ramshackle ship
        break;
      }
      case 'technician': {
        const scratchBuildRoll = rollD(6);
        const hyperFixationRoll = rollD(6);
        const junkDrawerRoll = rollD(4);
        features.scratchBuild = { roll: scratchBuildRoll, ...data.scratchBuilds[scratchBuildRoll - 1] };
        features.hyperFixation = { roll: hyperFixationRoll, result: data.hyperFixations[hyperFixationRoll - 1] };
        features.junkDrawerSlots = junkDrawerRoll; // D4 extra inventory slots
        break;
      }
      case 'youngster': {
        const tragedyRoll = rollD(6);
        const heirloomRoll = rollD(6);
        const knackRoll = rollD(6);
        features.tragedy = { roll: tragedyRoll, result: data.tragedies[tragedyRoll - 1] };
        features.heirloom = { roll: heirloomRoll, ...data.heirlooms[heirloomRoll - 1] };
        features.knack = { roll: knackRoll, ...data.knacks[knackRoll - 1] };
        break;
      }
    }

    return features;
  };

  // Handle class selection
  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    generateCharacter(classId);
  };

  // Reroll entire character
  const handleReroll = () => {
    setStep(1);
    setSelectedClass(null);
    setCharacter(null);
    setEditMode(false);
  };

  // Save character to Supabase
  const handleSaveCharacter = async () => {
    if (!character) return;

    try {
      setSaving(true);
      await saveCharacter(character);
      
      // Call optional onSave callback if provided
      if (onSave) {
        onSave(character);
      }
      
      // Character context will update, triggering App to show Dashboard
    } catch (error) {
      console.error('Failed to save character:', error);
      alert('Failed to save character. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Update character field
  const updateCharacter = (field, value) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  // Update nested stat
  const updateStat = (statName, value) => {
    const clamped = Math.max(-3, Math.min(3, parseInt(value) || 0));
    setCharacter(prev => ({
      ...prev,
      stats: { ...prev.stats, [statName]: clamped }
    }));
  };

  // Generate name based on class and species
  const generateName = () => {
    let generatedName = '';
    
    if (character.class === 'bot') {
      // Bot names: 2D10 (prefix + suffix)
      const prefix = nameOracles.botNamePrefixes[rollD(10) - 1];
      const suffix = nameOracles.botNameSuffixes[rollD(10) - 1];
      generatedName = `${prefix}-${suffix}`;
    } else {
      // Use Perilous Void name generator (4d100) for more variety
      // Easy to switch back to baseline names by uncommenting below:
      // const firstName = nameOracles.baselineFirst[rollD(10) - 1];
      // const familyName = nameOracles.familyNames[rollD(10) - 1];
      // generatedName = `${firstName} ${familyName}`;
      
      const pvName = generatePVNPCFullName();
      generatedName = pvName.fullName;
    }
    
    updateCharacter('name', generatedName);
  };

  // Reroll single stat
  const rerollStat = (statName) => {
    const classInfo = CHARACTER_CLASSES[character.class];
    const modifier = classInfo.statModifiers?.[statName];
    
    const newValue = modifier
      ? rollStatWithModifier(modifier.count, modifier.sides, modifier.modifier)
      : rollStatWithModifier(3, 6, 0);
    
    updateStat(statName, newValue);
  };

  // Reroll species (only for non-bots)
  const rerollSpecies = () => {
    if (character.class === 'bot') return; // Bots can't change species
    
    const newSpecies = SPECIES[rollD(10) - 1].name;
    updateCharacter('species', newSpecies);
  };

  // Reroll motivation
  const rerollMotivation = () => {
    const newMotivation = characterOracles.rebelMotivations[rollD(10) - 1];
    updateCharacter('motivation', newMotivation);
  };

  // Add equipment item
  const addEquipment = () => {
    setCharacter(prev => ({
      ...prev,
      equipment: [...prev.equipment, 'New Item']
    }));
  };

  // Remove equipment item
  const removeEquipment = (index) => {
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  // Update equipment item
  const updateEquipment = (index, value) => {
    setCharacter(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => i === index ? value : item)
    }));
  };

  // Reroll class feature with roll values
  const rerollClassFeature = (featureName) => {
    const data = classData[character.class];
    let newFeature;
    let roll;

    switch (featureName) {
      case 'function':
        roll = rollD(6);
        newFeature = { roll, ...data.functions[roll - 1] };
        break;
      case 'malfunction':
        roll = rollD(6);
        newFeature = { roll, ...data.malfunctions[roll - 1] };
        break;
      case 'upgrade':
        roll = rollD(6);
        newFeature = { roll, result: data.upgrades[roll - 1] };
        break;
      case 'skill':
        roll = rollD(6);
        newFeature = { roll, ...data.skills[roll - 1] };
        break;
      case 'heirloom':
        roll = rollD(6);
        newFeature = { roll, ...data.heirlooms[roll - 1] };
        break;
      case 'softSpot':
        roll = rollD(6);
        newFeature = { roll, result: data.softSpots[roll - 1] };
        break;
      case 'art':
        roll = rollD(4);
        newFeature = { roll, ...data.arts[roll - 1] };
        break;
      case 'nemesis': {
        roll = rollD(6);
        // If roll is 6 ("Roll 2"), automatically roll twice more without replacement
        if (roll === 6) {
          const firstRoll = rollD(5);
          let secondRoll = rollD(5);
          // Re-roll if duplicate
          while (secondRoll === firstRoll) {
            secondRoll = rollD(5);
          }
          const nemesis1 = data.dragoonNemeses[firstRoll - 1];
          const nemesis2 = data.dragoonNemeses[secondRoll - 1];
          newFeature = { 
            roll, 
            result: `${nemesis1} & ${nemesis2}`,
            multiple: true,
            nemeses: [nemesis1, nemesis2]
          };
        } else {
          newFeature = { roll, result: data.dragoonNemeses[roll - 1] };
        }
        break;
      }
      case 'identity':
        roll = rollD(6);
        newFeature = { roll, ...data.burnerIdentities[roll - 1] };
        break;
      case 'trick':
        roll = rollD(6);
        newFeature = { roll, result: data.tricks[roll - 1] };
        break;
      case 'contraband':
        roll = rollD(6);
        newFeature = { roll, ...data.contraband[roll - 1] };
        break;
      case 'crimeLord':
        roll = rollD(6);
        newFeature = { roll, result: data.crimeLords[roll - 1] };
        break;
      case 'scratchBuild':
        roll = rollD(6);
        newFeature = { roll, ...data.scratchBuilds[roll - 1] };
        break;
      case 'hyperFixation':
        roll = rollD(6);
        newFeature = { roll, result: data.hyperFixations[roll - 1] };
        break;
      case 'tragedy':
        roll = rollD(6);
        newFeature = { roll, result: data.tragedies[roll - 1] };
        break;
      case 'knack':
        roll = rollD(6);
        newFeature = { roll, ...data.knacks[roll - 1] };
        break;
    }

    setCharacter(prev => ({
      ...prev,
      classFeatures: { ...prev.classFeatures, [featureName]: newFeature }
    }));
  };

  // STEP 1: Class Selection
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-orbitron font-bold text-accent-cyan text-glow-cyan">
            CREATE REBEL CHARACTER
          </h2>
          <p className="text-text-secondary font-mono text-sm">
            {'>'} SELECT YOUR CLASS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CHARACTER_CLASSES).map(([id, classInfo]) => (
            <button
              key={id}
              onClick={() => handleClassSelect(id)}
              className="bg-bg-secondary border-2 border-accent-cyan/30 p-4 rounded hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-200 text-left group"
            >
              <h3 className="font-orbitron font-bold text-accent-yellow text-lg mb-2 group-hover:text-glow-yellow">
                {classInfo.name}
              </h3>
              <p className="text-text-secondary text-xs font-mono mb-3 line-clamp-3">
                {classInfo.description}
              </p>
              <div className="text-accent-cyan text-xs font-mono space-y-1">
                {Object.entries(classInfo.statModifiers || {}).map(([stat, mod]) => (
                  <div key={stat}>
                    {stat.toUpperCase()}: {mod.count}d{mod.sides}
                    {mod.modifier !== 0 && (mod.modifier > 0 ? `+${mod.modifier}` : mod.modifier)}
                  </div>
                ))}
                <div className="text-text-secondary">
                  HP: {classInfo.hpDice.count}d{classInfo.hpDice.sides}
                  {classInfo.hpDice.modifier !== 0 && `+${classInfo.hpDice.modifier}`}
                  {id !== 'bot' && ' + STR'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {onCancel && (
          <div className="text-center">
            <Button onClick={onCancel} variant="ghost">
              CANCEL
            </Button>
          </div>
        )}
      </div>
    );
  }

  // STEP 2: Generating Animation
  if (step === 2) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Dices className="w-16 h-16 text-accent-cyan mx-auto dice-rolling" />
          <div className="text-2xl font-orbitron text-accent-cyan text-glow-cyan typewriter">
            GENERATING CHARACTER
          </div>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Character Sheet with Editing
  if (step === 3 && character) {
    return (
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-orbitron font-bold text-accent-yellow text-glow-yellow">
            {character.className || 'CHARACTER'}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? 'secondary' : 'ghost'}
              className="text-xs"
            >
              {editMode ? 'DONE EDITING' : 'EDIT MODE'}
            </Button>
            <Button onClick={handleReroll} variant="ghost" className="text-xs">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">NAME</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={character.name}
              onChange={(e) => updateCharacter('name', e.target.value)}
              placeholder="Enter rebel name..."
              className="flex-1 bg-bg-secondary border border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all"
            />
            <button
              onClick={generateName}
              className="px-3 py-2 bg-transparent border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-bg-primary transition-all font-orbitron text-xs uppercase flex items-center gap-1"
              title="Generate random name"
            >
              <Dices className="w-4 h-4" />
              Gen
            </button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-orbitron text-accent-cyan uppercase">Ability Scores</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(character.stats).map(([statName, value]) => (
              <div key={statName} className="bg-bg-secondary border border-accent-cyan/30 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-text-secondary uppercase">{statName}</span>
                  <button
                    onClick={() => rerollStat(statName)}
                    className="text-accent-yellow hover:text-accent-yellow/80 transition-colors"
                    title="Reroll"
                  >
                    <Dices className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {editMode && (
                    <button
                      onClick={() => updateStat(statName, value - 1)}
                      className="text-accent-cyan hover:text-accent-cyan/80 text-lg font-bold"
                    >
                      -
                    </button>
                  )}
                  {editMode ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateStat(statName, e.target.value)}
                      min="-3"
                      max="3"
                      className={`w-full text-center text-xl font-orbitron font-bold ${
                        value >= 2 ? 'text-accent-green' :
                        value >= 1 ? 'text-accent-cyan' :
                        value === 0 ? 'text-text-primary' :
                        value >= -1 ? 'text-accent-yellow' :
                        'text-accent-red'
                      } bg-transparent border-0 focus:outline-none cursor-text`}
                    />
                  ) : (
                    <div className={`w-full text-center text-xl font-orbitron font-bold ${
                      value >= 2 ? 'text-accent-green' :
                      value >= 1 ? 'text-accent-cyan' :
                      value === 0 ? 'text-text-primary' :
                      value >= -1 ? 'text-accent-yellow' :
                      'text-accent-red'
                    }`}>
                      {formatModifier(value)}
                    </div>
                  )}
                  {editMode && (
                    <button
                      onClick={() => updateStat(statName, value + 1)}
                      className="text-accent-cyan hover:text-accent-cyan/80 text-lg font-bold"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HP & Destiny */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary border border-accent-cyan/30 rounded p-3">
            <label className="block text-xs font-mono text-text-secondary mb-1">HP MAX</label>
            <input
              type="number"
              value={character.hp_max}
              onChange={(e) => updateCharacter('hp_max', Math.max(1, parseInt(e.target.value) || 1))}
              readOnly={!editMode}
              min="1"
              className="w-full text-2xl font-orbitron font-bold text-accent-red bg-transparent border-0 focus:outline-none"
            />
          </div>
          <div className="bg-bg-secondary border border-accent-cyan/30 rounded p-3">
            <label className="block text-xs font-mono text-text-secondary mb-1">HP CURRENT</label>
            <input
              type="number"
              value={character.hp_current}
              onChange={(e) => updateCharacter('hp_current', Math.max(0, parseInt(e.target.value) || 0))}
              readOnly={!editMode}
              min="0"
              className="w-full text-2xl font-orbitron font-bold text-accent-red bg-transparent border-0 focus:outline-none"
            />
          </div>
          <div className="bg-bg-secondary border border-accent-cyan/30 rounded p-3">
            <label className="block text-xs font-mono text-text-secondary mb-1">DESTINY POINTS</label>
            <input
              type="number"
              value={character.destiny_points}
              onChange={(e) => updateCharacter('destiny_points', Math.max(0, parseInt(e.target.value) || 0))}
              readOnly={!editMode}
              min="0"
              className="w-full text-2xl font-orbitron font-bold text-accent-yellow bg-transparent border-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Species & Bits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-text-secondary">SPECIES</label>
              {!editMode && character.class !== 'bot' && (
                <button
                  onClick={rerollSpecies}
                  className="text-accent-yellow hover:text-accent-yellow/80 transition-colors"
                  title="Reroll species"
                >
                  <Dices className="w-3 h-3" />
                </button>
              )}
            </div>
            {editMode ? (
              <select
                value={character.species}
                onChange={(e) => updateCharacter('species', e.target.value)}
                className="w-full bg-bg-secondary border border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-cyan [&>option]:bg-bg-secondary [&>option]:text-text-primary"
              >
                {character.class === 'bot' ? (
                  <option value="Bot" className="bg-bg-secondary text-text-primary">Bot</option>
                ) : (
                  SPECIES.map(species => (
                    <option key={species.id} value={species.name} className="bg-bg-secondary text-text-primary">{species.name}</option>
                  ))
                )}
              </select>
            ) : (
              <div className="bg-bg-secondary border border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono">
                {character.species}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-mono text-text-secondary mb-1">BITS ∆</label>
            <input
              type="number"
              value={character.bits}
              onChange={(e) => updateCharacter('bits', Math.max(0, parseInt(e.target.value) || 0))}
              readOnly={!editMode}
              min="0"
              className="w-full bg-bg-secondary border border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        {/* Rebel Motivation */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono text-text-secondary">REBEL MOTIVATION</label>
            {!editMode && (
              <button
                onClick={rerollMotivation}
                className="text-accent-yellow hover:text-accent-yellow/80 transition-colors"
                title="Reroll motivation"
              >
                <Dices className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="bg-bg-secondary border border-accent-yellow/30 rounded px-3 py-2 text-text-primary font-mono text-sm">
            {character.motivation}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-orbitron text-accent-cyan uppercase">Equipment</h3>
            {editMode && (
              <button
                onClick={addEquipment}
                className="text-accent-yellow hover:text-accent-yellow/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {character.equipment.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {editMode && (
                  <button
                    onClick={() => removeEquipment(index)}
                    className="text-accent-red hover:text-accent-red/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateEquipment(index, e.target.value)}
                  readOnly={!editMode}
                  className={`flex-1 bg-bg-secondary border ${editMode ? 'border-accent-cyan/50 border-dashed' : 'border-accent-cyan/30'} rounded px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Class Features */}
        {character.classFeatures && (
          <div>
            <h3 className="text-sm font-orbitron text-accent-cyan uppercase mb-2">Class Features</h3>
            <div className="space-y-3">
              {Object.entries(character.classFeatures).map(([key, value]) => {
                // Skip numeric/non-feature values
                if (typeof value === 'number' || typeof value === 'boolean') {
                  return null;
                }
                
                return (
                  <div key={key} className="bg-bg-secondary border border-accent-yellow/30 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-accent-yellow uppercase">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                        {value.roll && ` [${value.roll}]`}
                      </span>
                      <button
                        onClick={() => rerollClassFeature(key)}
                        className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                        title="Reroll"
                      >
                        <Dices className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-text-primary text-sm font-mono">
                      {value.name ? (
                        <>
                          <div className="font-bold text-accent-yellow">{value.name}</div>
                          <div className="text-text-secondary text-xs mt-1">{value.description}</div>
                        </>
                      ) : (
                        <div className="text-text-secondary text-xs">{value.result || value}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Additional Feature Details */}
            {character.classFeatures.dragoonThreshold && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded p-3 mt-3">
                <div className="text-xs font-mono text-accent-red uppercase mb-1">Dragoon Detection</div>
                <div className="text-text-secondary text-xs">
                  Current Threshold: {character.classFeatures.dragoonThreshold} or lower
                  <br />
                  <span className="text-accent-yellow">⚠ Roll D20 when using Magi Arts or Blazer Sword</span>
                </div>
              </div>
            )}
            {character.classFeatures.containmentPoints && (
              <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded p-3 mt-3">
                <div className="text-xs font-mono text-accent-yellow uppercase mb-1">Containment Points</div>
                <div className="text-text-secondary text-xs">
                  Current: {character.classFeatures.containmentPoints} / 6
                  <br />
                  <span className="text-accent-red">Reduces by 1 on each blunder</span>
                </div>
              </div>
            )}
            {character.classFeatures.junkDrawerSlots && (
              <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded p-3 mt-3">
                <div className="text-xs font-mono text-accent-cyan uppercase mb-1">Junk Drawer</div>
                <div className="text-text-secondary text-xs">
                  Extra Inventory Slots: +{character.classFeatures.junkDrawerSlots}
                  <br />
                  <span className="text-text-secondary">For small broken machines (Hack Job parts)</span>
                </div>
              </div>
            )}
            {character.classFeatures.ownsShip && (
              <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded p-3 mt-3">
                <div className="text-xs font-mono text-accent-cyan uppercase mb-1">Hunk of Junk</div>
                <div className="text-text-secondary text-xs">
                  You own a ramshackle but trustworthy ship
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-accent-cyan/20">
          <Button 
            onClick={handleReroll} 
            variant="ghost" 
            className="flex-1"
            disabled={saving}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            REROLL ALL
          </Button>
          <Button
            onClick={handleSaveCharacter}
            variant="primary"
            className="flex-1"
            disabled={saving || !character?.name}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'SAVING...' : 'KEEP CHARACTER'}
          </Button>
        </div>
        
        {/* Name requirement warning */}
        {character && !character.name && (
          <div className="text-accent-yellow text-xs font-mono text-center mt-2">
            {'>'} Enter a name to save character
          </div>
        )}
      </div>
    );
  }

  return null;
}
