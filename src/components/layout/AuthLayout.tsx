import {Box} from '@mui/material';
import {Outlet} from 'react-router';
import {Sidebar} from './Sidebar';
import {Header} from './Header';

export function AuthLayout(){
    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            <Sidebar />

            <Box sx={{flexGrow: 1}}>
                <Header />
                <Box component="main" sx={{p: 3}}>
                    <Outlet />
                </Box>
            </Box>
        </Box>

    )
}