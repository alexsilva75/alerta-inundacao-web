const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions{
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: {[key: string]: string};
    body?: BodyInit | object;
    auth?: boolean;
}

export class ApiError extends Error {
    status: Number;
    constructor(status: Number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const api = async <T>(endpoint: string, options: FetchOptions = {auth: true}) =>{
    const headers = new Headers(options.headers || {});
    if(options.auth){
        const token = localStorage.getItem('token');
        if(token) {
            headers.append('Authorization', `Bearer ${token.split('|')[1]}`);
        }
    }

    let body = undefined;

    if(options.body && !(options.body instanceof FormData)){
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(options.body);
    }else{
        body = options.body;

    }

    headers.set('Accept', 'application/json');

    // console.log('Request Body: ', options.body);    

    try {   
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: options.method || 'GET', 
            headers: headers, 
            body: body
        });     
        
        if(!response.ok){
            let message = 'Houve um erro de comunicacao com o servidor.'
            if(response.status){
                if(response.status === 401 || response.status === 403){
                    window.dispatchEvent(new Event('auth:logout'));
                }
                if(response.status === 400){
                    message = 'Verifique os dados enviados.'
                }else if(response.status === 404){
                    message = 'O recurso solicitado não foi encontrado.'
                }else if(response.status === 500){
                    message = 'O servidor está com problemas.'
                }else{

                }
                throw new ApiError(response.status, message);
            }

            try{
                const errors = await response.json();

                if(typeof errors.message === 'string'){
                    message = errors.message;
                }else if(typeof errors === 'object'){
                    message = JSON.stringify(errors);
                }else if(Array.isArray(errors)){
                    message = errors.join('\n');

                }
                
            }catch(error){
                throw new Error(message);

            }

            throw new ApiError(response.status, message);
        }
        if(response.status === 204){
            return undefined as T;
        }
        return await response.json() as Promise<T>;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    } 
}
