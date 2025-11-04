import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DiseaseReport } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  reports: DiseaseReport[];
  center?: [number, number];
  zoom?: number;
  onReportClick?: (report: DiseaseReport) => void;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const MapView = ({ reports, center = [20.5937, 78.9629], zoom = 5, onReportClick }: MapViewProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-card">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom
      >
        <MapUpdater center={mapCenter} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            eventHandlers={{
              click: () => {
                setMapCenter([report.location.lat, report.location.lng]);
                onReportClick?.(report);
              },
            }}
          >
            <Popup>
              <Card className="border-0 shadow-none">
                <CardContent className="p-3 space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm">{report.diseaseName}</h3>
                    <p className="text-xs text-muted-foreground">{report.cropType}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getSeverityColor(report.severity) as any} className="text-xs">
                      {report.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs line-clamp-2">{report.description}</p>
                  {report.location.address && (
                    <p className="text-xs text-muted-foreground">{report.location.address}</p>
                  )}
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
