import {BrowserRouter, Route, Routes} from 'react-router';
import {Home} from '../pages/Home';
import { Login } from '../pages/login/Login';
import { Dashboard } from '../pages/protected/dashboard/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Register } from '../pages/Register';


export function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<AuthLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />              
                    </Route>
                </Route>                
            </Routes>
        </BrowserRouter>

    )
}