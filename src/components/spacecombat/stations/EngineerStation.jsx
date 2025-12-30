import StationCard from '../StationCard';
import CombatActions from '../CombatActions';
import { STATIONS } from '../../../data/spaceCombatData';
import { useSpaceCombat } from '../../../context/SpaceCombatContext';

export default function EngineerStation({ stationNumber = 1 }) {
  const { spaceCombat, assignStation, unassignStation } = useSpaceCombat();
  const stationId = `engineer${stationNumber}`;
  const station = STATIONS[stationId];
  const assignedCharacterId = spaceCombat.stationAssignments[stationId];

  return (
    <StationCard
      station={{ ...station, name: `Engineer ${stationNumber}` }}
      assignedCharacterId={assignedCharacterId}
      onAssign={assignStation}
      onUnassign={unassignStation}
    >
      <CombatActions 
        stationId={stationId}
        actionIds={station.actions}
        assignedCharacterId={assignedCharacterId}
      />
    </StationCard>
  );
}
