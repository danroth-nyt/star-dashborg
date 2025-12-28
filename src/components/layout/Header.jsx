import { Copy, Check, Plus } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import { generateRoomCode } from '../../lib/utils';

export default function Header({ roomCode }) {
  const [copied, setCopied] = useState(false);

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
    <header className="border-b-3 border-accent-yellow bg-bg-secondary p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron font-black text-4xl text-accent-yellow text-glow-yellow tracking-wider">
            STAR BORG
          </h1>
          <p className="text-accent-cyan text-sm font-orbitron">
            REBEL MISSION DASHBOARD
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400 font-orbitron uppercase">Room Code</p>
            <p className="text-2xl font-orbitron font-bold text-accent-cyan text-glow-cyan">
              {roomCode}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={createNewRoom}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Room
            </Button>
            
            <Button
              variant="ghost"
              onClick={copyInviteLink}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Invite
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

