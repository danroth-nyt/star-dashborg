import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const PartyContext = createContext();

export function useParty() {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
}

export function PartyProvider({ children, roomCode }) {
  const [partyMembers, setPartyMembers] = useState([]);
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
    };
  };

  // Load all characters in the room (extracted to be callable)
  const loadPartyMembers = useCallback(async () => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('room_code', roomCode)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedData = (data || []).map(transformCharacterFromDB);
      setPartyMembers(transformedData);
    } catch (err) {
      console.error('Error loading party members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Load on mount
  useEffect(() => {
    loadPartyMembers();
  }, [loadPartyMembers]);

  // Subscribe to realtime changes for all characters in the room
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase
      .channel(`party:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'characters',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          console.log('Character added to party:', payload.new);
          setPartyMembers((current) => [...current, transformCharacterFromDB(payload.new)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          console.log('Character updated in party:', payload.new);
          setPartyMembers((current) =>
            current.map((member) =>
              member.id === payload.new.id ? transformCharacterFromDB(payload.new) : member
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'characters',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          console.log('Character removed from party:', payload.old);
          setPartyMembers((current) =>
            current.filter((member) => member.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode]);

  const value = {
    partyMembers,
    loading,
    error,
    refreshPartyMembers: loadPartyMembers,
  };

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}
