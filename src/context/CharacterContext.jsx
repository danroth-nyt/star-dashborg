import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const CharacterContext = createContext();

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

export function CharacterProvider({ children, userId, roomCode }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform database character to UI format (snake_case to camelCase)
  const transformCharacterFromDB = (dbCharacter) => {
    if (!dbCharacter) return null;
    
    return {
      ...dbCharacter,
      classFeatures: dbCharacter.class_features,
      className: dbCharacter.class_name,
      destinyPoints: dbCharacter.destiny_points,
      hpCurrent: dbCharacter.hp_current,
      hpMax: dbCharacter.hp_max,
      userId: dbCharacter.user_id,
      roomCode: dbCharacter.room_code,
      galaxySavesClaimed: dbCharacter.galaxy_saves_claimed || 0,
      advancementOptions: dbCharacter.advancement_options || [],
      baseStats: dbCharacter.base_stats,
      baseHpMax: dbCharacter.base_hp_max,
    };
  };

  // Load character on mount
  useEffect(() => {
    // Don't set loading false prematurely - wait for valid props
    if (!userId || !roomCode) {
      return;
    }

    async function loadCharacter() {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', userId)
          .eq('room_code', roomCode)
          .maybeSingle();

        if (error) throw error;

        setCharacter(transformCharacterFromDB(data));
      } catch (err) {
        console.error('Error loading character:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCharacter();
  }, [userId, roomCode]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!character?.id) return;

    const channel = supabase
      .channel(`character:${character.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${character.id}`,
        },
        (payload) => {
          console.log('Character updated:', payload.new);
          setCharacter(transformCharacterFromDB(payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [character?.id]);

  // Save new character
  const saveCharacter = useCallback(
    async (characterData) => {
      if (!userId || !roomCode) {
        throw new Error('Missing userId or roomCode');
      }

      try {
        setLoading(true);

        // Ensure room exists in rooms table (for legacy rooms created before fix)
        const { data: existingRoom, error: roomCheckError } = await supabase
          .from('rooms')
          .select('code')
          .eq('code', roomCode)
          .maybeSingle();

        if (!existingRoom && !roomCheckError) {
          // Room doesn't exist, create it
          const { error: roomCreateError } = await supabase
            .from('rooms')
            .insert({ code: roomCode, gm_id: userId });

          // Ignore duplicate key errors (race condition with another user)
          if (roomCreateError && roomCreateError.code !== '23505') {
            throw roomCreateError;
          }
        }

        // Prepare character data for Supabase
        const characterToSave = {
          user_id: userId,
          room_code: roomCode,
          name: characterData.name || 'Unnamed Rebel',
          class: characterData.class,
          species: characterData.species,
          stats: characterData.stats,
          base_stats: characterData.base_stats || characterData.stats, // Default to current stats if not provided
          hp_current: characterData.hp_current,
          hp_max: characterData.hp_max,
          base_hp_max: characterData.base_hp_max || characterData.hp_max, // Default to current HP if not provided
          equipment: characterData.equipment || [],
          bits: characterData.bits || 0,
          motivation: characterData.motivation || null,
          destiny_points: characterData.destiny_points || 0,
          class_features: characterData.classFeatures || null,
          class_name: characterData.className || characterData.class,
          galaxy_saves_claimed: characterData.galaxySavesClaimed || 0,
          advancement_options: characterData.advancementOptions || [],
        };

        const { data, error } = await supabase
          .from('characters')
          .insert(characterToSave)
          .select()
          .single();

        if (error) throw error;

        const transformedData = transformCharacterFromDB(data);
        setCharacter(transformedData);
        return transformedData;
      } catch (err) {
        console.error('Error saving character:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, roomCode]
  );

  // Update existing character
  const updateCharacter = useCallback(
    async (updates) => {
      if (!character?.id) {
        throw new Error('No character to update');
      }

      try {
        const { data, error } = await supabase
          .from('characters')
          .update(updates)
          .eq('id', character.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state immediately for optimistic updates
        const transformedData = transformCharacterFromDB(data);
        setCharacter(transformedData);
        return transformedData;
      } catch (err) {
        console.error('Error updating character:', err);
        setError(err.message);
        throw err;
      }
    },
    [character?.id]
  );

  // Update character field (helper for single field updates)
  const updateField = useCallback(
    async (field, value) => {
      return updateCharacter({ [field]: value });
    },
    [updateCharacter]
  );

  // Delete character (if needed)
  const deleteCharacter = useCallback(async () => {
    if (!character?.id) {
      throw new Error('No character to delete');
    }

    try {
      setLoading(true); // Show loading during transition
      
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', character.id);

      if (error) throw error;

      setCharacter(null);
    } catch (err) {
      console.error('Error deleting character:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false); // Clear loading after transition
    }
  }, [character?.id]);

  // Claim a promotion (increase HP, stats, and select advancement)
  const claimPromotion = useCallback(
    async (promotionData) => {
      if (!character?.id) {
        throw new Error('No character to promote');
      }

      try {
        const { hpIncrease, statIncreases, advancementId, advancementResult } = promotionData;

        // Calculate new stats
        const newStats = { ...character.stats };
        statIncreases.forEach(stat => {
          if (newStats[stat] < 6) {
            newStats[stat] += 1;
          }
        });

        // Calculate new HP
        const newHpMax = character.hp_max + hpIncrease;
        const newHpCurrent = character.hp_current + hpIncrease; // Also heal by the amount gained

        // Update advancement options
        const newAdvancementOptions = [
          ...(character.advancementOptions || []),
          {
            id: advancementId,
            claimedAt: new Date().toISOString(),
            result: advancementResult,
          },
        ];

        // Update class features if advancement adds something
        let newClassFeatures = { ...character.classFeatures };
        if (advancementResult?.rolledFeature) {
          const feature = advancementResult.rolledFeature;
          
          // Add the rolled feature to class features
          switch (feature.type) {
            case 'heirloom':
              newClassFeatures.advancedHeirloom = feature;
              break;
            case 'skill':
              newClassFeatures.advancedSkill = feature;
              break;
            case 'function':
              newClassFeatures.advancedFunction = feature;
              break;
            case 'magiAwakening':
              newClassFeatures.advancedMagiArt = feature.art;
              newClassFeatures.advancedDragoonNemesis = feature.nemesis;
              break;
            case 'scratchBuild':
              newClassFeatures.advancedScratchBuild = feature;
              break;
          }
        }

        // Update character in database
        const updates = {
          stats: newStats,
          hp_max: newHpMax,
          hp_current: newHpCurrent,
          galaxy_saves_claimed: (character.galaxySavesClaimed || 0) + 1,
          advancement_options: newAdvancementOptions,
          class_features: newClassFeatures,
        };

        const { data, error } = await supabase
          .from('characters')
          .update(updates)
          .eq('id', character.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        const transformedData = transformCharacterFromDB(data);
        setCharacter(transformedData);
        return transformedData;
      } catch (err) {
        console.error('Error claiming promotion:', err);
        setError(err.message);
        throw err;
      }
    },
    [character]
  );

  // Respec character (reset to base values, clear promotions)
  const respecCharacter = useCallback(async () => {
    if (!character?.id) {
      throw new Error('No character to respec');
    }

    try {
      // Use base values if available, otherwise use current values as new base
      const baseStats = character.base_stats || character.baseStats || character.stats;
      const baseHpMax = character.base_hp_max || character.baseHpMax || character.hp_max;

      // Remove advancement-added class features
      const resetClassFeatures = { ...character.classFeatures };
      delete resetClassFeatures.advancedHeirloom;
      delete resetClassFeatures.advancedSkill;
      delete resetClassFeatures.advancedFunction;
      delete resetClassFeatures.advancedMagiArt;
      delete resetClassFeatures.advancedDragoonNemesis;
      delete resetClassFeatures.advancedScratchBuild;

      // Update character in database
      const updates = {
        stats: baseStats,
        hp_max: baseHpMax,
        hp_current: baseHpMax, // Reset current HP to base max
        galaxy_saves_claimed: 0,
        advancement_options: [],
        class_features: resetClassFeatures,
        // Ensure base values are stored if they weren't before
        base_stats: baseStats,
        base_hp_max: baseHpMax,
      };

      const { data, error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', character.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const transformedData = transformCharacterFromDB(data);
      setCharacter(transformedData);
      return transformedData;
    } catch (err) {
      console.error('Error respeccing character:', err);
      setError(err.message);
      throw err;
    }
  }, [character]);

  const value = {
    character,
    loading,
    error,
    saveCharacter,
    updateCharacter,
    updateField,
    deleteCharacter,
    claimPromotion,
    respecCharacter,
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}
