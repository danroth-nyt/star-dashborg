import { createContext, useContext, useEffect, useState } from 'react';
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

  // Load all characters in the room
  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    async function loadPartyMembers() {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('room_code', roomCode)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setPartyMembers(data || []);
      } catch (err) {
        console.error('Error loading party members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPartyMembers();
  }, [roomCode]);

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
          setPartyMembers((current) => [...current, payload.new]);
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
              member.id === payload.new.id ? payload.new : member
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
  };

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}
