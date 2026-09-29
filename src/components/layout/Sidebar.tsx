import {useState} from 'react';
import {
    Dashboard as DashBoardIcon,    
    Warning as WarningIcon,
    ExpandLess,
    ExpandMore,
    Add as AddIcon,
    List as ListIcon,
    Home as HomeIcon,
} from '@mui/icons-material';

import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Collapse,
    

} from '@mui/material';

import {useNavigate} from 'react-router';

export function Sidebar(){
    const navigate = useNavigate();
    const [incidentesOpen, setIncidentesOpen] = useState(false);


    return (
        <Box
            component="aside"
            sx={{
                width: 240,
                flexShrink: 0,
                minHeight: '100vh',
                borderRight: 1,
                borderColor: 'divider',
            }}
        >
            <Box sx={{p: 2}}>
                <Typography variant="h6">
                    Alerta Inundação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Sistema de Registro de Alertas Climáticos
                </Typography>
            </Box>

            <Divider />

            <List component="nav">
                <ListItemButton onClick={() => navigate('/')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>

                    <ListItemText primary="Ir para Home" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dashboard')}>
                    <ListItemIcon>
                        <DashBoardIcon />
                    </ListItemIcon>

                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton 
                    onClick={() => setIncidentesOpen((open) => !open)}
                >
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>

                    <ListItemText primary="Alertas" />

                    {incidentesOpen? <ExpandLess /> : <ExpandMore /> }
                </ListItemButton>
                <Collapse
                    in={incidentesOpen}
                    timeout="auto"
                    unmountOnExit
                >
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{pl: 4}}
                            onClick={() => navigate('/incidentes/registrar')}
                        >
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>

                            <ListItemText primary="Registrar novo Incidente"/>
                        </ListItemButton>
                        <ListItemButton
                            sx={{pl: 4}}
                            onClick={() => navigate('/incidentes')}
                        >
                            <ListItemIcon>
                                <ListIcon />
                            </ListItemIcon>

                            <ListItemText primary="Meus Incidentes"/>
                        </ListItemButton>


                        
                    </List>
                </Collapse>
                {/* <ListItemButton>
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Buscar incidentes" />
                </ListItemButton> */}
            </List>

        </Box>
    );
}



