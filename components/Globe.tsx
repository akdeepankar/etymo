'use client';

import { useEffect, useState } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/mapbox';
import { useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Marker } from 'react-map-gl/mapbox';

interface MarkerData {
    lat: number;
    lng: number;
    label?: string;
}

interface GlobeProps {
    markers?: MarkerData[];
}

export default function Globe({ markers = [] }: GlobeProps) {
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

    if (!mounted) return null;

    if (!token) {
        return (
            <div className="absolute inset-0 -z-10 flex items-center justify-center bg-black">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                    <h3 className="text-white font-bold mb-2">Mapbox Token Missing</h3>
                    <p className="text-white/60 text-sm mb-4">Please add your Mapbox Access Token in Settings</p>
                    <div className="w-32 h-32 rounded-full border-2 border-white/20 mx-auto animate-pulse bg-white/5" />
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
                {markers.map((marker, index) => (
                    <Marker key={index} longitude={marker.lng} latitude={marker.lat} anchor="bottom">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
                            {marker.label && (
                                <div className="mt-1 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs text-white whitespace-nowrap border border-white/10">
                                    {marker.label}
                                </div>
                            )}
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
