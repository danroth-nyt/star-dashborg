import PilotStation from './stations/PilotStation';
import CopilotStation from './stations/CopilotStation';
import EngineerStation from './stations/EngineerStation';
import GunnerStation from './stations/GunnerStation';

export default function StationGrid() {
  return (
    <div className="space-y-4 xl:space-y-6">
      <h2 className="font-orbitron font-bold text-accent-cyan text-lg xl:text-xl uppercase text-center mb-4">
        Ship Stations
      </h2>

      {/* Command Deck - Pilot & Copilot */}
      <div className="space-y-2">
        <p className="text-xs xl:text-sm text-accent-cyan font-orbitron uppercase text-center mb-2">
          › Command Deck ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <PilotStation />
          <CopilotStation />
        </div>
      </div>

      {/* Weapons Deck - Gunners */}
      <div className="space-y-2">
        <p className="text-xs xl:text-sm text-accent-red font-orbitron uppercase text-center mb-2">
          › Weapons Deck ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <GunnerStation stationNumber={1} />
          <GunnerStation stationNumber={2} />
        </div>
      </div>

      {/* Engineering Bay - Engineers */}
      <div className="space-y-2">
        <p className="text-xs xl:text-sm text-accent-yellow font-orbitron uppercase text-center mb-2">
          › Engineering Bay ‹
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <EngineerStation stationNumber={1} />
          <EngineerStation stationNumber={2} />
        </div>
      </div>
    </div>
  );
}
