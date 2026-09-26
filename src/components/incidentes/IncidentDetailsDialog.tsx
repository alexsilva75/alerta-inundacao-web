const ASSETS_URL = import.meta.env.VITE_ASSETS_URL;
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Paper,
    Button,
    Skeleton,
} from '@mui/material';

import {useEffect, useState} from 'react';
import type { FetchIncidenteDto } from '../../dto/FetchIncidenteDto';
import { formatDate } from '../../utils/dateFormat';
import { ReadonlyMap } from '../map/ReadonlyMap';

interface IncidentDetailsDialogProps{
    open: boolean;
    onClose: () => void;
    incidente: FetchIncidenteDto;
}

export function IncidentDetailsDialog({open, onClose, incidente}: IncidentDetailsDialogProps){
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Dialog sx={{width: {xs: '100%'}}} open={open} onClose={onClose}>
            <DialogTitle>Detalhes do Incidente</DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                
                }}>
                <Box
                    sx={{
                        width: "100%",
                        height: 300,
                        overflow: "hidden",
                        borderRadius: 2,
                    }}
                >
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                        />
                    )}

                    <Box
                        component="img"
                        src={`${ASSETS_URL}${incidente.foto_url}`}
                        alt={incidente.titulo}
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: imageLoaded ? "block" : "none",
                        }}
                    />
                </Box>
                <Typography>
                    <Box component="span" sx={{fontWeight: 'bold'}}>Título: </Box> {incidente.titulo}
                </Typography>
                <Typography>
                    <Box component="span" sx={{fontWeight: 'bold'}}>Descrição: </Box> {incidente.descricao}
                </Typography>
                <Typography>
                    <Box component="span" sx={{fontWeight: 'bold'}}>Bairro: </Box> {incidente.bairro}
                </Typography>
                <Typography>
                    <Box component="span" sx={{fontWeight: 'bold'}}>Ocorrido em: </Box> {formatDate(incidente.data_hora)}
                </Typography>
                <Paper
                    elevation={0}
                    sx={{
                        overflow: "hidden",
                        borderRadius: 2,
                        height: 300,
                    }}
                >
                    <ReadonlyMap
                        latitude={incidente.latitude}
                        longitude={incidente.longitude}
                        zoom={16}                    
                    />

                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
