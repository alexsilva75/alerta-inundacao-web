import type { User } from '../interfaces/Usuario';
import {api} from './api';

interface LoginResponse{
    token: string;
    user: User;
    expiresAt: string;

}

export const authService ={ 
    login(email: string, password: string): Promise<LoginResponse>{
        return api('login', {
            body: JSON.stringify({email,
            password}),
            method: 'POST',
            auth: false,
        });
    }
}