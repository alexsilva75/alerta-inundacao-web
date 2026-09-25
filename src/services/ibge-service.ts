

export async function fetchCidadesPorUF(uf: string): Promise<string[] | []> {
    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        
        if (!response.ok) {
            throw new Error('Falha ao buscar cidades');
        }
        
        const cidades = await response.json();
        if(Array.isArray(cidades)){
            return cidades.map((cidade) => cidade.nome);
        }

        return []
    } catch (error) {
        throw new Error("Falha ao buscar cidades");
    }
}

