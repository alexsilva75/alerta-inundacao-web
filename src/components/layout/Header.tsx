import {
    AccountCircle,
    Logout,
} from '@mui/icons-material';

import {
    AppBar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@mui/material';

import {useState} from 'react';
import {useNavigate} from 'react-router';
import {useAuth} from '../../contexts/AuthContext';

export function Header(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () =>{
        handleMenuClose();
        logout();
        navigate('/login')
    };

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between'}}>
                <Typography variant="h6">
                    Sistema de Alertas Climáticos
                </Typography>

                <Box>
                    <IconButton
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem disabled>
                            {user?.email}
                        </MenuItem>

                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1}} />
                            Sair
                        </MenuItem>

                    </Menu>
                </Box>
            </Toolbar>

        </AppBar>
    );


}
