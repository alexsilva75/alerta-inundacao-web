import { Paper } from "@mui/material";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

type ReadonlyMapProps = {
    latitude: Number;
    longitude: Number;
    zoom?: number;
    height?: number | string;
    marker?: boolean;
};

export function ReadonlyMap({
    latitude,
    longitude,
    zoom = 15,
    height = 300,
    marker = true,
}: ReadonlyMapProps) {

    const center: [Number, Number] = [
        latitude,
        longitude,
    ];

    function MapResizeHandler() {

    const map = useMap();

    useEffect(() => {

        const container = map.getContainer();

        const observer = new ResizeObserver(() => {
            map.invalidateSize();
        });

        observer.observe(container);

        return () => observer.disconnect();

    }, [map]);

    return null;
}
    return (        
        <MapContainer
            center={center as [number, number]}
            zoom={zoom}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            touchZoom={false}
            zoomControl={false}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapResizeHandler />

            {marker && (
                <Marker position={center as [number, number]} />
            )}
        </MapContainer>        
    );
}