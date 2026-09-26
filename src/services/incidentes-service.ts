import type { FetchIncidenteDto } from '../dto/FetchIncidenteDto';
import {api} from './api'

export async function saveIncidente(formData: FormData){
    try{

        return await  api('incidentes', {
            method:'POST',
            body: formData,
            auth: true,
            
        })

            
    }catch(error){
        console.log('ERRO SALVANDO INCIDENTE: ', error);
        throw new Error("Erro ao salvar incidente");
    }

    
}

export async function fetchIncidentesByUser(userId: number): Promise<FetchIncidenteDto[]>{
    try{
        return  await api(`incidentes/user/${userId}`, {
            method:'GET',
            auth: true,});        

    }catch(error){
        console.log('ERRO AO BUSCAR INCIDENTES DO USUARIO: ', error);
        throw new Error('Falha ao buscar incidentes do usuário')
        
    }
}