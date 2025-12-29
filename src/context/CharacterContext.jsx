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

  // Load character on mount
  useEffect(() => {
    if (!userId || !roomCode) {
      setLoading(false);
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

        setCharacter(data);
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
          setCharacter(payload.new);
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
          hp_current: characterData.hp_current,
          hp_max: characterData.hp_max,
          equipment: characterData.equipment || [],
          bits: characterData.bits || 0,
        };

        const { data, error } = await supabase
          .from('characters')
          .insert(characterToSave)
          .select()
          .single();

        if (error) throw error;

        setCharacter(data);
        return data;
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
        setCharacter(data);
        return data;
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
    }
  }, [character?.id]);

  const value = {
    character,
    loading,
    error,
    saveCharacter,
    updateCharacter,
    updateField,
    deleteCharacter,
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}
