import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

import {
    Card,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";

import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';

export function Login() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();


    const {login, isAuthenticated} = useAuth();

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/dashboard', { replace : true });
        }
    },[isAuthenticated])


    async function handleLogin(event: any) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try{
            const ok = await login(email,password);

            if(ok){
                navigate("/dashboard", { replace : true });
            }

        }catch(errors){
            if(errors instanceof ApiError && errors.status === 401){
                setError("Email ou senha inválidos.");
            }else{
                setError('Não foi possível realizar o login.');
            }

        }finally{
            setIsSubmitting(false);
        }


    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
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
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                Conta Alerta
                            </Typography>

                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                name="email"
                                required
                                sx={{ marginBottom: 2 }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                                    setEmail(event.target.value);
                                }}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>{
                                    if(event.key === 'enter'){
                                        handleLogin(event);
                                    }
                                }}
                            />

                            <TextField
                                label="Senha"
                                type="password"
                                name="password"
                                fullWidth
                                required
                                sx={{ mb: 2 }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                                    setPassword(event.target.value);
                                }}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>{
                                    if(event.key === 'enter'){
                                        handleLogin(event);
                                    }
                                }}
                            />

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
                                    onClick={handleLogin}
                                >
                                    {isSubmitting
                                        ? "Entrando..."
                                        : "Entrar"}
                                </Button>
                            </Box>    

                    </Card>
                </Box>

            </div>
        </div>
    );
}