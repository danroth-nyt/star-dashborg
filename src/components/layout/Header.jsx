import { Copy, Check, Plus, BookOpen, BookMarked, User, Rocket } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import { generateRoomCode } from '../../lib/utils';
import GameFlowDrawer from './GameFlowDrawer';
import QuickReferenceDrawer from '../ui/QuickReferenceDrawer';
import { useCharacter } from '../../context/CharacterContext';
import { useSpaceCombat } from '../../context/SpaceCombatContext';

export default function Header({ roomCode, onOpenCharacterSheet }) {
  const { character } = useCharacter();
  const { spaceCombat, enterCombat, exitCombat } = useSpaceCombat();
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isRefOpen, setIsRefOpen] = useState(false);

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

  const toggleSpaceCombat = () => {
    if (spaceCombat.isActive) {
      exitCombat();
    } else {
      enterCombat();
    }
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
            
            {/* Guide Buttons - moves to new line on mobile */}
            <div className="hidden md:flex items-center gap-2">
              {character && onOpenCharacterSheet && (
                <Button
                  variant="primary"
                  onClick={onOpenCharacterSheet}
                  className="flex items-center gap-2"
                  title={character.name || 'Character Sheet'}
                >
                  <User className="w-4 h-4" />
                  <span className="truncate">{character.name ? character.name.split(' ')[0] : 'Character'}</span>
                </Button>
              )}
              <Button
                variant={spaceCombat.isActive ? 'primary' : 'secondary'}
                onClick={toggleSpaceCombat}
                className={`flex items-center gap-2 ${spaceCombat.isActive ? 'glow-pulse-red border-accent-red text-accent-red' : ''}`}
              >
                <Rocket className="w-4 h-4" />
                Battle Stations
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Game Flow
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsRefOpen(true)}
                className="flex items-center gap-2"
              >
                <BookMarked className="w-4 h-4" />
                Quick Ref
              </Button>
            </div>
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

          {/* Guide Buttons for mobile - full width on new line */}
          <div className={`md:hidden w-full grid gap-2 ${character && onOpenCharacterSheet ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {character && onOpenCharacterSheet && (
              <Button
                variant="primary"
                onClick={onOpenCharacterSheet}
                className="flex items-center justify-center gap-2"
                title={character.name || 'Character Sheet'}
              >
                <User className="w-4 h-4" />
                <span className="truncate">{character.name ? character.name.split(' ')[0] : 'Char'}</span>
              </Button>
            )}
            <Button
              variant={spaceCombat.isActive ? 'primary' : 'secondary'}
              onClick={toggleSpaceCombat}
              className={`flex items-center justify-center gap-2 ${spaceCombat.isActive ? 'glow-pulse-red border-accent-red text-accent-red' : ''}`}
            >
              <Rocket className="w-4 h-4" />
              <span className="truncate">Battle</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="truncate">Game Flow</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsRefOpen(true)}
              className="flex items-center justify-center gap-2"
            >
              <BookMarked className="w-4 h-4" />
              <span className="truncate">Quick Ref</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Drawers */}
      <GameFlowDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <QuickReferenceDrawer isOpen={isRefOpen} onClose={() => setIsRefOpen(false)} />
    </>
  );
}

