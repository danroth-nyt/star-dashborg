import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Play, MapPin, Search, ArrowRight, AlertTriangle, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import { rollDice, rollDangerousLocation } from '../../data/oracles';

export default function SiteExplorer() {
  const { addLog, gameState } = useGame();
  const [site, setSite] = useState(null);
  const [currentZone, setCurrentZone] = useState(0);
  const [visitedZones, setVisitedZones] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const generateSite = () => {
    // Roll d20 for site size
    const sizeRoll = rollDice(20);
    let size, baseZones, diceFormula;
    
    if (sizeRoll <= 10) {
      size = 'Small';
      baseZones = rollDice(6) + 2;
      diceFormula = 'd6+2';
    } else if (sizeRoll <= 16) {
      size = 'Medium';
      baseZones = rollDice(6) + 5;
      diceFormula = 'd6+5';
    } else {
      size = 'Large';
      baseZones = rollDice(12) + 5;
      diceFormula = 'd12+5';
    }

    const totalZones = baseZones + 1; // +1 for Objective Zone

    const newSite = {
      size,
      sizeRoll,
      diceFormula,
      totalZones,
      baseZones,
    };

    setSite(newSite);
    setCurrentZone(1);
    setVisitedZones([]);
    setIsComplete(false);
    
    addLog(`Site generated: ${size} (${totalZones} zones including Objective)`, 'mission');
  };

  const exploreZone = () => {
    if (!site || isComplete) return;

    const threatDie = gameState.threatDie || 1;
    const zoneData = rollDangerousLocation(threatDie);
    
    const zone = {
      number: currentZone,
      ship: zoneData.ship,
      base: zoneData.base,
      obstacleTriggered: zoneData.obstacleTriggered,
      obstacle: zoneData.obstacleTriggered ? zoneData.obstacle : null,
      threatRoll: zoneData.threatRoll,
      threatTotal: zoneData.threatTotal,
    };

    setVisitedZones([...visitedZones, zone]);
    
    const isObjective = currentZone === site.totalZones;
    
    if (isObjective) {
      addLog(`OBJECTIVE ZONE reached! ${zoneData.ship} / ${zoneData.base}${zoneData.obstacleTriggered ? ` - OBSTACLE: ${zoneData.obstacle}` : ''}`, 'success');
    } else {
      addLog(`Zone ${currentZone}: ${zoneData.ship} / ${zoneData.base}${zoneData.obstacleTriggered ? ` - OBSTACLE: ${zoneData.obstacle}` : ''}`, 'mission');
    }
  };

  const nextZone = () => {
    if (currentZone < site.totalZones) {
      setCurrentZone(currentZone + 1);
    } else {
      setIsComplete(true);
      addLog('Site exploration complete! Roll Escape Obstacle.', 'success');
    }
  };

  const searchZone = (hitType) => {
    if (!site) return;

    const searchRoll = hitType === 'strong' ? rollDice(20) : rollDice(10);
    const threatDie = gameState.threatDie || 1;
    const zoneData = rollDangerousLocation(threatDie);

    addLog(`Search (${hitType} hit) [${searchRoll}]: ${zoneData.search}`, 'roll');
  };

  const rollEscape = () => {
    const threatDie = gameState.threatDie || 1;
    const escapeData = rollDangerousLocation(threatDie);
    
    if (escapeData.obstacleTriggered) {
      addLog(`ESCAPE OBSTACLE: ${escapeData.obstacle}`, 'danger');
    } else {
      addLog(`Escape: Clear path, no obstacles!`, 'success');
    }
  };

  return (
    <div className="space-y-4">
      {/* Generate Site Button */}
      {!site && (
        <div className="text-center py-8 space-y-4">
          <div className="text-accent-cyan/30 text-4xl mb-2">🗺️</div>
          <p className="text-gray-500 font-orbitron text-sm">DANGEROUS LOCATION EXPLORER</p>
          <p className="text-gray-600 text-xs mb-4">Procedurally explore ships, bases, and installations</p>
          <Button onClick={generateSite} variant="primary" className="flex items-center gap-2 mx-auto">
            <Play className="w-4 h-4" />
            Generate Site
          </Button>
        </div>
      )}

      {/* Site Header */}
      {site && (
        <div className="border-3 border-accent-cyan bg-bg-secondary p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-orbitron font-bold text-accent-cyan text-lg">
                {site.size} Site
              </h3>
              <p className="text-gray-400 text-xs">
                {site.totalZones} total zones ({site.diceFormula} + 1 Objective)
              </p>
            </div>
            <Button onClick={generateSite} variant="ghost" className="text-xs">
              New Site
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-accent-cyan" />
            <div className="flex-1 flex gap-1">
              {Array.from({ length: site.totalZones }).map((_, i) => {
                const zoneNum = i + 1;
                const isVisited = visitedZones.some(z => z.number === zoneNum);
                const isCurrent = zoneNum === currentZone;
                const isObjective = zoneNum === site.totalZones;
                
                return (
                  <div
                    key={i}
                    className={`flex-1 h-2 border transition-all ${
                      isVisited
                        ? 'bg-accent-cyan border-accent-cyan'
                        : isCurrent
                        ? 'bg-accent-yellow border-accent-yellow animate-pulse'
                        : 'bg-transparent border-accent-cyan/30'
                    } ${isObjective ? 'border-2' : 'border'}`}
                  />
                );
              })}
            </div>
            <span className="text-accent-cyan font-orbitron font-bold text-sm">
              {currentZone}/{site.totalZones}
            </span>
          </div>

          {/* Action Buttons */}
          {!isComplete && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={exploreZone} 
                variant="primary" 
                className="flex items-center gap-2 justify-center text-sm"
                disabled={visitedZones.some(z => z.number === currentZone)}
              >
                <MapPin className="w-4 h-4" />
                Explore Zone {currentZone}
              </Button>
              <Button 
                onClick={nextZone} 
                variant="secondary" 
                className="flex items-center gap-2 justify-center text-sm"
                disabled={!visitedZones.some(z => z.number === currentZone)}
              >
                Next Zone
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Escape Button */}
          {isComplete && (
            <Button 
              onClick={rollEscape} 
              variant="danger" 
              className="w-full flex items-center gap-2 justify-center"
            >
              <AlertTriangle className="w-4 h-4" />
              Roll Escape Obstacle
            </Button>
          )}
        </div>
      )}

      {/* Current Zone Details */}
      {site && visitedZones.some(z => z.number === currentZone) && (
        <div className="border-2 border-accent-cyan bg-bg-primary p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className={`w-5 h-5 ${currentZone === site.totalZones ? 'text-accent-yellow' : 'text-accent-cyan'}`} />
            <h4 className="font-orbitron font-bold text-accent-cyan">
              {currentZone === site.totalZones ? 'OBJECTIVE ZONE' : `Zone ${currentZone}`}
            </h4>
          </div>

          {visitedZones
            .filter(z => z.number === currentZone)
            .map((zone, idx) => (
              <div key={idx} className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Ship Feature:</span>
                    <p className="text-text-primary font-orbitron">{zone.ship}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Base Feature:</span>
                    <p className="text-text-primary font-orbitron">{zone.base}</p>
                  </div>
                </div>

                <div className={`border-2 p-2 ${zone.obstacleTriggered ? 'border-accent-red bg-accent-red/10' : 'border-accent-cyan/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">
                      Obstacle Check: [{zone.threatRoll}] + Threat = {zone.threatTotal}
                    </span>
                  </div>
                  {zone.obstacleTriggered ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-accent-red" />
                      <span className="font-orbitron font-bold text-accent-red uppercase text-sm">
                        {zone.obstacle}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No obstacle (need 12+)</p>
                  )}
                </div>

                {/* Search Buttons */}
                <div>
                  <p className="text-gray-400 text-xs mb-2">Search Zone:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchZone('strong')}
                      className="px-3 py-2 bg-transparent border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all font-orbitron text-xs flex items-center gap-1 justify-center"
                    >
                      <Search className="w-3 h-3" />
                      Strong Hit (d20)
                    </button>
                    <button
                      onClick={() => searchZone('weak')}
                      className="px-3 py-2 bg-transparent border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-bg-primary transition-all font-orbitron text-xs flex items-center gap-1 justify-center"
                    >
                      <Search className="w-3 h-3" />
                      Weak Hit (d10)
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Visited Zones History */}
      {visitedZones.length > 1 && (
        <div className="border-t-2 border-accent-cyan/30 pt-3">
          <h4 className="text-accent-cyan/70 font-orbitron text-xs uppercase mb-2">
            Previous Zones:
          </h4>
          <div className="space-y-1">
            {visitedZones
              .filter(z => z.number !== currentZone)
              .map((zone) => (
                <div key={zone.number} className="text-xs text-gray-500 font-orbitron">
                  Zone {zone.number}: {zone.ship} / {zone.base}
                  {zone.obstacleTriggered && (
                    <span className="text-accent-red ml-2">({zone.obstacle})</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
