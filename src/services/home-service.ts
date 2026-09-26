import type { FetchIncidenteDto } from "../dto/FetchIncidenteDto";
import { api } from "./api";

export interface Stats{
    uf: string,
    cidade: string,
    total_incidentes: Number, 
    incidentes_ativos: Number, 
    ultimo_incidente: string
}

interface IncidentesResponse{
    message: string;
    data: { 
            incidentes: FetchIncidenteDto[], 
            stats: Stats
        };
}

export async function fetchHomeData(cidade: string, uf: string): Promise<IncidentesResponse>{
    const url = `incidentes/home-search?cidade=${cidade}&uf=${uf}`;
    console.log('URL:', url);
    try{
        const response = await api<IncidentesResponse>(url);
        console.log('INCIDENTES: ', response);
        return response;   

    }catch(error){
        console.log('Falha ao buscar incidentes: ', error);
        throw new Error('Não foi possível buscar incidentes.');
    }
}

export async function homeSearch(cidade: string, uf: string, ativo: boolean): Promise<IncidentesResponse>{
    const url = `incidentes/search?cidade=${cidade}&uf=${uf}&ativo=${ativo}`;
    console.log('URL:', url);
    try{
        const response = await api<IncidentesResponse>(url);
        console.log('INCIDENTES: ', response);
        return response;   

    }catch(error){
        console.log('Falha ao buscar incidentes: ', error);
        throw new Error('Não foi possível buscar incidentes.');
    }
}