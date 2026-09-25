import {api} from './api';

export interface GeocodingResponse{
    city: string;
    principalSubdivision: string;
    principalSubdivisionCode: string;
}
export async function reverseGeocoding(userLat: Number, userLng: Number): Promise<GeocodingResponse>{
        try{
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLat}&longitude=${userLng}&localityLanguage=pt`;
            console.log('GEOCODING URL: ', url);
            const response = await fetch(url);
            const data = await response.json();
            
                console.log("Localização do usuário:", data.city, data.principalSubdivision, data.principalSubdivisionCode);
                //document.querySelector('#city').innerHTML = data.city;
                //buildMap(userLat, userLng);
                //loadIncidents(data.city, ufMapping[data.principalSubdivisionCode]);
                return data;
            }catch(error) {
                console.error("Erro ao obter localização do usuário:", error);
                throw new Error("Erro ao obter localização do usuário.");
            }
        }