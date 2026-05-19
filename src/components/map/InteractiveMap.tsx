import { useEffect, useState, useRef } from 'react';
import type { Lang } from '../../i18n/ui';

interface Marker {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
  guide: string;
}

interface MapData {
  markers: Marker[];
  layers: string[];
  center: [number, number];
  zoom: number;
}

interface Props {
  lang: Lang;
}

const typeColors: Record<string, string> = {
  boss: '#ef4444',
  mounts: '#22c55e',
  teleports: '#3b82f6',
  collectibles: '#f59e0b',
  quests: '#8b5cf6',
};

export default function InteractiveMap({ lang }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const mapInstance = useRef<any>(null);
  const layerGroups = useRef<Record<string, any>>({});

  useEffect(() => {
    // Fetch marker data
    fetch('/map-markers.json')
      .then((r) => r.json())
      .then((data) => {
        setMapData(data);
        setActiveLayers(data.layers);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mapData || !mapRef.current || mapInstance.current) return;

    // Dynamic import of Leaflet (client-side only)
    import('leaflet').then((L) => {
      // Import Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const map = L.map(mapRef.current!, {
        center: mapData.center,
        zoom: mapData.zoom,
        minZoom: 2,
        maxZoom: 8,
      });

      // Use OpenStreetMap tiles as placeholder
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create layer groups
      mapData.layers.forEach((layer) => {
        layerGroups.current[layer] = L.layerGroup().addTo(map);
      });

      // Add markers
      mapData.markers.forEach((marker) => {
        const color = typeColors[marker.type] || '#6b7280';
        const icon = L.divIcon({
          html: `<div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">${marker.type === 'boss' ? '💀' : marker.type === 'mounts' ? '🐴' : marker.type === 'teleports' ? '⭐' : marker.type === 'collectibles' ? '💎' : '❓'}</div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const group = layerGroups.current[marker.type];
        if (group) {
          const m = L.marker([marker.lat, marker.lng], { icon })
            .bindPopup(`
              <div style="min-width: 200px">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${marker.name}</h3>
                <p style="color: #666; font-size: 13px; margin-bottom: 8px;">${marker.description}</p>
                ${marker.guide ? `<a href="/${lang}/guides/${marker.guide}" style="color: #dc2626; font-size: 13px;">View Guide →</a>` : ''}
              </div>
            `);
          m.addTo(group);
        }
      });

      mapInstance.current = map;

      // Fix Leaflet sizing issue
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [mapData]);

  const toggleLayer = (layer: string) => {
    setActiveLayers((prev) => {
      const isActive = prev.includes(layer);
      const next = isActive ? prev.filter((l) => l !== layer) : [...prev, layer];

      if (mapInstance.current && layerGroups.current[layer]) {
        if (isActive) {
          mapInstance.current.removeLayer(layerGroups.current[layer]);
        } else {
          mapInstance.current.addLayer(layerGroups.current[layer]);
        }
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 p-3">
        <h4 className="text-xs font-semibold text-surface-900 dark:text-surface-100 mb-2">Layers</h4>
        <div className="flex flex-col gap-1.5">
          {mapData?.layers.map((layer) => (
            <button
              key={layer}
              onClick={() => toggleLayer(layer)}
              className={`flex items-center gap-2 px-2 py-1 text-xs rounded transition-colors ${
                activeLayers.includes(layer)
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100'
                  : 'text-surface-400 line-through'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: typeColors[layer] || '#6b7280' }}
              />
              {layer.charAt(0).toUpperCase() + layer.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-[70vh] min-h-[500px] rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700" />
    </div>
  );
}
