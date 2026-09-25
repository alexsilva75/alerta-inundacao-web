import { 
        MapContainer, 
        Marker, 
        Popup, 
        TileLayer,
        useMapEvents 
    } from "react-leaflet";

import type {LatLng} from 'leaflet';
import * as L from 'leaflet';

import "leaflet/dist/leaflet.css";
import {Paper} from '@mui/material';
import {useState, useEffect} from 'react';




interface MapProps{
    onMapLocationSelect: (locacion: LatLng) => void;
    initialPosition?: LatLng;
}
export function MapComponent({onMapLocationSelect, initialPosition}: MapProps){

    const [defaultPosition, setDefaultPosition] = useState<LatLng | null>(null);

    function MapEvents({
        onLocationSelect,
    }: {
        onLocationSelect: (location: LatLng) => void;
    }) {
        useMapEvents({
            click(e) {
                //alert('CLICOU NO MAPA');
                console.log('CLIQUE:', e.latlng);
                onLocationSelect(e.latlng);
            },
        });

        return null;
    }

    
    const [location, setLocation] = useState<LatLng | null>(null);

    //const [location, setLocation] = useState<LatLng | null>(null);
    const handleLocationSelection = (location: LatLng) => {   
        console.log('2 - MapComponent:', location);     
        onMapLocationSelect(location);
        setLocation(location)
    }

    useEffect(() => {  
        
        if(initialPosition){
            setDefaultPosition(initialPosition);
            return;
        }
        
        if("geolocation" in navigator) {
            console.log("Obtendo localização");
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Obtendo coordenadas.");
                setDefaultPosition(L.latLng(position.coords.latitude,
                            position.coords.longitude));             
                
                
            }, function(err){
                console.log(err)
                if(err.code == 2){                    
                    setDefaultPosition(L.latLng(-12.5571238, -38.7343115))
                }
            }, {});        
        }
    },[]);

    return (
        <Paper
            elevation={2}
            sx={{
                overflow: "hidden",
                height: { xs: 450, lg: 650 },
                borderRadius: 2,
            }}
        >
            <MapContainer
                center={defaultPosition ? defaultPosition : L.latLng(-12.5571238, -38.7343115) }
                zoom={13}
                scrollWheelZoom
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* <MapClickHandler onLocationSelect={handleLocationSelection} /> */}
                <MapEvents onLocationSelect={handleLocationSelection} />

                {location && (
                    <Marker position={location} />
                )}

            </MapContainer>
        </Paper>
    );
}