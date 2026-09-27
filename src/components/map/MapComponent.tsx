import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { 
        MapContainer, 
        Marker, 
        //Popup, 
        TileLayer,
        useMap,
        useMapEvents 
    } from "react-leaflet";

import type {LatLng} from 'leaflet';
import * as L from 'leaflet';

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

import "leaflet/dist/leaflet.css";
import {Paper} from '@mui/material';
import {useState, useEffect} from 'react';




interface MapProps{
    onMapLocationSelect: (locacion: LatLng) => void;
    initialPosition?: LatLng;
    location: LatLng | null;
}



export function MapComponent({onMapLocationSelect, initialPosition, location}: MapProps){

    function MapCenterUpdater({
        latitude,
        longitude,
    }: {
        latitude: number;
        longitude: number;
    }) {
        const map = useMap();

        useEffect(() => {
            if(latitude && longitude){
                map.setView([latitude, longitude], map.getZoom());

            }
        }, [latitude, longitude, map]);

        return null;
    }

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

    const [defaultPosition, setDefaultPosition] = useState<LatLng | null>(null);

    

    
    // const [location, setLocation] = useState<LatLng | null>(null);

    //const [location, setLocation] = useState<LatLng | null>(null);
    const handleLocationSelection = (location: LatLng) => {   
        console.log('2 - MapComponent:', location);     
        onMapLocationSelect(location);
        //setLocation(location)
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

                <MapCenterUpdater 
                    latitude={location?.lat as number}
                    longitude={location?.lng as number}
                />

                {location && (
                    <Marker position={location} />
                )}

            </MapContainer>
        </Paper>
    );
}