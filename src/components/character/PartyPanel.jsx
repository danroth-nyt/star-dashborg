import { Maximize2, Users } from 'lucide-react';
import { useParty } from '../../context/PartyContext';
import { useAuth } from '../../context/AuthContext';
import PartyMemberCard from './PartyMemberCard';
import GalaxySaveTracker from '../trackers/GalaxySaveTracker';

export default function PartyPanel({ onExpand }) {
  const { partyMembers, loading } = useParty();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="text-center text-text-secondary text-sm font-mono p-4 space-y-3">
        <div className="text-accent-cyan">{'>'} Loading party members...</div>
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    );
  }

  if (!partyMembers || partyMembers.length === 0) {
    return (
      <div className="text-center text-text-secondary text-sm font-mono p-4">
        {'>'} No party members in this room
      </div>
    );
  }

  // Sort to put user's character first
  const sortedMembers = [...partyMembers].sort((a, b) => {
    if (a.user_id === user?.id) return -1;
    if (b.user_id === user?.id) return 1;
    return 0;
  });

  return (
    <div className="space-y-3">
      {/* Galaxy Save Tracker */}
      <GalaxySaveTracker />

      {/* Party Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent-cyan" />
          <h3 className="font-orbitron font-bold text-accent-cyan text-sm">
            Party ({partyMembers.length})
          </h3>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-1 text-accent-cyan hover:text-accent-cyan/80 hover:bg-accent-cyan/10 transition-all rounded"
            title="Expand character sheet"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Party Member Cards */}
      <div className="space-y-2">
        {sortedMembers.map((member) => (
          <PartyMemberCard key={member.id} character={member} />
        ))}
      </div>
    </div>
  );
}
