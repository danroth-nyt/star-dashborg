import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * usePresence - Track which users are in the room and what they're editing
 * 
 * @param {string} roomCode - The room code to track presence for
 * @param {string} userId - The current user's ID
 * @param {string} userName - The current user's display name
 * @returns {object} - Presence state and control functions
 */
export function usePresence(roomCode, userId, userName = 'Anonymous') {
  const [presenceState, setPresenceState] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const channelRef = useRef(null);
  const currentEditingRef = useRef(new Set());
  const currentViewRef = useRef('dashboard'); // Track current view: 'dashboard', 'combat', 'shop'

  useEffect(() => {
    if (!roomCode || !userId) return;

    // Create a presence channel for this room
    const channel = supabase.channel(`presence:${roomCode}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Subscribe to presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        
        // Extract online users
        const users = Object.values(state).flat();
        setOnlineUsers(users);
        
        // Build field-to-user mapping for editing states
        const fieldMap = {};
        users.forEach((user) => {
          if (user.editing && Array.isArray(user.editing)) {
            user.editing.forEach((field) => {
              if (!fieldMap[field]) {
                fieldMap[field] = [];
              }
              fieldMap[field].push({
                userId: user.user_id,
                userName: user.user_name,
              });
            });
          }
        });
        
        setPresenceState(fieldMap);
      })
      .on('presence', { event: 'join' }, () => {
        // User joined - state will be synced in next sync event
      })
      .on('presence', { event: 'leave' }, () => {
        // User left - state will be synced in next sync event
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial presence
          await channel.track({
            user_id: userId,
            user_name: userName,
            online_at: new Date().toISOString(),
            editing: [],
            current_view: 'dashboard',
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomCode, userId, userName]);

  /**
   * Update the current view for this user
   */
  const updateCurrentView = useCallback(
    async (viewName) => {
      if (!channelRef.current || !viewName) return;

      currentViewRef.current = viewName;
      
      await channelRef.current.track({
        user_id: userId,
        user_name: userName,
        online_at: new Date().toISOString(),
        editing: Array.from(currentEditingRef.current),
        current_view: viewName,
      });
    },
    [userId, userName]
  );

  /**
   * Mark a field as being edited by this user
   */
  const trackEditing = useCallback(
    async (fieldName) => {
      if (!channelRef.current || !fieldName) return;

      currentEditingRef.current.add(fieldName);
      
      await channelRef.current.track({
        user_id: userId,
        user_name: userName,
        online_at: new Date().toISOString(),
        editing: Array.from(currentEditingRef.current),
        current_view: currentViewRef.current,
      });
    },
    [userId, userName]
  );

  /**
   * Mark a field as no longer being edited by this user
   */
  const stopEditing = useCallback(
    async (fieldName) => {
      if (!channelRef.current || !fieldName) return;

      currentEditingRef.current.delete(fieldName);
      
      await channelRef.current.track({
        user_id: userId,
        user_name: userName,
        online_at: new Date().toISOString(),
        editing: Array.from(currentEditingRef.current),
        current_view: currentViewRef.current,
      });
    },
    [userId, userName]
  );

  /**
   * Check if a field is being edited by someone else
   */
  const isFieldLocked = useCallback(
    (fieldName) => {
      const editors = presenceState[fieldName] || [];
      return editors.some((editor) => editor.userId !== userId);
    },
    [presenceState, userId]
  );

  /**
   * Get the user currently editing a field
   */
  const getFieldEditor = useCallback(
    (fieldName) => {
      const editors = presenceState[fieldName] || [];
      return editors.find((editor) => editor.userId !== userId);
    },
    [presenceState, userId]
  );

  /**
   * Get list of users in a specific view (excluding current user)
   */
  const getUsersInView = useCallback(
    (viewName) => {
      if (!Array.isArray(onlineUsers)) {
        return [];
      }
      return onlineUsers
        .filter((user) => user.current_view === viewName && user.user_id !== userId)
        .map((user) => ({
          userId: user.user_id,
          userName: user.user_name,
        }));
    },
    [onlineUsers, userId]
  );

  return {
    presenceState,
    onlineUsers,
    trackEditing,
    stopEditing,
    isFieldLocked,
    getFieldEditor,
    updateCurrentView,
    getUsersInView,
  };
}
