import {Navigate, Outlet} from 'react-router';
import { useAuth } from '../contexts/AuthContext';


export function ProtectedRoute(){
    const {isAuthenticated} = useAuth();

    console.log('isAuthenticated: ', isAuthenticated);
    if(!isAuthenticated){
        return <Navigate to="/login" replace={true}/>

    }

    return <Outlet />
}