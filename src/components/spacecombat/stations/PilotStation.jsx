import StationCard from '../StationCard';
import CombatActions from '../CombatActions';
import { STATIONS } from '../../../data/spaceCombatData';
import { useSpaceCombat } from '../../../context/SpaceCombatContext';

export default function PilotStation() {
  const { spaceCombat, assignStation, unassignStation } = useSpaceCombat();
  const station = STATIONS.pilot;
  const assignedCharacterId = spaceCombat.stationAssignments.pilot;

  return (
    <StationCard
      station={station}
      assignedCharacterId={assignedCharacterId}
      onAssign={assignStation}
      onUnassign={unassignStation}
    >
      <CombatActions 
        stationId={station.id}
        actionIds={station.actions}
        assignedCharacterId={assignedCharacterId}
      />
    </StationCard>
  );
}
