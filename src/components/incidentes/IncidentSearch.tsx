import { useState } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { fetchCidadesPorUF, fetchMunicipios } from '../../services/ibge-service';
import type { Municipio } from "../../services/ibge-service";
import {ufs} from '../../utils/ufs';

type IncidentSearchProps = {
    onSearch: (uf: string, cidade: string, searchAtivo: boolean, coords: {lat: number, lng: number} | null) => void;
};

export function IncidentSearch({ onSearch }: IncidentSearchProps) {

    const [expanded, setExpanded] = useState(false);
    const [coords, setCoords] = useState< {lat: number, lng: number}|null>(null);

    const [uf, setUf] = useState("");
    const[cidades, setCidades] = useState<string[] | []>([]);
    const [cidade, setCidade] = useState<string | null>("");
    const [searchAtivo, setSearchAtivo] = useState(true);
    const [municipios, setMunicipios] = useState<Municipio[] | []>([]);
    const [municipio, setMunicipio] = useState<Municipio | null>(null)

    function handleSearch() {
        if (!uf || !cidade) {
            return;
        }

        onSearch(uf, cidade, searchAtivo, coords);
    }

    const handleUFChange = (event: SelectChangeEvent) => {
            const selectedUf = event.target.value;
            setUf(selectedUf);
            const municipios = fetchMunicipios(selectedUf);
            setMunicipios(municipios);
        }

    return (
        <Accordion
            expanded={expanded}
            onChange={(_, isExpanded) => setExpanded(isExpanded)}
            disableGutters
            elevation={0}
            sx={{
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,

                "&:before": {
                    display: "none",
                },

                "&.Mui-expanded": {
                    margin: 0,
                    mb: 3,
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    minHeight: 52,

                    "&.Mui-expanded": {
                        minHeight: 52,
                    },

                    "& .MuiAccordionSummary-content": {
                        my: 1,
                    },
                }}
            >
                <Stack
                    sx={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: 1, 
                        alignItems: 'center'}}                    
                    spacing={1}
                    
                >
                    <SearchIcon color="primary" />

                    <Box>
                        <Typography sx={{fontWeight:600}}>
                            Pesquisar outra região
                        </Typography>

                        {!expanded && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Consulte incidentes por estado e município.
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </AccordionSummary>

            <AccordionDetails>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {xs: 'stretch', sm: 'center'},
                        gap: 2,
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

                            setCoords({
                                lat: municipio.latitude,
                                lng: municipio.longitude,
                            });
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
                        onClick={handleSearch}
                        disabled={!uf || !cidade}
                    >
                        Pesquisar
                    </Button>

                </Stack>
                <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <FormControlLabel
                    sx={{mt: 2}}
                    control={
                        <Checkbox 
                            
                            checked={searchAtivo} 
                            onChange={() => setSearchAtivo((ativo) => !ativo)} 
                            name="ativo" 
                            color="primary"
                            />
                        }
                        label="Buscar incidentes ativos"
                    />
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}
