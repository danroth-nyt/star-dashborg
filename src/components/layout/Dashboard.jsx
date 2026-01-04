import { useState, useEffect } from 'react';
import Header from './Header';
import Panel from './Panel';
import ThreatDie from '../trackers/ThreatDie';
import MissionTrack from '../trackers/MissionTrack';
import DangerClock from '../trackers/DangerClock';
import DiceLog from '../journal/DiceLog';
import SessionJournal from '../journal/SessionJournal';
import DiceRoller from '../oracles/DiceRoller';
import OraclePanel from '../oracles/OraclePanel';
import HelpModal from '../ui/HelpModal';
import PartyPanel from '../character/PartyPanel';
import CharacterSheetDrawer from '../character/CharacterSheetDrawer';
import SpaceCombatView from '../spacecombat/SpaceCombatView';
import LoadingScreen from '../ui/LoadingScreen';
import { useParty } from '../../context/PartyContext';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useGame } from '../../context/GameContext';
import { isUserTyping } from '../../lib/keyboardUtils';

const PANEL_ORDER_KEY = 'star-dashborg-panel-order';
const PANEL_VERSION_KEY = 'star-dashborg-panel-version';
const MOBILE_COLLAPSED_KEY = 'star-dashborg-mobile-collapsed';
const CURRENT_PANEL_VERSION = '4'; // Increment when making breaking changes

const defaultPanels = [
  { id: 'threat-die', component: 'ThreatDie', title: 'Threat Die', variant: 'red', mobileCollapsedDefault: false },
  { id: 'dice-roller', component: 'DiceRoller', title: 'Dice Roller', variant: 'yellow', mobileCollapsedDefault: false },
  { id: 'oracle-compendium', component: 'OraclePanel', title: 'Oracle Compendium', variant: 'cyan', mobileCollapsedDefault: false },
  { id: 'ship-log', component: 'DiceLog', title: 'Ship Log', variant: 'cyan', mobileCollapsedDefault: true },
  { id: 'party-panel', component: 'PartyPanel', title: 'Party', variant: 'red', mobileCollapsedDefault: false },
  { id: 'danger-clocks', component: 'DangerClock', title: 'Danger Clocks', variant: 'red', mobileCollapsedDefault: true },
  { id: 'mission-tracks', component: 'MissionTrack', title: 'Mission Tracks', variant: 'cyan', mobileCollapsedDefault: true },
  { id: 'session-journal', component: 'SessionJournal', title: 'Session Journal', variant: 'yellow', mobileCollapsedDefault: false },
];

export default function Dashboard({ roomCode }) {
  const { refreshPartyMembers } = useParty();
  const { viewingCombat } = useSpaceCombat();
  const { loading: gameLoading } = useGame();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [panels, setPanels] = useState(() => {
    // Check version - reset if outdated
    const savedVersion = localStorage.getItem(PANEL_VERSION_KEY);
    if (savedVersion !== CURRENT_PANEL_VERSION) {
      // Clear old config and set new version
      localStorage.removeItem(PANEL_ORDER_KEY);
      localStorage.setItem(PANEL_VERSION_KEY, CURRENT_PANEL_VERSION);
      return defaultPanels;
    }

    const saved = localStorage.getItem(PANEL_ORDER_KEY);
    if (saved) {
      const savedPanels = JSON.parse(saved);
      // Create a map of default panel configs for easy lookup
      const defaultPanelMap = new Map(defaultPanels.map(p => [p.id, p]));
      
      // Migrate old character-panel to party-panel
      const migratedPanels = savedPanels.map(savedPanel => {
        if (savedPanel.id === 'character-panel') {
          // Replace old character-panel with party-panel
          return defaultPanelMap.get('party-panel');
        }
        return savedPanel;
      });
      
      // Update saved panels with any new default properties (like variant changes)
      const updatedPanels = migratedPanels
        .map(savedPanel => {
          const defaultPanel = defaultPanelMap.get(savedPanel.id);
          if (defaultPanel) {
            // Merge default properties
            return { ...defaultPanel };
          }
          return null; // Remove panels that don't exist in defaults
        })
        .filter(Boolean); // Remove null entries
      
      // Add any new panels that don't exist in saved config
      const savedIds = new Set(migratedPanels.map(p => p.id));
      const newPanels = defaultPanels.filter(p => !savedIds.has(p.id));
      
      return [...newPanels, ...updatedPanels];
    }
    return defaultPanels;
  });
  const [draggedPanel, setDraggedPanel] = useState(null);
  const [dragOverPanel, setDragOverPanel] = useState(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpModalTab, setHelpModalTab] = useState('threatDie');
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
  
  // Mobile collapsed state - load from localStorage or use defaults
  const [mobileCollapsed, setMobileCollapsed] = useState(() => {
    const saved = localStorage.getItem(MOBILE_COLLAPSED_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with default collapsed states
    const initial = {};
    defaultPanels.forEach(panel => {
      initial[panel.id] = panel.mobileCollapsedDefault;
    });
    return initial;
  });

  // Effect: Save panel state to localStorage (per-player)
  useEffect(() => {
    localStorage.setItem(PANEL_ORDER_KEY, JSON.stringify(panels));
  }, [panels]);

  // Effect: Save mobile collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(MOBILE_COLLAPSED_KEY, JSON.stringify(mobileCollapsed));
  }, [mobileCollapsed]);

  // Keyboard shortcuts for help modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      // H or ? key opens help modal (ignore if typing in any text field)
      if ((e.key === 'h' || e.key === 'H' || e.key === '?') && !isUserTyping()) {
        e.preventDefault();
        setHelpModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Refresh party members on mount to catch any missed realtime events
  useEffect(() => {
    refreshPartyMembers();
  }, [refreshPartyMembers]);

  const handleDragStart = (e, panelId) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', panelId);
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

    // Swap panel positions in the array (which swaps their slots)
    const newPanels = [...panels];
    const temp = newPanels[draggedIndex];
    newPanels[draggedIndex] = newPanels[targetIndex];
    newPanels[targetIndex] = temp;

    setPanels(newPanels);
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  const handleDragEnd = () => {
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  const openHelp = (tab) => {
    setHelpModalTab(tab);
    setHelpModalOpen(true);
  };

  const handleMobileCollapse = (panelId, isCollapsed) => {
    setMobileCollapsed(prev => ({
      ...prev,
      [panelId]: isCollapsed
    }));
  };


  // Define grid slots - panels adapt to whatever slot they're placed in
  const gridSlots = [
    { id: 'slot-1', gridRow: '1', gridCol: '1 / 3' },      // Top-left small
    { id: 'slot-2', gridRow: '1', gridCol: '3 / 7' },      // Top-center 
    { id: 'slot-3', gridRow: '1 / 3', gridCol: '7 / 13' }, // Right large (spans 2 rows)
    { id: 'slot-4', gridRow: '2', gridCol: '1 / 4' },      // Mid-left
    { id: 'slot-5', gridRow: '2', gridCol: '4 / 7' },      // Mid-center
    { id: 'slot-6', gridRow: '3', gridCol: '1 / 4' },      // Bottom-left
    { id: 'slot-7', gridRow: '3', gridCol: '4 / 7' },      // Bottom-center
    { id: 'slot-8', gridRow: '3', gridCol: '7 / 13' },     // Bottom-right
  ];

  // Get panels with their slot positions
  const getPanelsWithSlots = () => {
    return panels.map((panel, index) => ({
      ...panel,
      gridRow: gridSlots[index].gridRow,
      gridCol: gridSlots[index].gridCol
      // Keep panel's original id, don't overwrite with slot id
    }));
  };

  // Mobile panel renderer - no grid positioning, panels stack naturally
  const renderMobilePanel = (panel) => {
    const components = {
      PartyPanel: <PartyPanel onExpand={() => setCharacterSheetOpen(true)} />,
      ThreatDie: <ThreatDie />,
      MissionTrack: <MissionTrack />,
      DangerClock: <DangerClock />,
      DiceRoller: <DiceRoller />,
      DiceLog: <DiceLog />,
      OraclePanel: <OraclePanel />,
      SessionJournal: <SessionJournal roomCode={roomCode} />,
    };

    // Skip rendering if component doesn't exist (e.g., old CharacterPanel)
    if (!components[panel.component]) {
      return null;
    }

    return (
      <div key={panel.id} className="relative">
        <Panel 
          title={panel.title}
          variant={panel.variant}
          onHelpClick={
            panel.id === 'threat-die' ? () => openHelp('threatDie') :
            panel.id === 'mission-tracks' ? () => openHelp('missionTracks') :
            panel.id === 'danger-clocks' ? () => openHelp('dangerClocks') :
            undefined
          }
          collapsible={true}
          collapsed={mobileCollapsed[panel.id] || false}
          onCollapsedChange={(isCollapsed) => handleMobileCollapse(panel.id, isCollapsed)}
          mobileMaxHeight={panel.id === 'ship-log' ? '30vh' : undefined}
        >
          {components[panel.component]}
        </Panel>
      </div>
    );
  };

  // Desktop panel renderer - with grid positioning and drag-drop
  const renderGridPanel = (panel) => {
    const components = {
      PartyPanel: <PartyPanel onExpand={() => setCharacterSheetOpen(true)} />,
      ThreatDie: <ThreatDie />,
      MissionTrack: <MissionTrack />,
      DangerClock: <DangerClock />,
      DiceRoller: <DiceRoller />,
      DiceLog: <DiceLog />,
      OraclePanel: <OraclePanel />,
      SessionJournal: <SessionJournal roomCode={roomCode} />,
    };

    // Skip rendering if component doesn't exist (e.g., old CharacterPanel)
    if (!components[panel.component]) {
      return null;
    }

    const isBeingDragged = draggedPanel === panel.id;
    const isDragOver = dragOverPanel === panel.id;

    return (
      <div
        key={panel.id}
        style={{
          gridRow: panel.gridRow,
          gridColumn: panel.gridCol,
        }}
        className="relative transition-all duration-300"
      >
        {/* Drop indicator overlay */}
        {isDragOver && (
          <div className="absolute inset-0 border-2 border-accent-cyan bg-accent-cyan/10 rounded z-50 pointer-events-none animate-pulse" />
        )}
        
        <div
          onDragOver={(e) => handleDragOver(e, panel.id)}
          onDrop={(e) => handleDrop(e, panel.id)}
          className={`h-full transition-all duration-200 ${
            isBeingDragged ? 'opacity-40 scale-95' : ''
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          <Panel 
            title={panel.title}
            variant={panel.variant}
            onHelpClick={
              panel.id === 'threat-die' ? () => openHelp('threatDie') :
              panel.id === 'mission-tracks' ? () => openHelp('missionTracks') :
              panel.id === 'danger-clocks' ? () => openHelp('dangerClocks') :
              undefined
            }
            draggable={true}
            onDragStart={(e) => handleDragStart(e, panel.id)}
            onDragEnd={handleDragEnd}
          >
            {components[panel.component]}
          </Panel>
        </div>
      </div>
    );
  };


  // Show loading screen while game state is loading
  // This prevents flash when reloading while in space combat
  if (gameLoading) {
    return (
      <LoadingScreen 
        message="LOADING GAME STATE"
        details={[
          'Retrieving session data...',
          'Syncing ship systems...',
          'Restoring battle stations...'
        ]}
      />
    );
  }

  // If this user is viewing space combat, show space combat view
  if (viewingCombat) {
    return (
      <>
        <SpaceCombatView roomCode={roomCode} />
        {/* Character Sheet Drawer is available in combat too */}
        <CharacterSheetDrawer 
          isOpen={characterSheetOpen}
          onClose={() => setCharacterSheetOpen(false)}
          roomCode={roomCode}
        />
      </>
    );
  }

  // Get panels with their slot positions (only needed for desktop)
  const panelsWithSlots = getPanelsWithSlots();

  return (
    <div className="min-h-screen bg-bg-primary scanlines flex flex-col">
      <Header roomCode={roomCode} onOpenCharacterSheet={() => setCharacterSheetOpen(true)} />
      
      {/* Mobile: Stack panels vertically - use original panels array for natural order */}
      <div className="flex-1 p-4 space-y-4 lg:hidden">
        {panels.map(renderMobilePanel)}
      </div>

      {/* Desktop: Grid layout - use panelsWithSlots for grid positioning */}
      <div className="hidden lg:grid dashboard-grid p-4 gap-4">
        {panelsWithSlots.map(renderGridPanel)}
      </div>

      {/* Help Modal */}
      <HelpModal 
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        initialTab={helpModalTab}
      />
      
      {/* Character Sheet Drawer */}
      <CharacterSheetDrawer 
        isOpen={characterSheetOpen}
        onClose={() => setCharacterSheetOpen(false)}
        roomCode={roomCode}
      />
    </div>
  );
}

