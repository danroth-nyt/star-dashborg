import { useEffect, useState } from 'react';

export default function LoadingScreen({ message = 'LOADING', details = null }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Minimum display time to prevent jarring flashes
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    // Render invisible placeholder to prevent layout shift
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center opacity-0">
        <div className="text-center space-y-4">
          <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan">
            {message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines">
      <div className="text-center space-y-4">
        <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan typewriter">
          {message}
        </div>
        <div className="flex justify-center gap-1">
          <span
            className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"
            style={{ animationDelay: '0ms' }}
          ></span>
          <span
            className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"
            style={{ animationDelay: '150ms' }}
          ></span>
          <span
            className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"
            style={{ animationDelay: '300ms' }}
          ></span>
        </div>
        {details && (
          <div className="text-accent-yellow/50 text-sm font-mono mt-6">
            {details.map((detail, idx) => (
              <div key={idx}>
                {'>'} {detail}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
