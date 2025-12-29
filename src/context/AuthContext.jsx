import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);

  // Check if user is approved
  const checkApprovalStatus = async (userId) => {
    if (!userId) {
      setApproved(false);
      setCheckingApproval(false);
      return;
    }

    try {
      setCheckingApproval(true);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('admin_profiles')
        .select('approved')
        .eq('user_id', userId)
        .maybeSingle();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.error('Error checking approval:', error);
        // If error is RLS related, assume not approved
        setApproved(false);
        return;
      }

      console.log('Approval check result:', data);
      setApproved(data?.approved || false);
    } catch (err) {
      console.error('Error checking approval:', err);
      // On error or timeout, default to not approved
      setApproved(false);
    } finally {
      setCheckingApproval(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkApprovalStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkApprovalStatus(session.user.id);
      } else {
        setApproved(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    loading,
    approved,
    checkingApproval,
    signOut,
    checkApprovalStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
