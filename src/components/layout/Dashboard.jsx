import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Header from './Header';
import Panel from './Panel';
import ThreatDie from '../trackers/ThreatDie';
import MissionTrack from '../trackers/MissionTrack';
import DangerClock from '../trackers/DangerClock';
import DiceLog from '../journal/DiceLog';
import SessionJournal from '../journal/SessionJournal';
import DiceRoller from '../oracles/DiceRoller';
import OraclePanel from '../oracles/OraclePanel';

const PANEL_ORDER_KEY = 'star-dashborg-panel-order';

const defaultPanels = [
  { id: 'threat-die', component: 'ThreatDie', title: 'Threat Die', variant: 'red', column: 'left' },
  { id: 'mission-tracks', component: 'MissionTrack', title: 'Mission Tracks', variant: 'cyan', column: 'left' },
  { id: 'danger-clocks', component: 'DangerClock', title: 'Danger Clocks', variant: 'red', column: 'left' },
  { id: 'dice-roller', component: 'DiceRoller', title: 'Dice Roller', variant: 'yellow', column: 'center' },
  { id: 'ship-log', component: 'DiceLog', title: 'Ship Log', variant: 'cyan', column: 'center' },
  { id: 'oracle-compendium', component: 'OraclePanel', title: 'Oracle Compendium', variant: 'yellow', column: 'right' },
  { id: 'session-journal', component: 'SessionJournal', title: 'Session Journal', variant: 'cyan', column: 'right' },
];

export default function Dashboard({ roomCode }) {
  const [panels, setPanels] = useState(() => {
    const saved = localStorage.getItem(PANEL_ORDER_KEY);
    return saved ? JSON.parse(saved) : defaultPanels;
  });
  const [draggedPanel, setDraggedPanel] = useState(null);
  const [dragOverPanel, setDragOverPanel] = useState(null);

  useEffect(() => {
    localStorage.setItem(PANEL_ORDER_KEY, JSON.stringify(panels));
  }, [panels]);

  const handleDragStart = (e, panelId) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, panelId) => {
    e.preventDefault();
    if (draggedPanel !== panelId) {
      setDragOverPanel(panelId);
    }
  };

  const handleDrop = (e, targetPanelId) => {
    e.preventDefault();
    
    if (draggedPanel === targetPanelId) {
      setDraggedPanel(null);
      setDragOverPanel(null);
      return;
    }

    const draggedIndex = panels.findIndex(p => p.id === draggedPanel);
    const targetIndex = panels.findIndex(p => p.id === targetPanelId);

    const newPanels = [...panels];
    const [removed] = newPanels.splice(draggedIndex, 1);
    newPanels.splice(targetIndex, 0, removed);

    setPanels(newPanels);
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  const handleDragEnd = () => {
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  const renderPanel = (panel) => {
    const components = {
      ThreatDie: <ThreatDie />,
      MissionTrack: <MissionTrack />,
      DangerClock: <DangerClock />,
      DiceRoller: <DiceRoller />,
      DiceLog: <DiceLog />,
      OraclePanel: <OraclePanel />,
      SessionJournal: <SessionJournal />,
    };

    const isBeingDragged = draggedPanel === panel.id;
    const isDragOver = dragOverPanel === panel.id;

    // Determine height constraints based on panel type
    let maxHeightExpanded, minHeightExpanded;
    if (panel.component === 'DiceLog') {
      maxHeightExpanded = 'max-h-[450px]';
    } else if (panel.component === 'SessionJournal') {
      minHeightExpanded = 'min-h-[350px]';
    } else if (panel.component === 'OraclePanel') {
      maxHeightExpanded = 'max-h-[600px]';
    }

    return (
      <div
        key={panel.id}
        draggable
        onDragStart={(e) => handleDragStart(e, panel.id)}
        onDragOver={(e) => handleDragOver(e, panel.id)}
        onDrop={(e) => handleDrop(e, panel.id)}
        onDragEnd={handleDragEnd}
        className={`cursor-move transition-all duration-200 ${
          isBeingDragged ? 'opacity-40 scale-95' : ''
        } ${isDragOver ? 'scale-105' : ''}`}
      >
        <Panel 
          title={
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 opacity-50" />
              <span>{panel.title}</span>
            </div>
          }
          variant={panel.variant}
          maxHeightExpanded={maxHeightExpanded}
          minHeightExpanded={minHeightExpanded}
        >
          {components[panel.component]}
        </Panel>
      </div>
    );
  };

  const leftPanels = panels.filter(p => p.column === 'left');
  const centerPanels = panels.filter(p => p.column === 'center');
  const rightPanels = panels.filter(p => p.column === 'right');
  return (
    <div className="min-h-screen bg-bg-primary scanlines flex flex-col">
      <Header roomCode={roomCode} />
      
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column - Trackers (3 columns) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          {leftPanels.map(renderPanel)}
        </div>

        {/* Center Column - Dice Roller & Log (3 columns) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          {centerPanels.map(renderPanel)}
        </div>

        {/* Right Column - Oracle Compendium & Journal (6 columns - wider!) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          {rightPanels.map(renderPanel)}
        </div>
      </div>
    </div>
  );
}

