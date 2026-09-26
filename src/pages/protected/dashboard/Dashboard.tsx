import {
    Box,
    Typography,
} from '@mui/material'
export function Dashboard(){
    return (
        <Box>
            <Typography variant='h5'>Área do Usuário</Typography>
            <Typography component="p">
                Aqui é possível pesquisar, criar ou editar os seus incidentes cadastrados.
            </Typography>
        </Box>
    );

}