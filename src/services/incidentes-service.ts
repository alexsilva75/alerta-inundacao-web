import type { FetchIncidenteDto } from "../dto/FetchIncidenteDto";
import { api } from "./api";

interface IncidentesResponse{
    message: string;
    data: FetchIncidenteDto[];
}

export async function fetchIncidentes(cidade: string, uf: string): Promise<FetchIncidenteDto[]>{
    const url = `incidentes/home-search?cidade=${cidade}&uf=${uf}`;
    console.log('URL:', url);
    try{
        const response = await api<IncidentesResponse>(url);
        console.log('INCIDENTES: ', response);
        return response.data as FetchIncidenteDto[];   

    }catch(error){
        console.log('Falha ao buscar incidentes: ', error);
        throw new Error('Não foi possível buscar incidentes.');
    }
}