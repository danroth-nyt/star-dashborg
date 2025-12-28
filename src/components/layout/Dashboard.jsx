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
      
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Trackers */}
        <div className="space-y-4">
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

        {/* Center Column - Journal */}
        <div className="space-y-4">
          <Panel title="Dice Log" variant="cyan" className="h-[400px]">
            <DiceLog />
          </Panel>
          
          <Panel title="Session Journal" variant="yellow" className="h-[400px]">
            <SessionJournal />
          </Panel>
        </div>

        {/* Right Column - Tools */}
        <div className="space-y-4">
          <Panel title="Dice Roller" variant="cyan">
            <DiceRoller />
          </Panel>
          
          <Panel title="Oracles & Generators" variant="yellow">
            <OraclePanel />
          </Panel>
        </div>
      </div>
    </div>
  );
}

