'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Map, { Source, Layer, MapRef, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MarkerData {
    lat: number;
    lng: number;
    label?: string;
    year?: number;
    word?: string;
    country_code?: string;
}

interface GlobeProps {
    markers?: MarkerData[];
    year?: number;
}

export default function Globe({ markers = [], year = 2024 }: GlobeProps) {
    const mapRef = useRef<MapRef>(null);
    const [token, setToken] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('mapbox_access_token');
        if (storedToken) {
            setToken(storedToken);
        }
        setMounted(true);
    }, []);

    // Active Path Logic
    const activePath = useMemo(() => {
        if (!markers.length) return null;

        // Sort markers by year (assuming API implementation returns years or we mock them)
        // If year is missing, default to 0 for sorting
        const sortedMarkers = [...markers].sort((a, b) => (a.year || 0) - (b.year || 0));

        // Filter markers that are "active" (year <= current year)
        const activeMarkers = sortedMarkers.filter(m => (m.year || 0) <= year);

        if (activeMarkers.length < 2) return null;

        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: activeMarkers.map(m => [m.lng, m.lat])
            }
        };
    }, [markers, year]);

    // Active Country Logic
    const activeCountryCode = useMemo(() => {
        if (!markers.length) return null;
        const sortedMarkers = [...markers].sort((a, b) => (a.year || 0) - (b.year || 0));
        const activeMarkers = sortedMarkers.filter(m => (m.year || 0) <= year);
        const currentMarker = activeMarkers[activeMarkers.length - 1];
        return currentMarker?.country_code || null;
    }, [markers, year]);

    // Camera Animation Logic
    useEffect(() => {
        if (!mapRef.current || !markers.length) return;

        // Find the latest active marker to fly to
        // We use a bit of a buffer: if the year matches exactly or we just passed it
        const sortedMarkers = [...markers].sort((a, b) => (a.year || 0) - (b.year || 0));
        const activeMarkers = sortedMarkers.filter(m => (m.year || 0) <= year);
        const currentMarker = activeMarkers[activeMarkers.length - 1];

        if (currentMarker) {
            mapRef.current.flyTo({
                center: [currentMarker.lng, currentMarker.lat],
                zoom: 5, // closer zoom for "particular area" focus
                speed: 1.2, // slightly faster to match the 2s timeline step
                curve: 1.2,
                essential: true
            });
        }
    }, [year, (markers.length)]); // Trigger on year change

    if (!mounted) return null;

    if (!token) {
        return (
            <div className="absolute inset-0 -z-10 flex items-center justify-center bg-black">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                    <h3 className="text-white font-bold mb-2">Mapbox Token Missing</h3>
                    <p className="text-white/60 text-sm mb-4">Please add your Mapbox Access Token in Settings</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 -z-10 bg-black">
            <Map
                ref={mapRef}
                mapboxAccessToken={token}
                initialViewState={{
                    longitude: 0,
                    latitude: 20,
                    zoom: 1.5,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                projection={{ name: 'globe' }}
                fog={{
                    "range": [0.5, 10],
                    "color": "#000000",
                    "horizon-blend": 0.05,
                    "high-color": "#222",
                    "space-color": "#000000",
                    "star-intensity": 0.6
                }}
                interactive={true}
            >
                {/* 0. Country Highlight Layer */}
                <Source id="countries" type="geojson" data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson">
                    <Layer
                        id="country-highlight"
                        type="fill"
                        paint={{
                            'fill-color': 'rgba(96, 165, 250, 0.2)', // blue-400 with opacity
                            'fill-outline-color': 'rgba(96, 165, 250, 0.6)'
                        }}
                        filter={['==', 'iso_a2', activeCountryCode || '']}
                    />
                </Source>

                {/* 1. Path Line Layer */}
                {activePath && (
                    <Source id="path-source" type="geojson" data={activePath as any}>
                        <Layer
                            id="path-layer"
                            type="line"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round'
                            }}
                            paint={{
                                'line-color': '#60a5fa', // blue-400
                                'line-width': 4,
                                'line-opacity': 0.8,
                                'line-blur': 1
                            }}
                        />
                    </Source>
                )}

                {/* 2. Markers */}
                {markers.map((marker, index) => {
                    const isVisible = (marker.year || 0) <= year;
                    // If playing, maybe we only show discovered ones? Yes.
                    // For now, let's show all but highlight active? 
                    // Better to only show active for "unfolding" effect
                    if (!isVisible) return null;

                    return (
                        <Marker key={index} longitude={marker.lng} latitude={marker.lat} anchor="center">
                            <div className="relative flex items-center justify-center group">
                                {marker.label && (
                                    <div className="absolute bottom-full mb-3 bg-black/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 z-10 pointer-events-none whitespace-nowrap">
                                        {marker.word && <span className="text-sm font-bold text-white mb-0.5">{marker.word}</span>}
                                        <div className="flex items-center gap-1 text-[10px] text-white/60">
                                            <span>{marker.label}</span>
                                            {marker.year && <span>({marker.year})</span>}
                                        </div>
                                        {/* Little triangle arrow pointing down */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/10"></div>
                                    </div>
                                )}

                                <div className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-500 ${(marker.year || 0) === year ? 'bg-yellow-400 scale-150 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                    }`} />
                            </div>
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
}
