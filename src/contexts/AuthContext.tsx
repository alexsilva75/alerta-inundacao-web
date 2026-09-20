import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from 'react';
import type { User } from '../interfaces/Usuario';

import { isTokenExpired, getTokenExpirationTime } from '../utils/jwt';
import { authService } from '../services/auth-service';

interface AuthContextData{
    isAuthenticated: boolean | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    user: User | null;

}

interface AuthProviderProps{
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);


export function AuthProvider({children}: AuthProviderProps){
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null | undefined>(localStorage.getItem('token'));
    

    const logout = useCallback((): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresAt');

        setIsAuthenticated(false);
        setUser(null);
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // console.log('TOKEN: ', storedToken);
        // console.log('USER: ', storedUser);

        if(!storedToken){
            setIsAuthenticated(false);
            return;
        }

        if(isTokenExpired(storedToken)){
            // console.log('LOGGING OUT....');
            logout();
            return;

        }

        setIsAuthenticated(true);
        setToken(storedToken);

        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[isAuthenticated]);

    useEffect(() =>{
        if(!isAuthenticated){
            return;
        }

        const expiration = getTokenExpirationTime(token);

        // console.log('EXPIRATION: ', expiration);

        if(!expiration){
            logout();
            return;
        }

        const timeout = expiration - Date.now();

        // console.log('TIMEOUT: ', timeout);
        if(timeout <= 0){
            logout();
            return;
        }

        const timer = setTimeout(logout, timeout);

        return () => clearTimeout(timer);

    }, [isAuthenticated, token]);


    useEffect(() =>{
        window.addEventListener('auth:logout',logout);

        return () => {
            window.removeEventListener('auth:logout', logout);
        }
    },[]);

    async function login(email: string, password: string): Promise<boolean>{
        const response = await authService.login(email,password);

        // console.log('LOGIN RESPONSE: ', response);
        if(response.token && response.user){
            localStorage.setItem('token',response.token);
            localStorage.setItem('expiresAt',new Date(response.expiresAt).getTime().toString());
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            setToken(response.token);
            setIsAuthenticated(true);
            // console.log('AUTENTICADO!');
            return true;
        }

        //throw new Error('Login failed');
        return false;
        

    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout

            }}
            >
                {children}
        </AuthContext.Provider>
    );

}


export function useAuth(): AuthContextData{
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');

    }

    ///console.log("CONTEXT: ", context);
    return context;
}
