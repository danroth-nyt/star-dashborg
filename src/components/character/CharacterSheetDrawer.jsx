import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Save, AlertTriangle, Dices } from 'lucide-react';
import { useCharacter } from '../../context/CharacterContext';
import { SPECIES, CHARACTER_CLASSES } from '../../types/starborg';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import CharacterJournal from './CharacterJournal';

export default function CharacterSheetDrawer({ isOpen, onClose }) {
  const { character, updateCharacter, updateField, deleteCharacter } = useCharacter();
  const [localCharacter, setLocalCharacter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync local state with character prop
  useEffect(() => {
    if (character) {
      setLocalCharacter({ ...character });
    }
  }, [character]);

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

  if (!isOpen) return null;

  if (!localCharacter) {
    return null;
  }

  // Format modifier with +/- prefix
  const formatModifier = (value) => {
    if (value > 0) return `+${value}`;
    if (value === 0) return '0';
    return `${value}`;
  };

  // Get color class based on stat value
  const getStatColor = (value) => {
    if (value >= 2) return 'text-accent-green';
    if (value >= 1) return 'text-accent-cyan';
    if (value === 0) return 'text-text-primary';
    if (value >= -1) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  // Handle field update
  const handleFieldChange = async (field, value) => {
    // Update local state immediately
    setLocalCharacter(prev => ({ ...prev, [field]: value }));
    
    // Update in database
    try {
      await updateField(field, value);
    } catch (error) {
      console.error('Failed to update field:', error);
    }
  };

  // Handle stat update
  const handleStatChange = async (statName, delta) => {
    const currentValue = localCharacter.stats[statName];
    const newValue = Math.max(-3, Math.min(3, currentValue + delta));
    
    const newStats = { ...localCharacter.stats, [statName]: newValue };
    setLocalCharacter(prev => ({ ...prev, stats: newStats }));
    
    try {
      await updateField('stats', newStats);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  // Handle equipment add
  const handleAddEquipment = async () => {
    const newEquipment = [...(localCharacter.equipment || []), 'New Item'];
    setLocalCharacter(prev => ({ ...prev, equipment: newEquipment }));
    
    try {
      await updateField('equipment', newEquipment);
    } catch (error) {
      console.error('Failed to add equipment:', error);
    }
  };

  // Handle equipment update
  const handleEquipmentChange = async (index, value) => {
    const newEquipment = [...localCharacter.equipment];
    newEquipment[index] = value;
    setLocalCharacter(prev => ({ ...prev, equipment: newEquipment }));
    
    try {
      await updateField('equipment', newEquipment);
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };

  // Handle equipment remove
  const handleRemoveEquipment = async (index) => {
    const newEquipment = localCharacter.equipment.filter((_, i) => i !== index);
    setLocalCharacter(prev => ({ ...prev, equipment: newEquipment }));
    
    try {
      await updateField('equipment', newEquipment);
    } catch (error) {
      console.error('Failed to remove equipment:', error);
    }
  };

  // Handle delete character
  const handleDeleteCharacter = async () => {
    try {
      setSaving(true);
      await deleteCharacter();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete character:', error);
      alert('Failed to delete character. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-bg-primary border-l-4 border-accent-cyan shadow-2xl z-50 slide-in-right overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-bg-secondary border-b-3 border-accent-cyan p-4 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-orbitron font-bold text-accent-cyan text-glow-cyan">
            CHARACTER SHEET
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-accent-cyan hover:text-accent-red hover:bg-accent-red/10 transition-all rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
              Basic Information
            </h3>
            
            {/* Name */}
            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                Character Name
              </label>
              <input
                type="text"
                value={localCharacter.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Enter rebel name..."
                className="w-full bg-bg-secondary border-2 border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all"
              />
            </div>

            {/* Class & Species */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  Class
                </label>
                <div className="bg-bg-secondary border-2 border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono capitalize">
                  {localCharacter.className || localCharacter.class}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  Species
                </label>
                <select
                  value={localCharacter.species || ''}
                  onChange={(e) => handleFieldChange('species', e.target.value)}
                  className="w-full bg-bg-secondary border-2 border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent-cyan [&>option]:bg-bg-secondary [&>option]:text-text-primary"
                >
                  {localCharacter.class === 'bot' ? (
                    <option value="Bot">Bot</option>
                  ) : (
                    SPECIES.map(species => (
                      <option key={species.id} value={species.name}>
                        {species.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Motivation */}
            {localCharacter.motivation && (
              <div className="mt-4">
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  Rebel Motivation
                </label>
                <div className="bg-bg-secondary border-2 border-accent-yellow/30 rounded px-3 py-2 text-text-primary font-mono text-sm">
                  {localCharacter.motivation}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
              Ability Scores
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(localCharacter.stats).map(([statName, value]) => (
                <div key={statName} className="bg-bg-secondary border-2 border-accent-cyan/30 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-text-secondary uppercase">
                      {statName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatChange(statName, -1)}
                      className="px-2 py-1 bg-accent-red/20 border border-accent-red text-accent-red font-bold hover:bg-accent-red hover:text-bg-primary transition-all"
                    >
                      -
                    </button>
                    <div className={`flex-1 text-center text-2xl font-orbitron font-bold ${getStatColor(value)}`}>
                      {formatModifier(value)}
                    </div>
                    <button
                      onClick={() => handleStatChange(statName, 1)}
                      className="px-2 py-1 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan hover:text-bg-primary transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HP & Destiny */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
              Vitals
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bg-secondary border-2 border-accent-red rounded p-3">
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  HP Current
                </label>
                <input
                  type="number"
                  value={localCharacter.hp_current}
                  onChange={(e) => handleFieldChange('hp_current', Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-full text-2xl font-orbitron font-bold text-accent-red bg-transparent border-0 focus:outline-none"
                />
              </div>
              <div className="bg-bg-secondary border-2 border-accent-red rounded p-3">
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  HP Max
                </label>
                <input
                  type="number"
                  value={localCharacter.hp_max}
                  onChange={(e) => handleFieldChange('hp_max', Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full text-2xl font-orbitron font-bold text-accent-red bg-transparent border-0 focus:outline-none"
                />
              </div>
              <div className="bg-bg-secondary border-2 border-accent-yellow rounded p-3">
                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                  Destiny
                </label>
                <input
                  type="number"
                  value={localCharacter.destiny_points || 0}
                  onChange={(e) => handleFieldChange('destiny_points', Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-full text-2xl font-orbitron font-bold text-accent-yellow bg-transparent border-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bits */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
              Currency
            </h3>
            <div className="bg-bg-secondary border-2 border-accent-cyan rounded p-3">
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">
                Bits ∆
              </label>
              <input
                type="number"
                value={localCharacter.bits || 0}
                onChange={(e) => handleFieldChange('bits', Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="w-full text-xl font-orbitron font-bold text-accent-cyan bg-transparent border-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-accent-yellow/30 pb-2">
              <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase">
                Equipment
              </h3>
              <button
                onClick={handleAddEquipment}
                className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                title="Add item"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {!localCharacter.equipment || localCharacter.equipment.length === 0 ? (
                <p className="text-text-secondary text-sm font-mono text-center py-4">
                  {'>'} No equipment yet
                </p>
              ) : (
                localCharacter.equipment.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveEquipment(index)}
                      className="text-accent-red hover:text-accent-red/80 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEquipmentChange(index, e.target.value)}
                      className="flex-1 bg-bg-secondary border-2 border-accent-cyan/30 rounded px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Class Features */}
          {localCharacter.classFeatures && Object.keys(localCharacter.classFeatures).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
                Class Features
              </h3>
              <div className="space-y-3">
                {Object.entries(localCharacter.classFeatures).map(([key, value]) => {
                  // Skip numeric/non-feature values
                  if (typeof value === 'number' || typeof value === 'boolean') {
                    return null;
                  }
                  
                  return (
                    <div key={key} className="bg-bg-secondary border-2 border-accent-yellow/30 rounded p-3">
                      <div className="text-xs font-mono text-accent-yellow uppercase mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                        {value.roll && ` [${value.roll}]`}
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
              {localCharacter.classFeatures.containmentPoints && (
                <div className="bg-accent-yellow/10 border-2 border-accent-yellow/30 rounded p-3">
                  <div className="text-xs font-mono text-accent-yellow uppercase mb-1">Containment Points</div>
                  <div className="text-text-secondary text-xs">
                    Current: {localCharacter.classFeatures.containmentPoints} / 6
                    <br />
                    <span className="text-accent-red">Reduces by 1 on each blunder</span>
                  </div>
                </div>
              )}
              {localCharacter.classFeatures.junkDrawerSlots && (
                <div className="bg-accent-cyan/10 border-2 border-accent-cyan/30 rounded p-3">
                  <div className="text-xs font-mono text-accent-cyan uppercase mb-1">Junk Drawer</div>
                  <div className="text-text-secondary text-xs">
                    Extra Inventory Slots: +{localCharacter.classFeatures.junkDrawerSlots}
                    <br />
                    <span className="text-text-secondary">For small broken machines (Hack Job parts)</span>
                  </div>
                </div>
              )}
              {localCharacter.classFeatures.ownsShip && (
                <div className="bg-accent-cyan/10 border-2 border-accent-cyan/30 rounded p-3">
                  <div className="text-xs font-mono text-accent-cyan uppercase mb-1">Hunk of Junk</div>
                  <div className="text-text-secondary text-xs">
                    You own a ramshackle but trustworthy ship
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Class Special Rules */}
          {CHARACTER_CLASSES[localCharacter.class]?.specialRules && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron font-bold text-accent-cyan uppercase border-b border-accent-cyan/30 pb-2">
                Class Special Rules
              </h3>
              <div className="space-y-2">
                {CHARACTER_CLASSES[localCharacter.class].specialRules.map((rule, index) => (
                  <div key={index} className="bg-bg-secondary border-2 border-accent-cyan/30 rounded p-3">
                    <div className="text-xs font-mono text-accent-cyan uppercase mb-1">
                      {rule.name}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {rule.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Journal */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-yellow uppercase border-b border-accent-yellow/30 pb-2">
              Personal Journal
            </h3>
            <CharacterJournal />
          </div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron font-bold text-accent-red uppercase border-b border-accent-red/30 pb-2">
              Danger Zone
            </h3>
            
            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                DELETE CHARACTER
              </Button>
            ) : (
              <div className="bg-accent-red/10 border-2 border-accent-red rounded p-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-orbitron font-bold text-accent-red uppercase text-sm mb-1">
                      Confirm Deletion
                    </h4>
                    <p className="text-text-primary text-sm">
                      This will permanently delete <span className="text-accent-yellow font-bold">{localCharacter.name}</span>. 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteCharacter}
                    variant="danger"
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? 'DELETING...' : 'YES, DELETE'}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(drawer, document.body);
}
