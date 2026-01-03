import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEmailPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        setMessage('Account created! Check your email to confirm, then wait for admin approval.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      setMessage('Check your email for the magic link!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-bold text-accent-cyan text-glow-cyan mb-2">
            STAR DASHBORG
          </h1>
          <p className="text-accent-yellow/70 text-sm font-mono">
            {'>'} SECURE ACCESS REQUIRED
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-panel-bg border border-accent-cyan/30 rounded-lg p-6 shadow-lg shadow-accent-cyan/10">
          <div className="space-y-6">
            {/* Toggle Sign In / Sign Up */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 font-mono text-sm rounded transition-all ${
                  !isSignUp
                    ? 'bg-accent-cyan text-bg-primary'
                    : 'bg-transparent text-accent-cyan border border-accent-cyan/30 hover:border-accent-cyan/60'
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 font-mono text-sm rounded transition-all ${
                  isSignUp
                    ? 'bg-accent-cyan text-bg-primary'
                    : 'bg-transparent text-accent-cyan border border-accent-cyan/30 hover:border-accent-cyan/60'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-mono text-text-secondary mb-2">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="rebel@resistance.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-bg-secondary border border-accent-cyan/30 rounded text-text-primary font-mono focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-mono text-text-secondary mb-2">
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-bg-secondary border border-accent-cyan/30 rounded text-text-primary font-mono focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-accent-cyan/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-panel-bg text-text-secondary font-mono">OR</span>
              </div>
            </div>

            {/* Magic Link */}
            <form onSubmit={handleMagicLink}>
              <Button
                type="submit"
                disabled={loading || !email}
                variant="outline"
                className="w-full"
              >
                {loading ? 'SENDING...' : 'SEND MAGIC LINK'}
              </Button>
            </form>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded">
                <p className="text-accent-red text-sm font-mono">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-accent-green/10 border border-accent-green/30 rounded">
                <p className="text-accent-green text-sm font-mono">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-xs font-mono">
          {'>'} Encrypted connection established
        </p>
      </div>
    </div>
  );
}
