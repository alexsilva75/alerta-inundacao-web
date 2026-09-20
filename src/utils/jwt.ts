export function isTokenExpired(token: string){
    const storedToken = localStorage.getItem('token');

    if(storedToken !== token){
        return true;
    }

    const expiration = localStorage.getItem('expiresAt');

    if(expiration){
        return Number(expiration) <= Date.now();
    }

    return true;

}

export function getTokenExpirationTime(token: string | null | undefined){
    const storedToken = localStorage.getItem('token');

    // console.log('getTokenExpirationTime storedToken: ', storedToken);
    // console.log('getTokenExpirationTime token: ', token);

    if(!storedToken || !token){
        return null;
    }

    if(storedToken !== token){
        return null;
    }

    const expiration = localStorage.getItem('expiresAt');
    return expiration ? Number(expiration) : null;
}