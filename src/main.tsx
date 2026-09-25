import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
} from '@mui/x-date-pickers/LocalizationProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocalizationProvider>
  </StrictMode>,
)
