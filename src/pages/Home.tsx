import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
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

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Paper,
    Stack,
    Typography,
    CircularProgress,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UpdateIcon from "@mui/icons-material/Update";

//import type {LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {useNavigate, useSearchParams} from 'react-router';

import {useAuth} from '../contexts/AuthContext'
import { reverseGeocoding } from "../services/geocoding-service";
import { useEffect, useState, type Key } from "react";
import { fetchHomeData, homeSearch } from "../services/home-service";
import type { Stats } from "../services/home-service";
//import type { GeocodingResponse } from "../services/geocoding-service";
import {formatDate, tempoRelativo} from '../utils/dateFormat';
import { IncidentSearch } from "../components/incidentes/IncidentSearch";


const getNivelColor = (nivel: string) => {
    switch (nivel) {
        case "Alto":
            return "error";

        case "Moderado":
            return "warning";

        case "Baixo":
            return "success";

        default:
            return "default";
    }
};

import type { FetchIncidenteDto as Incidente } from "../dto/FetchIncidenteDto";
import { IncidentDetailsDialog } from "../components/incidentes/IncidentDetailsDialog";
import { fetchMunicipio, type Municipio } from '../services/ibge-service';
import { SelectCidadeDialog } from '../components/home/SelectCidadeDialog';



export function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramUf = searchParams.get('uf') ?? '';
    const paramCidade = searchParams.get('cidade') ?? '';
    const paramAtivo = searchParams.get('ativo') ?? '';

    

    const defaultCoords = {lat: -14.2350, lng: -51.9253};
    const brazilCoords = {lat:-14.2350, lng: -51.9253 };
    const defaultZoom = 4;
    const {user} = useAuth();
    const [coords, setCoords] = useState<{lat: Number, lng: Number}>(defaultCoords);
    const [cidade, setCidade] = useState<string | null>(null);
    const [uf, setUf] = useState<string | null>(null);
    const [incidentes, setIncidentes] = useState<Incidente[] | []>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [municipio, setMunicipio] = useState<Municipio | null | undefined>(null);
    const [showDefaultMap, setShowDefaultMap] = useState(false);
    const [openRegionSelectDialog, setOpenRegionSelectDialog] = useState(false);
    const [mapZoom, setMapZoom] = useState(defaultZoom);

    console.log('openRegionSelectDialog', openRegionSelectDialog);

    function MapCenterUpdater({
        latitude,
        longitude,
    }: {
        latitude: number;
        longitude: number;
    }) {
        const map = useMap();

        useEffect(() => {
            
            map.setView([latitude, longitude], mapZoom);
        }, [latitude, longitude, map]);

        return null;
    }


    const handleIncidentClick = (incidente: Incidente) => {        
        setOpenDetailsDialog(true);
        setSelectedIncidente(incidente)
    };

    const handleSearch = async (uf: string, cidade:string, ativo:boolean, coords: {lat: number, lng: number} | null) =>{
        setLoading(true);
        setSearchError(null);
        //console.log('COORDS: ', coords);

        setSearchParams({
            uf,
            cidade,
            ativo: ativo ? 'true' : 'false'
        });

        try{
            const homeData = await homeSearch(cidade, uf, ativo);
            setIncidentes(homeData.data.incidentes);
            setStats(homeData.data.stats);  
            if(coords){                
                setCoords(coords);   
                setMapZoom(13);
            }
            setLoading(false); 
        }catch(error){
            setSearchError('Houve um erro ao buscar incidentes.');
        }finally{
            setLoading(false);
        }
    }

    const handleRegionSelect = (uf: string, cidade: string) => {
        const fetchedMunicipio = fetchMunicipio(uf, cidade);
        setMunicipio(fetchedMunicipio);
        

        if(fetchedMunicipio){
            handleSearch(uf, cidade, true,{lat: fetchedMunicipio.latitude, lng: fetchedMunicipio.longitude});
            setCoords({lat: fetchedMunicipio.latitude, lng: fetchedMunicipio.longitude});
            setMapZoom(13);
            setShowDefaultMap(false); 
        }
    }


    const handleRegionSelectDialogClose = () =>{
        if(!municipio){
            setShowDefaultMap(true);            
        }
        setOpenRegionSelectDialog(false);
    }


    const navigate = useNavigate();

    useEffect(()=> {
        if(showDefaultMap){
            setOpenRegionSelectDialog(true);
            setCoords(brazilCoords);
            setMapZoom(4);
            return
        }
       
    }, [showDefaultMap]);

    useEffect(() => {       
        if(!paramUf && !paramCidade){
            if("geolocation" in navigator) {
                
                navigator.geolocation.getCurrentPosition(function(position) {
                    
                    setCoords({lat: position.coords.latitude,
                                lng: position.coords.longitude});             
                    setMapZoom(13);
                    
                }, function(err){
                    console.log(err)
                    if(err.code == 2){                    
                        
                        setShowDefaultMap(true);
                        setOpenRegionSelectDialog(true);
                    }

                    if(err.code == 1){                    
                        // Usuário não permitiu localização
                        if(!paramUf && !paramCidade && !paramAtivo){
                            setShowDefaultMap(true);
                            setOpenRegionSelectDialog(true);
                        }
                    }
                }, {});        
            }else{
                setShowDefaultMap(true);
                setOpenRegionSelectDialog(true);
            }
        }
    },[]);
    

    useEffect(() => {

        async function resolveGeocoding(lat: Number, lng: Number){
            const geocoding = await reverseGeocoding(lat, lng);
            setUf(geocoding.principalSubdivisionCode.split('-')[1]);
            setCidade(geocoding.city);
        }
        
        if(coords){
            //console.log('USER COORDINATES: ', coords);
            resolveGeocoding(coords.lat, coords.lng);            
        }else{
            setShowDefaultMap(true);
            setOpenRegionSelectDialog(true);
        }
    },[coords]);


    useEffect(() => {
        async function loadHomeData(cidade: string, uf: string){
            const homeData = await fetchHomeData(cidade, uf);
            setIncidentes(homeData.data.incidentes);
            setStats(homeData.data.stats);     
            setLoading(false);       
        }

        if(paramUf && paramCidade){
            // const ativo = paramAtivo === 'true' ? true : false;
            // handleSearch(paramUf, paramCidade, ativo, coords as {lat: number, lng: number});
            return;
        }

        if(cidade && uf){            
            loadHomeData(cidade, uf);
        }
       
    },[cidade, uf, paramUf, paramCidade, municipio]);

    useEffect(()=>{
        // console.log('Param Ativo: ', paramAtivo);
        // console.log('Param UF: ', paramUf);
        // console.log('Param Cidade: ', paramCidade);

        if(paramUf && paramCidade && paramAtivo){
            setUf(paramUf);
            setCidade(paramCidade);
            
            
            const mun = fetchMunicipio(paramUf, paramCidade);

            if(mun){
                setMunicipio(mun);
                setCoords({ lat: mun.latitude, lng: mun.longitude });
                const searchAtivo = paramAtivo === 'true' ? true : false;
                handleSearch(paramUf, paramCidade, searchAtivo, {lat: mun.latitude, lng: mun.longitude});
            }
        }
    },[paramUf, paramCidade,paramAtivo ]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* Cabeçalho */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center'}}>
                <Box sx={{flexGrow: 1}}>

                    <Typography 
                    variant="h4"
                    sx={{
                        fontWeight: 700
                    }}
                    >
                        Alertas de Inundação
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                        >
                        Acompanhe os pontos de inundação próximos à sua região.
                    </Typography>
                </Box>
                <Box sx={{pr: 2}}>
                    {user? (<Box>
                        <Typography>
                            Olá, {user.name}!

                        </Typography>
                        <Button
                            onClick={()=> navigate('/dashboard')}
                            sx={{ml: 2}}>
                            Dashboard
                        </Button>
                    </Box>):(
                        <Box>
                        <Button 
                        onClick={() => navigate('/login')}
                        variant="contained">
                        Entrar
                    </Button>
                    <Button
                        sx={{ml:2}}
                        variant="text"
                        onClick={() => navigate('/register')}
                    >
                        Registrar
                    </Button>
                    </Box>
                    )}
                </Box>
            </Box>
            {searchError && <Alert severity="error">{searchError}</Alert>}
            {loading && <CircularProgress color="primary" />} {/* Loading spinner */}

            <IncidentSearch 
                onSearch={handleSearch}            
            />

            {/* Resumo */}
            <Grid container spacing={2} sx={{ mb: 3 }}>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent>
                            <Stack                                
                                sx={{
                                    display: 'flex', 
                                    flexDirection: 'row', 
                                    justifyContent: 'center'
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Incidentes na Região
                                    </Typography>

                                    {loading ? <CircularProgress /> :<Typography 
                                        variant="h4" 
                                        sx={{
                                                fontWeight: 700
                                            }}>
                                        {stats && stats.total_incidentes?.toString()}
                                    </Typography>}
                                </Box>

                                <LocationOnIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent>
                            <Stack
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Alertas ativos
                                    </Typography>

                                    {loading? <CircularProgress /> :
                                    <Typography
                                        variant="h4"
                                        sx={{
                                                fontWeight: 700
                                            }}
                                    >
                                        {stats && stats.incidentes_ativos?.toString()}
                                    </Typography>}
                                </Box>

                                <WarningAmberIcon
                                    color="error"
                                    sx={{ fontSize: 40 }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent>
                            <Stack
                                
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Último incidente
                                    </Typography>

                                    {loading ? <CircularProgress /> :<Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700
                                        }}
                                    >
                                        {stats && formatDate(stats.ultimo_incidente)}
                                    </Typography>}
                                </Box>

                                <UpdateIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Mapa + Lista */}
            <Grid container spacing={3}>

                {/* MAPA */}
                <Grid size={{ xs: 12, lg: 8 }}>

                    <Paper
                        elevation={2}
                        sx={{
                            overflow: "hidden",
                            height: { xs: 450, lg: 650 },
                            borderRadius: 2,
                        }}
                    >
                        <MapContainer
                            center={[coords.lat, coords.lng] as [number, number] }

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

                            <MapCenterUpdater
                                latitude={coords.lat as number}
                                longitude={coords.lng as number}
                            />

                            {incidentes.length > 0 ? (incidentes.map((ponto) => (
                                <Marker
                                    key={ponto.id as Key}
                                    position={[ponto.latitude, ponto.longitude] as [number, number]}
                                >
                                    <Popup>
                                        <strong>{ponto.titulo}</strong>
                                        <br />
                                        Nível: {ponto.nivel_severidade}
                                    </Popup>
                                </Marker>
                            ))) : (<div>Loading...</div>)}

                        </MapContainer>
                    </Paper>

                </Grid>

                {/* LISTA */}
                <Grid size={{ xs: 12, lg: 4 }}>

                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            height: { xs: "auto", lg: 650 },
                            overflow: "auto",
                            borderRadius: 2,
                        }}
                    >

                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                Pontos próximos
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Ocorrências registradas na região
                            </Typography>
                        </Box>

                        <Stack spacing={2}>

                            {!loading ? incidentes.map((ponto) => (
                                <Card
                                    key={ponto.id as Key}
                                    variant="outlined"
                                    onClick={() => handleIncidentClick(ponto)}
                                    sx={{
                                        cursor: "pointer",
                                        transition: "0.2s",

                                        "&:hover": {
                                            boxShadow: 3,
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >

                                    <CardContent>

                                        <Stack                                             
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: 1
                                            }}
                                            
                                        >

                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {ponto.titulo}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {ponto.bairro}
                                                </Typography>
                                            </Box>

                                            <Grid container spacing={2}>                                            
                                                <Chip
                                                    label={ponto.nivel_severidade}
                                                    color={
                                                        getNivelColor(
                                                            ponto.nivel_severidade
                                                        ) as
                                                            | "error"
                                                            | "warning"
                                                            | "success"
                                                            | "default"
                                                    }
                                                    size="small"
                                                />

                                                {ponto.ativo ? 
                                                    <Chip
                                                        label="Ativo"
                                                        color="error"
                                                        size="small"
                                                    />
                                                    : 
                                                    <Chip
                                                        label="Inativo"
                                                        color="default"
                                                        size="small"
                                                    />}
                                                </Grid>
                                        </Stack>

                                        <Typography
                                            variant="body2"
                                            sx={{ mt: 1.5 }}
                                        >
                                            {ponto.descricao}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: "block",
                                                mt: 1.5,
                                            }}
                                        >
                                            Atualizado {tempoRelativo(ponto.created_at)}
                                        </Typography>

                                    </CardContent>

                                </Card>
                            )) : <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <CircularProgress />
                                </Box>}
                            {!loading && incidentes.length === 0 && <Box>
                                    <p>Nenhum ponto de incidente encontrado.</p>
                                </Box>}
                        </Stack>

                    </Paper>

                </Grid>

            </Grid>
            {openDetailsDialog && selectedIncidente && (
                <IncidentDetailsDialog
                    open={openDetailsDialog}
                    onClose={() => setOpenDetailsDialog(false)}
                    incidente={selectedIncidente}
                />
            )}

            {openRegionSelectDialog && (
                <SelectCidadeDialog
                    onSelectRegiao={handleRegionSelect}
                    open={openRegionSelectDialog}
                    onClose={handleRegionSelectDialogClose}
                >

                </SelectCidadeDialog>
            )}

        </Box>
    );
}