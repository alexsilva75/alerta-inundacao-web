export interface FetchIncidenteDto{
    id: Number,
    titulo : string,
    descrição : string,
    data_hora : string,
    bairro : string,
    cidade : string,
    uf : string,
    latitude : Number,
    longitude : Number,
    nivel_severidade: string,
}