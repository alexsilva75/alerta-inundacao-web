export interface FetchIncidenteDto{
    id: Number,
    titulo : string,
    descricao : string,
    data_hora : string,
    bairro : string,
    cidade : string,
    uf : string,
    latitude : Number,
    longitude : Number,
    nivel_severidade: string,
    created_at: string,
}