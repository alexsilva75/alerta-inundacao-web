import {useEffect, useState, useReducer} from 'react';
import {useNavigate} from 'react-router';

import {
    Card,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
} from '@mui/material';


import {useAuth} from '../contexts/AuthContext';
import { ApiError } from '../services/api';
import { userService } from '../services/user-service';

interface FormDataStateValiationCriteria{
    value: string,
    touched: boolean,
    valid: boolean
}
interface FormDataState{
    name: FormDataStateValiationCriteria;
    email: FormDataStateValiationCriteria;
    password: FormDataStateValiationCriteria;
    password_confirmation: FormDataStateValiationCriteria;
}

interface FormAction{
    type: 'nameChange' | 'emailChange' | 'passwordChange' | 'passwordConfirmationChange';
    payload: {fieldName: string, value: string};
}

//{type: string, payload: {fieldName: string, value: string}}

function formReducer(state: FormDataState, action: FormAction){
    switch(action.type){
        case 'nameChange':
            const nextName = action.payload.value;
            return {
                ...state,
                name: {value: action.payload.value, touched: true, valid: nextName.length > 2}
            }
        case 'emailChange':
            const nextEmail = action.payload.value;
            return {
                ...state,
                email: {value: action.payload.value, touched: true, valid: !!nextEmail}
            }
        case 'passwordChange':
            const nextPassword = action.payload.value;
            return {
                ...state,
                password: {value: action.payload.value, touched: true, valid: nextPassword.length >= 8}
            }
        case 'passwordConfirmationChange':
            const nextPasswordConfirmation = action.payload.value;
            const currentPassword = state.password.value;
            return {
                ...state,
                password_confirmation: {value: action.payload.value, touched: true, valid: (nextPasswordConfirmation === currentPassword)}
            }
        default:
            return state;
    }


}

export function Register(){
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, dispatch] = useReducer(formReducer, {
        name: {value: '', valid: false, touched: false},
        email: {value: '', valid: false, touched: false},
        password: {value: '', valid: false, touched: false},
        password_confirmation: {value: '', valid: false, touched: false}
    });

    const navigate = useNavigate();
    
    async function handleRegister(){
        console.log('FORM STATE: ', formState);
        setIsSubmitting(true);
        setError(null);

        try{

            const user = await userService.register({
                name: formState.name.value,
                email: formState.email.value,
                password: formState.password.value,
                password_confirmation: formState.password_confirmation.value
            });
            
            if(user){
                console.log('REGISTERED USER: ', user);
                navigate('/login');
            }
        }catch(errors){
            console.error('Error registering user', errors);
            setError('Falha ao registrar usuário');
        }finally{
            setIsSubmitting(false);
        }
        
    //    if(response.status === 201){
    //         console.log('User registered successfully');
    //     }else{
    //         console.error('Failed to register user', response.data);
    //         setError(response.data.message);
    //     }



    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-around'
            }}
        >
            <Card
                sx={{
                    paddingX: 4,
                    paddingY: 2,
                    mt: 4,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        py: 2,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    Alerta Inundação
                </Typography>
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}

                <TextField
                    label="Nome"
                    type="text"
                    fullWidth
                    name="name"
                    value={formState.name.value}
                    required
                    error={formState.name.touched && !formState.name.valid}
                    sx={{marginBottom: 2}}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({
                                                type: 'nameChange', 
                                                payload: {
                                                            fieldName: event.target.name,
                                                            value: event.target.value}})}
                >
                </TextField>
                <TextField
                    label="Email"
                    type="text"
                    fullWidth
                    name="email"
                    value={formState.email.value}
                    required
                    error={formState.email.touched && !formState.email.valid}
                    sx={{marginBottom: 2}}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({
                                                type: 'emailChange', 
                                                payload: {
                                                            fieldName: event.target.name,
                                                            value: event.target.value}})}
                >
                </TextField>
                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    name="password"
                    value={formState.password.value}
                    required
                    error={formState.password.touched && !formState.password.valid}
                    sx={{marginBottom: 2}}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({
                                                type: 'passwordChange', 
                                                payload: {
                                                            fieldName: event.target.name,
                                                            value: event.target.value}})}
                >
                </TextField>
                <TextField
                    label="Confirmação de Senha"
                    type="password"
                    fullWidth
                    name="password_confirmation"
                    value={formState.password_confirmation.value}
                    required
                    error={formState.password_confirmation.touched && !formState.password_confirmation.valid}
                    sx={{marginBottom: 2}}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({
                                                type: 'passwordConfirmationChange', 
                                                payload: {
                                                            fieldName: event.target.name,
                                                            value: event.target.value}})}
                >
                </TextField>
                <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 2,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    onClick={handleRegister}
                                >
                                    {isSubmitting
                                        ? "Enviando..."
                                        : "Registrar"}
                                </Button>
                            </Box>
            </Card>
        </Box>
    );
}

