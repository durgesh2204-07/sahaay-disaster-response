import React from 'react';
import { EmergencyReport, Shelter, ReliefCenter, RoadBlock, UserProfile, DangerZone } from '../types';
import { DisasterMap } from './map/DisasterMap';
import { useApp } from '../context/AppContext';

interface MapComponentProps {
  reports?: EmergencyReport[];
  shelters?: Shelter[];
  reliefCenters?: ReliefCenter[];
  roadBlocks?: RoadBlock[];
  volunteers?: UserProfile[];
  dangerZones?: DangerZone[];
  height?: string;
  onSelectMarker?: (item: any, type: string) => void;
  onRequestReportAtCoords?: (coords: { lat: number; lng: number }) => void;
  onRequestAddDangerZoneAtCoords?: (coords: { lat: number; lng: number }) => void;
  center?: [number, number];
  zoom?: number;
}

export const MapComponent: React.FC<MapComponentProps> = (props) => {
  const { dangerZones: contextDangerZones } = useApp();

  return (
    <DisasterMap
      {...props}
      dangerZones={props.dangerZones || contextDangerZones}
    />
  );
};
