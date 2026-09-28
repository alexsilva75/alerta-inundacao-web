import {
        Dialog, 
        DialogTitle,
        DialogContent,
        DialogActions,
        Typography,
        Button,
        Autocomplete,
        FormControl,
        Select,
        Stack,
        InputLabel,
        type SelectChangeEvent,
        MenuItem,
        TextField,

    } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { ufs } from '../../utils/ufs';
import { useState } from 'react';
import { fetchMunicipios, type Municipio } from '../../services/ibge-service';

interface SelectCidadeDialogProps{
    onClose: () => void;
    onSelectRegiao: (uf: string, cidade: string) => void;
    open: boolean;
}

export function SelectCidadeDialog({onClose, onSelectRegiao, open}: SelectCidadeDialogProps){
    const [uf, setUf] = useState<string | null>(null);
    const [cidade, setCidade] = useState<string | null>(null);
    const [municipios, setMunicipios] = useState<Municipio[] | []>([]);
    const [municipio, setMunicipio] = useState<Municipio | null>(null);

    const handleUFChange = (event: SelectChangeEvent<string | null>) => {
                
                const selectedUf = event.target.value;
                if(selectedUf){
                    setUf(selectedUf);
                    const municipios = fetchMunicipios(selectedUf);
                    setMunicipios(municipios);
                }
            }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography>
                    Selecione UF e Cidade
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {xs: 'stretch', sm: 'center'},
                        gap: 2,
                        width: {xs: '100%', sm: 500}
                    }}                    
                    spacing={2}                    
                >

                    <FormControl sx={{flex: 1}}>
                        <InputLabel sx={{mt: 2}} id="demo-simple-select-label">UF</InputLabel>
                        <Select
                            sx={{mt: 2}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="uf"
                            value={uf}
                            label="UF"
                            onChange={handleUFChange}
                        >
                            {ufs.map(uf => <MenuItem key={uf} value={uf}>{uf}</MenuItem>)}
                            
                        </Select>
                    </FormControl>                    

                    <Autocomplete
                        options={municipios}
                        value={municipio}
                        getOptionLabel={(option) => option.nome}
                        onChange={(_, municipio) => {
                            if(!municipio){
                                return;
                            }

                            setCidade(municipio.nome);
                            setMunicipio(municipio);
                            onSelectRegiao(uf!, municipio.nome);
                            
                        }}
                        sx={{flex: 1}}
                        renderInput={(params) => 
                        <TextField 
                            {...params}
                            name='cidade' 
                            label="Cidade" 
                            variant="outlined" 
                             />}
                            disabled={!uf}
                    />

                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={onClose}
                        disabled={!uf || !cidade}
                    >
                        Fechar
                    </Button>

                </Stack>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    );
}