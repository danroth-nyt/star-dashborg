import { useState, useEffect } from 'react';
import { X, Users, Plus, BookOpen, Trash2 } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import EnemyCard from './EnemyCard';
import EnemyGenerator from './EnemyGenerator';
import EnemyDocsPanel from './EnemyDocsPanel';

const TABS = [
  { id: 'units', label: 'Units', icon: Users },
  { id: 'generate', label: 'Generate', icon: Plus },
  { id: 'rules', label: 'Rules', icon: BookOpen },
];

export default function EnemyDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('units');
  const { spaceCombat, removeEnemy, clearAllEnemies, getActiveEnemyCount } = useSpaceCombat();
  const enemies = spaceCombat.enemies || [];
  const activeCount = getActiveEnemyCount();
  
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle clear all with confirmation
  const handleClearAll = () => {
    if (enemies.length === 0) return;
    if (window.confirm(`Clear all ${enemies.length} enemies?`)) {
      clearAllEnemies();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-full sm:w-[400px] md:w-[450px] bg-bg-primary border-r-3 border-accent-red flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-bg-secondary">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-accent-red rounded-full glow-pulse-red"></div>
            <div>
              <h2 className="font-orbitron font-bold text-lg text-accent-red">
                ENEMY FORCES
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {enemies.length} total • {activeCount} active
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-accent-red transition-colors rounded border border-transparent hover:border-accent-red"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-orbitron transition-colors ${
                  isActive
                    ? 'text-accent-cyan border-b-2 border-accent-cyan bg-accent-cyan/5'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === 'units' && enemies.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-accent-red text-white rounded-full">
                    {enemies.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Units Tab */}
          {activeTab === 'units' && (
            <div className="space-y-3">
              {enemies.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No enemies spawned</p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="px-4 py-2 text-sm font-orbitron text-accent-cyan border border-accent-cyan rounded hover:bg-accent-cyan hover:text-bg-primary transition-colors"
                  >
                    Generate Enemies
                  </button>
                </div>
              ) : (
                <>
                  {/* Clear All Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:text-accent-red transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>
                  
                  {/* Enemy Cards */}
                  {enemies.map((enemy) => (
                    <EnemyCard 
                      key={enemy.id} 
                      enemy={enemy}
                      onRemove={removeEnemy}
                    />
                  ))}
                </>
              )}
            </div>
          )}
          
          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <EnemyGenerator />
          )}
          
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <EnemyDocsPanel />
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-700 p-3 bg-bg-secondary">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Press ESC to close</span>
            <span>Swipe right to close on mobile</span>
          </div>
        </div>
      </div>
    </>
  );
}
