
export function formatDate(stringDate: string): string {
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');

    let formattedStringDate = new Date(stringDate).toLocaleString();
    formattedStringDate = formattedStringDate.replace(', ', ' às ');
    return formattedStringDate;
}

export function tempoRelativo(data: string): string {
    const agora = Date.now();
    const dataEvento = new Date(data).getTime();

    const diffSegundos = Math.round((dataEvento - agora) / 1000);

    const unidades = [
        { limite: 60, divisor: 1, unidade: 'second' as const },
        { limite: 3600, divisor: 60, unidade: 'minute' as const },
        { limite: 86400, divisor: 3600, unidade: 'hour' as const },
        { limite: Infinity, divisor: 86400, unidade: 'day' as const },
    ];

    const valorAbsoluto = Math.abs(diffSegundos);

    const { divisor, unidade } =
        unidades.find(item => valorAbsoluto < item.limite)!;

    const valor = Math.round(diffSegundos / divisor);

    return new Intl.RelativeTimeFormat('pt-BR', {
        numeric: 'always',
    }).format(valor, unidade);
}