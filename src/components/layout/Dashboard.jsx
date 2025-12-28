import Header from './Header';
import Panel from './Panel';
import ThreatDie from '../trackers/ThreatDie';
import MissionTrack from '../trackers/MissionTrack';
import DangerClock from '../trackers/DangerClock';
import DiceLog from '../journal/DiceLog';
import SessionJournal from '../journal/SessionJournal';
import DiceRoller from '../oracles/DiceRoller';
import OraclePanel from '../oracles/OraclePanel';

export default function Dashboard({ roomCode }) {
  return (
    <div className="min-h-screen bg-bg-primary scanlines">
      <Header roomCode={roomCode} />
      
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column - Trackers (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Panel title="Threat Die" variant="red">
            <ThreatDie />
          </Panel>
          
          <Panel title="Mission Tracks" variant="cyan">
            <MissionTrack />
          </Panel>
          
          <Panel title="Danger Clocks" variant="red">
            <DangerClock />
          </Panel>
        </div>

        {/* Center Column - Dice Roller & Log (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Panel title="Dice Roller" variant="yellow">
            <DiceRoller />
          </Panel>
          
          <Panel title="Dice Log" variant="cyan" className="h-[400px]">
            <DiceLog />
          </Panel>
        </div>

        {/* Right Column - Oracle Compendium & Journal (6 columns - wider!) */}
        <div className="lg:col-span-6 space-y-4">
          <Panel title="Oracle Compendium" variant="yellow">
            <OraclePanel />
          </Panel>
          
          <Panel title="Session Journal" variant="cyan" className="h-[400px]">
            <SessionJournal />
          </Panel>
        </div>
      </div>
    </div>
  );
}

