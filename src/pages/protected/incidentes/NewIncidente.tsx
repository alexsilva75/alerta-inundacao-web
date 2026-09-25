import {
    Paper,
    Box,
    TextField,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    Autocomplete,

} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import {useState, useReducer, useEffect} from 'react';
import { LatLng } from 'leaflet';
import { MapComponent } from '../../../components/map/MapComponent';
import { fetchCidadesPorUF } from '../../../services/ibge-service';
import dayjs, {Dayjs} from 'dayjs';
import { saveIncidente } from '../../../services/incidentes-service';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router';

import {
    DateTimePicker,
} from '@mui/x-date-pickers/DateTimePicker';



import {ufs} from '../../../utils/ufs';

type severidade = 'Baixo' | 'Moderado' | 'Alto'
const severidades = ['Baixo', 'Moderado', 'Alto']


interface IncidenteFormData{
    titulo: string,
    descricao: string,
    data_hora: string,
    bairro: string,
    cidade: string,
    uf: string,
    latitude: number,
    longitude: number,
    nivel_severidade: severidade,
}

interface FormAction{
    type: string,
    payload: string,
}


function formReducer(state: IncidenteFormData, action: FormAction){
    switch(action.type){
        case 'titulo':
            return {...state, titulo: action.payload};
        case 'descricao':
            return {...state, descricao: action.payload};
        case 'data_hora':
            return {...state, data_hora: action.payload};
        case 'bairro':
            return {...state, bairro: action.payload};
        case 'cidade':
            return {...state, cidade: action.payload};
        case 'uf':
            return {...state, uf: action.payload};
        case 'latitude':
            return {...state, latitude: parseFloat(action.payload)};
        case 'longitude':
            return {...state, longitude: parseFloat(action.payload)};
        case 'nivel_severidade':
            return {...state, nivel_severidade: action.payload as severidade};
        default:
            throw new Error('Tipo de dado inválido');
    }
}

export function NewIncidente(){

    const [foto, setFoto] = useState<File | null>(null);
    const [cidades, setCidades] = useState<string[]>([]);
    const [cidade, setCidade] = useState<string | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [location, setLocation] = useState<LatLng | null>(null);
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const {user} = useAuth();
    const navigate = useNavigate();

    

    const [formState, dispatch] = useReducer(formReducer, {
        titulo: '',
        descricao: '',
        data_hora: '',
        bairro: '',
        cidade: '',
        uf: '',
        latitude: 0,
        longitude: 0,
        nivel_severidade: 'Baixo',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) =>{
        dispatch({type: event.target.name, payload: event.target.value});
    }

    const handleSelectLocation = (location: LatLng) => {
        setLocation(location);
        dispatch({type: 'latitude', payload: String(location.lat)});
        dispatch({type: 'longitude', payload: String(location.lng)});
    }

    const handleUFChange = async (event: SelectChangeEvent) => {
        const uf = event.target.value;
        dispatch({type: 'uf', payload: uf});
        const cidades = await fetchCidadesPorUF(uf);
        setCidades(cidades);
    }

    async function handleSubmit(){
        const formData = new FormData();

        if(!location || !formState.uf || !cidade){
            return
        }

        formData.append('titulo', formState.titulo);
        formData.append('descricao', formState.descricao);
        formData.append('data_hora', formState.data_hora);
        formData.append('bairro', formState.bairro);
        formData.append('cidade', cidade);
        formData.append('uf', formState.uf);
        formData.append('latitude', String(formState.latitude));
        formData.append('longitude', String(formState.longitude));
        formData.append('nivel_severidade', formState.nivel_severidade);
        formData.append('latidude', String(location.lat));
        formData.append('longitude', String(location.lng));
        formData.append('user_id', String(user?.id));

        if(foto){
            formData.append('foto', foto);
        }


        console.log('SENDING FORM: ', formData.values);
        const response = await saveIncidente(formData);
        console.log('SAVE RESPONSE: ', response);
        navigate('/dashboard');
    }

    const handleFotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;

        setFoto(file);

        if (file) {
            setFotoPreview(URL.createObjectURL(file));
        } else {
            setFotoPreview(null);
        }
    };

    useEffect(()=>{
        setFormIsValid(
            !!(
                formState.titulo 
                && formState.data_hora 
                && formState.bairro
                && cidade
                && formState.uf
                && formState.latitude 
                && formState.longitude  
                && formState.nivel_severidade
            )
        )
    },[formState]);
    

    return (
        <Paper>
            <Box sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2, 
                        alignItems: 'center',
                        px: 2,
                        py: 4,

                    }}>
                <Typography variant="h4">Novo Incidente</Typography>
                <Box>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<PhotoCameraIcon />}
                    >
                        Adicionar foto (Opcional)
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFotoChange}
                        />
                    </Button>

                    {foto && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {foto.name}
                        </Typography>
                    )}
                </Box>
                {fotoPreview && (
                    <Box
                        component="img"
                        src={fotoPreview}
                        alt="Prévia da foto selecionada"
                        sx={{
                            width: '100%',
                            maxHeight: 300,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mt: 2,
                        }}
                    />
                )}
                <TextField 
                    name='titulo' 
                    label="Título" 
                    variant="outlined" 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    fullWidth />
                <TextField 
                    name='descricao' 
                    label="Descrição" 
                    variant="outlined" 
                    multiline 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    rows={4} 
                    fullWidth />
                <DateTimePicker
                    label="Data e hora do incidente"
                    value={
                        formState.data_hora
                            ? dayjs(formState.data_hora)
                            : null
                    }
                    onChange={(value) => {
                        dispatch({
                            type: 'data_hora',
                            payload: value ? value.toISOString() : '',
                        });
                    }}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                        },
                    }}
                />
                                
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">UF</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="uf"
                        value={formState.uf}
                        label="UF"
                        onChange={handleUFChange}
                    >
                        {ufs.map(uf => <MenuItem key={uf} value={uf}>{uf}</MenuItem>)}
                        
                    </Select>
                </FormControl>

                <Autocomplete
                    options={cidades}
                    value={formState.cidade}
                    onChange={(_, novaCidade) => setCidade(novaCidade)}
                    fullWidth
                    renderInput={(params) => 
                    <TextField 
                        {...params}
                        name='cidade' 
                        label="Cidade" 
                        variant="outlined" 
                        fullWidth />}
                        disabled={!formState.uf}
                />
                <TextField 
                    name='bairro' 
                    label="Bairro" 
                    variant="outlined" 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    fullWidth />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Urgência</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="nivel_severidade"
                        value={formState.nivel_severidade}
                        label="Urgência"
                        onChange={handleChange}
                    >
                        {severidades.map(nivel => <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>)}
                        
                    </Select>
                </FormControl>


                <Box sx={{
                    width: '100%'
                }}>
                    <Typography sx={{mb: 2}}>
                        Selecione a localização do incidente no mapa abaixo.
                    </Typography>
                    <MapComponent onMapLocationSelect={(location) => { handleSelectLocation(location) }}/>
                </Box>
                <Box>
                    <Button 
                        onClick={handleSubmit}
                        disabled={!formIsValid}
                        variant="contained">
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}


