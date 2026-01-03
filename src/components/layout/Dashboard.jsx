import { useState, useEffect, useRef } from 'react';
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
const CURRENT_PANEL_VERSION = '3'; // Increment when making breaking changes

const defaultPanels = [
  { id: 'threat-die', component: 'ThreatDie', title: 'Threat Die', variant: 'red', column: 'left' },
  { id: 'mission-tracks', component: 'MissionTrack', title: 'Mission Tracks', variant: 'cyan', column: 'left' },
  { id: 'danger-clocks', component: 'DangerClock', title: 'Danger Clocks', variant: 'red', column: 'left' },
  { id: 'dice-roller', component: 'DiceRoller', title: 'Dice Roller', variant: 'yellow', column: 'center' },
  { id: 'party-panel', component: 'PartyPanel', title: 'Party', variant: 'red', column: 'center' },
  { id: 'ship-log', component: 'DiceLog', title: 'Ship Log', variant: 'cyan', column: 'center' },
  { id: 'oracle-compendium', component: 'OraclePanel', title: 'Oracle Compendium', variant: 'cyan', column: 'right' },
  { id: 'session-journal', component: 'SessionJournal', title: 'Session Journal', variant: 'yellow', column: 'right' },
];

export default function Dashboard({ roomCode }) {
  const { refreshPartyMembers } = useParty();
  const { viewingCombat } = useSpaceCombat();
  const { gameState, updateGameState, loading: gameLoading } = useGame();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [panels, setPanels] = useState(() => {
    // Check version - reset if outdated
    const savedVersion = localStorage.getItem(PANEL_VERSION_KEY);
    if (savedVersion !== CURRENT_PANEL_VERSION) {
      // Clear old config and set new version
      localStorage.removeItem(PANEL_ORDER_KEY);
      localStorage.setItem(PANEL_VERSION_KEY, CURRENT_PANEL_VERSION);
      return defaultPanels.map(p => ({ ...p, isCollapsed: false }));
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
          return { ...defaultPanelMap.get('party-panel'), column: savedPanel.column, isCollapsed: savedPanel.isCollapsed || false };
        }
        return savedPanel;
      });
      
      // Update saved panels with any new default properties (like variant changes)
      const updatedPanels = migratedPanels
        .map(savedPanel => {
          const defaultPanel = defaultPanelMap.get(savedPanel.id);
          if (defaultPanel) {
            // Merge default properties, but keep user's column and collapsed preferences
            return { ...defaultPanel, column: savedPanel.column, isCollapsed: savedPanel.isCollapsed || false };
          }
          return null; // Remove panels that don't exist in defaults
        })
        .filter(Boolean); // Remove null entries
      
      // Add any new panels that don't exist in saved config
      const savedIds = new Set(migratedPanels.map(p => p.id));
      const newPanels = defaultPanels.filter(p => !savedIds.has(p.id)).map(p => ({ ...p, isCollapsed: false }));
      
      return [...newPanels, ...updatedPanels];
    }
    return defaultPanels.map(p => ({ ...p, isCollapsed: false }));
  });
  const [draggedPanel, setDraggedPanel] = useState(null);
  const [dragOverPanel, setDragOverPanel] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpModalTab, setHelpModalTab] = useState('threatDie');
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);

  // Refs for sync lock pattern to prevent feedback loop
  const isReceivingRemoteRef = useRef(false);
  const lastSyncedPanelStatesRef = useRef(null);

  // Effect 1: Receive remote panel state changes from other players
  useEffect(() => {
    if (!gameState.panelStates) return;
    
    // Compare to last synced to avoid unnecessary updates
    const remoteStates = JSON.stringify(gameState.panelStates);
    if (remoteStates === lastSyncedPanelStatesRef.current) return;
    
    // Set flag to indicate we're processing a remote update
    isReceivingRemoteRef.current = true;
    
    // Apply remote panel states to local panels
    setPanels(currentPanels => 
      currentPanels.map(panel => ({
        ...panel,
        isCollapsed: gameState.panelStates[panel.id] ?? panel.isCollapsed
      }))
    );
    
    // Reset flag after React batch update
    setTimeout(() => { isReceivingRemoteRef.current = false; }, 0);
  }, [gameState.panelStates]);

  // Effect 2: Sync local changes to DB (skip if receiving remote update)
  useEffect(() => {
    // Skip if we're currently processing a remote update (prevents feedback loop)
    if (isReceivingRemoteRef.current) return;
    
    localStorage.setItem(PANEL_ORDER_KEY, JSON.stringify(panels));
    
    // Sync to gameState for multiplayer persistence
    const panelStates = {};
    panels.forEach(panel => {
      panelStates[panel.id] = panel.isCollapsed || false;
    });
    
    const newStates = JSON.stringify(panelStates);
    if (newStates !== lastSyncedPanelStatesRef.current) {
      lastSyncedPanelStatesRef.current = newStates;
      updateGameState({ panelStates });
    }
  }, [panels, updateGameState]);

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
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = panels.findIndex(p => p.id === draggedPanel);
    const targetIndex = panels.findIndex(p => p.id === targetPanelId);
    const targetPanel = panels[targetIndex];

    const newPanels = [...panels];
    const [removed] = newPanels.splice(draggedIndex, 1);
    
    // Update the dragged panel's column to match the target panel's column
    removed.column = targetPanel.column;
    
    newPanels.splice(targetIndex, 0, removed);

    setPanels(newPanels);
    setDraggedPanel(null);
    setDragOverPanel(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedPanel(null);
    setDragOverPanel(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e, columnName) => {
    e.preventDefault();
    setDragOverColumn(columnName);
  };

  const handleColumnDrop = (e, columnName) => {
    e.preventDefault();
    
    if (!draggedPanel) {
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = panels.findIndex(p => p.id === draggedPanel);
    const newPanels = [...panels];
    const [removed] = newPanels.splice(draggedIndex, 1);
    
    // Update the dragged panel's column
    removed.column = columnName;
    
    // Add to the end of the panels array (it will be filtered to the correct column on render)
    newPanels.push(removed);

    setPanels(newPanels);
    setDraggedPanel(null);
    setDragOverPanel(null);
    setDragOverColumn(null);
  };

  const openHelp = (tab) => {
    setHelpModalTab(tab);
    setHelpModalOpen(true);
  };

  const handlePanelCollapse = (panelId, isCollapsed) => {
    setPanels(prevPanels =>
      prevPanels.map(panel =>
        panel.id === panelId ? { ...panel, isCollapsed } : panel
      )
    );
  };

  const renderPanel = (panel) => {
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
        className="relative"
      >
        {/* Drop indicator above panel */}
        {isDragOver && (
          <div className="absolute -top-3 left-0 right-0 h-1 bg-accent-cyan rounded-full shadow-lg shadow-accent-cyan/50 z-50 animate-pulse" />
        )}
        
        <div
          onDragOver={(e) => handleDragOver(e, panel.id)}
          onDrop={(e) => handleDrop(e, panel.id)}
          className={`transition-all duration-200 mb-4 lg:mb-6 last:mb-0 ${
            isBeingDragged ? 'opacity-40 scale-95' : ''
          } ${isDragOver ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-bg-primary' : ''}`}
        >
          <Panel 
            title={
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 opacity-50" />
                <span>{panel.title}</span>
              </div>
            }
            variant={panel.variant}
            collapsed={panel.isCollapsed}
            onCollapsedChange={(isCollapsed) => handlePanelCollapse(panel.id, isCollapsed)}
            maxHeightExpanded={maxHeightExpanded}
            minHeightExpanded={minHeightExpanded}
            onHelpClick={
              panel.id === 'threat-die' ? () => openHelp('threatDie') :
              panel.id === 'mission-tracks' ? () => openHelp('missionTracks') :
              panel.id === 'danger-clocks' ? () => openHelp('dangerClocks') :
              undefined
            }
            draggable
            onDragStart={(e) => handleDragStart(e, panel.id)}
            onDragEnd={handleDragEnd}
          >
            {components[panel.component]}
          </Panel>
        </div>
      </div>
    );
  };

  const leftPanels = panels.filter(p => p.column === 'left');
  const centerPanels = panels.filter(p => p.column === 'center');
  const rightPanels = panels.filter(p => p.column === 'right');

  const renderColumnDropZone = (columnName) => {
    const isActive = dragOverColumn === columnName && draggedPanel;
    return (
      <div
        onDragOver={(e) => handleColumnDragOver(e, columnName)}
        onDrop={(e) => handleColumnDrop(e, columnName)}
        className={`hidden lg:block lg:min-h-[100px] flex-1 transition-all duration-200 border-2 border-dashed rounded ${
          isActive 
            ? 'border-accent-cyan bg-accent-cyan/10' 
            : 'border-transparent'
        }`}
      />
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

  return (
    <div className="min-h-screen bg-bg-primary scanlines flex flex-col">
      <Header roomCode={roomCode} onOpenCharacterSheet={() => setCharacterSheetOpen(true)} />
      
      <div className="flex-1 p-4 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 overflow-hidden">
        {/* Left Column - Trackers (3 columns) */}
        <div className="space-y-4 lg:contents lg:block lg:col-span-3 lg:space-y-6 lg:flex lg:flex-col">
          {leftPanels.map(renderPanel)}
          {renderColumnDropZone('left')}
        </div>

        {/* Center Column - Dice Roller & Log (3 columns) */}
        <div className="space-y-4 lg:contents lg:block lg:col-span-3 lg:space-y-6 lg:flex lg:flex-col">
          {centerPanels.map(renderPanel)}
          {renderColumnDropZone('center')}
        </div>

        {/* Right Column - Oracle Compendium & Journal (6 columns - wider!) */}
        <div className="space-y-4 lg:contents lg:block lg:col-span-6 lg:space-y-6 lg:flex lg:flex-col">
          {rightPanels.map(renderPanel)}
          {renderColumnDropZone('right')}
        </div>
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

