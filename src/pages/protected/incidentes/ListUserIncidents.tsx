import { useEffect, useState, type Key } from "react"
import { fetchIncidentesByUser } from "../../../services/incidentes-service";
import { useAuth } from "../../../contexts/AuthContext";
import type { FetchIncidenteDto as Incidente} from "../../../dto/FetchIncidenteDto";
import { IncidentCard } from "../../../components/incidentes/IncidenteCard";
import { Box, CircularProgress, Typography } from "@mui/material";
import { IncidentDetailsDialog } from "../../../components/incidentes/IncidentDetailsDialog";
export function ListUserIncidents(){
    const [incidentes, setIncidentes] = useState<Incidente[] | []>([])
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(null);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const handleViewDetails = (incidente: Incidente) => {
        setOpenDetailsDialog(true);
        setSelectedIncidente(incidente);
    }

    useEffect(()=>{
        async function loadIncidentes(){
            const incidentes = await fetchIncidentesByUser(user?.id as number);
            console.log('INCIDENTES DO USUARIO: ', incidentes);
            setIncidentes(incidentes);
            setLoading(false);
        }

        loadIncidentes();
        
    }, []);

   
    return (
        <div>
            <Typography sx={{mb: 4}}>Listar Incidentes</Typography>
            {loading && <CircularProgress color="primary" size={24}/>}
            {!loading && incidentes.map((incidente) => <Box key={incidente.id as Key}  sx={{mb: 2}}>
                    <IncidentCard 
                     incidente={incidente}
                     onViewDetails={handleViewDetails}
                     onEdit={(incidente) => console.log(incidente)}
                     />
                </Box>)}
            {openDetailsDialog && selectedIncidente && <IncidentDetailsDialog 
                                                            incidente={selectedIncidente} 
                                                            open={openDetailsDialog}
                                                            onClose={() => setOpenDetailsDialog(false)}
                                                            />}
        </div>
    )

}