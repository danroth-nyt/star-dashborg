import PilotStation from './stations/PilotStation';
import CopilotStation from './stations/CopilotStation';
import EngineerStation from './stations/EngineerStation';
import GunnerStation from './stations/GunnerStation';

export default function StationGrid() {
  return (
    <div className="space-y-4">
      <h2 className="font-orbitron font-bold text-accent-cyan text-lg uppercase text-center mb-4">
        Ship Stations
      </h2>

      {/* Command Deck - Pilot & Copilot */}
      <div className="space-y-2">
        <p className="text-xs text-accent-cyan font-orbitron uppercase text-center mb-2">
          › Command Deck ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PilotStation />
          <CopilotStation />
        </div>
      </div>

      {/* Weapons Deck - Gunners */}
      <div className="space-y-2">
        <p className="text-xs text-accent-red font-orbitron uppercase text-center mb-2">
          › Weapons Deck ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GunnerStation stationNumber={1} />
          <GunnerStation stationNumber={2} />
        </div>
      </div>

      {/* Engineering Bay - Engineers */}
      <div className="space-y-2">
        <p className="text-xs text-accent-yellow font-orbitron uppercase text-center mb-2">
          › Engineering Bay ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EngineerStation stationNumber={1} />
          <EngineerStation stationNumber={2} />
        </div>
      </div>

      {/* Quick Reference */}
      <div className="border-3 border-gray-700 bg-bg-primary/50 p-3 mt-6">
        <p className="text-xs text-gray-400 font-orbitron uppercase mb-2">
          Combat Notes:
        </p>
        <ul className="space-y-1 text-xs text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-accent-cyan">•</span>
            <span>Solo rebels can make 2 actions per turn</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-cyan">•</span>
            <span>Changing stations takes 1 round</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-cyan">•</span>
            <span>Failed defense rolls degrade ship armor by 1 tier</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-yellow">•</span>
            <span>Hyperdrive takes 3 rounds to charge - dangerous with 4+ enemies!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
