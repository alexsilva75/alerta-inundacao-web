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