import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function PendingApproval() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-bold text-accent-yellow text-glow-yellow mb-2">
            AWAITING APPROVAL
          </h1>
          <p className="text-accent-cyan/70 text-sm font-mono">
            {'>'} ACCESS PENDING
          </p>
        </div>

        {/* Status Panel */}
        <div className="bg-panel-bg border border-accent-yellow/30 rounded-lg p-6 shadow-lg shadow-accent-yellow/10">
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-accent-yellow rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent-yellow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-3">
              <p className="text-text-primary font-mono text-sm">
                Your account has been created successfully.
              </p>
              <p className="text-text-secondary font-mono text-xs">
                An administrator must approve your account before you can access the system.
              </p>
              <div className="bg-bg-secondary border border-accent-cyan/20 rounded p-3 mt-4">
                <p className="text-accent-cyan font-mono text-xs">
                  <span className="text-text-secondary">Email:</span> {user?.email}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-bg-secondary/50 border border-accent-yellow/20 rounded p-4">
              <p className="text-text-secondary font-mono text-xs leading-relaxed">
                {'>'} You will receive an email notification once approved.
                <br />
                {'>'} Please check your inbox regularly.
                <br />
                {'>'} Contact the administrator if you're waiting too long.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                className="w-full"
              >
                CHECK STATUS
              </Button>
              <Button onClick={signOut} variant="ghost" className="w-full text-xs">
                SIGN OUT
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-xs font-mono">
          {'>'} Secure rebel network access control active
        </p>
      </div>
    </div>
  );
}
