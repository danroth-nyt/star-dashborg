import { Copy, Check, Plus, BookOpen } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import { generateRoomCode } from '../../lib/utils';
import GameFlowDrawer from './GameFlowDrawer';

export default function Header({ roomCode }) {
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const copyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createNewRoom = () => {
    const newRoomCode = generateRoomCode();
    const url = `${window.location.origin}${window.location.pathname}?room=${newRoomCode}`;
    window.location.href = url;
  };

  return (
    <>
      <header className="border-b-3 border-accent-yellow bg-bg-secondary p-3 md:p-4 border-flicker">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <div>
              <h1 className="font-orbitron font-black text-2xl md:text-4xl text-accent-yellow text-glow-yellow tracking-wider">
                STAR DASHBORG
              </h1>
              <p className="text-accent-cyan text-xs md:text-sm font-orbitron">
                REBEL MISSION DASHBOARD
              </p>
            </div>
            
            {/* Game Flow Guide Button - moves to new line on mobile */}
            <Button
              variant="primary"
              onClick={() => setIsGuideOpen(true)}
              className="hidden md:flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Game Flow
            </Button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-orbitron uppercase">Room Code</p>
              <p className="text-lg md:text-2xl font-orbitron font-bold text-accent-cyan text-glow-cyan">
                {roomCode}
              </p>
            </div>
            
            <div className="flex gap-1 md:gap-2">
              <Button
                variant="secondary"
                onClick={createNewRoom}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Room</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={copyInviteLink}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy Invite</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Game Flow Button for mobile - full width on new line */}
          <Button
            variant="primary"
            onClick={() => setIsGuideOpen(true)}
            className="md:hidden w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Game Flow
          </Button>
        </div>
      </header>

      {/* Game Flow Drawer */}
      <GameFlowDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}

