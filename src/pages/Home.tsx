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
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UpdateIcon from "@mui/icons-material/Update";

import type {LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {useNavigate} from 'react-router';

const pontos = [
    {
        id: 1,
        nome: "Rio Subaé — Centro",
        localizacao: "Centro",
        nivel: "Alto",
        descricao: "Nível da água acima do esperado.",
        atualizado: "Há 8 minutos",
        coordenadas: [-12.548, -39.251] as [number, number],
    },
    {
        id: 2,
        nome: "Ponte do Rio Subaé",
        localizacao: "Zona Rural",
        nivel: "Moderado",
        descricao: "Elevação gradual do nível do rio.",
        atualizado: "Há 15 minutos",
        coordenadas: [-12.558, -39.265] as [number, number],
    },
    {
        id: 3,
        nome: "Bairro da Estação",
        localizacao: "Bairro da Estação",
        nivel: "Baixo",
        descricao: "Acúmulo de água em alguns pontos.",
        atualizado: "Há 22 minutos",
        coordenadas: [-12.543, -39.258] as [number, number],
    },
    {
        id: 4,
        nome: "Estrada da Barragem",
        localizacao: "Zona Rural",
        nivel: "Moderado",
        descricao: "Atenção para transbordamento.",
        atualizado: "Há 31 minutos",
        coordenadas: [-12.570, -39.280] as [number, number],
    },
];

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

export function Home() {
    const navigate = useNavigate();
    
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
                    <Button 
                        onClick={() => navigate('/login')}
                        variant="contained">
                        Entrar
                    </Button>
                </Box>
            </Box>

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
                                        Pontos monitorados
                                    </Typography>

                                    <Typography 
                                        variant="h4" 
                                        sx={{
                                                fontWeight: 700
                                            }}>
                                        12
                                    </Typography>
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

                                    <Typography
                                        variant="h4"
                                        sx={{
                                                fontWeight: 700
                                            }}
                                    >
                                        3
                                    </Typography>
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
                                        Última atualização
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700
                                        }}
                                    >
                                        13:08
                                    </Typography>
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
                            center={[-12.548, -39.258] as LatLngExpression }

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

                            {pontos.map((ponto) => (
                                <Marker
                                    key={ponto.id}
                                    position={ponto.coordenadas}
                                >
                                    <Popup>
                                        <strong>{ponto.nome}</strong>
                                        <br />
                                        Nível: {ponto.nivel}
                                    </Popup>
                                </Marker>
                            ))}

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

                            {pontos.map((ponto) => (
                                <Card
                                    key={ponto.id}
                                    variant="outlined"
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
                                                    {ponto.nome}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {ponto.localizacao}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={ponto.nivel}
                                                color={
                                                    getNivelColor(
                                                        ponto.nivel
                                                    ) as
                                                        | "error"
                                                        | "warning"
                                                        | "success"
                                                        | "default"
                                                }
                                                size="small"
                                            />

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
                                            Atualizado {ponto.atualizado}
                                        </Typography>

                                    </CardContent>

                                </Card>
                            ))}

                        </Stack>

                    </Paper>

                </Grid>

            </Grid>

        </Box>
    );
}