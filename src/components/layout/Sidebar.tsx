import {useState} from 'react';
import {
    Dashboard as DashBoardIcon,
    Assignment as AssignmentIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Extension as ExtensionIcon,
    Assessment as AssessmentIcon,
    ManageAccounts as ManageAccountsIcon,
    Search as SearchIcon,
    Warning as WarningIcon,
    ExpandLess,
    ExpandMore
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
                                <WarningIcon />
                            </ListItemIcon>

                            <ListItemText primary="Registrar novo Incidente"/>
                        </ListItemButton>

                        <ListItemButton>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary="Buscar incidentes" />

                        </ListItemButton>
                    </List>
                </Collapse>
            </List>

        </Box>
    );
}



