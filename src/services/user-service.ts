import type { User } from '../interfaces/Usuario';
import {api} from './api';
import type { UserRegisterDto } from '../dto/UserRegisterDto';
import {ApiError} from '../services/api';


interface RegisterResponse{
    message: string;
    data: User;
}

export const userService ={
    register: async (userData: UserRegisterDto): Promise<User> => {
        try{

                const response = await api<RegisterResponse>('register',
                        {
                            auth: false,
                            method: 'POST',
                            body: JSON.stringify(userData),
                            
                        });              
                
                return response.data;

            }catch(error){
                throw new Error('Falha ao registrar usuário');
            }
            
        }
}

        

