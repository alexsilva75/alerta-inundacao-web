import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material"
import type { FetchIncidenteDto as Incidente } from "../../dto/FetchIncidenteDto"
import { tempoRelativo } from "../../utils/dateFormat"
import { getNivelColor } from "../../utils/ui"
import { IncidentDetailsDialog } from "./IncidentDetailsDialog"
import { useState } from "react"

interface IncidentCardProps{
    incidente: Incidente;
    onViewDetails: (incidente: Incidente) => void;
    onEdit: (incidente: Incidente) => void;
}

export function IncidentCard({incidente, onViewDetails, onEdit}: IncidentCardProps){
    

    return (
        <Card
            
            variant="outlined"            
            sx={{
                cursor: "pointer",
                transition: "0.2s",

                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                },
            }}
        >

            <CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Stack                                             
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1
                        }}
                        
                    >

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                {incidente.titulo}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {incidente.bairro}
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>                                            
                            <Chip
                                label={incidente.nivel_severidade}
                                color={
                                    getNivelColor(
                                        incidente.nivel_severidade
                                    ) as
                                        | "error"
                                        | "warning"
                                        | "success"
                                        | "default"
                                }
                                size="small"
                            />

                            {incidente.ativo ? 
                                <Chip
                                    label="Ativo"
                                    color="error"
                                    size="small"
                                />
                                : 
                                <Chip
                                    label="Inativo"
                                    color="default"
                                    size="small"
                                />}
                            </Grid>
                    </Stack>
                    <Box>
                        <Button onClick={() => onViewDetails(incidente)} sx={{mr: 2}} variant="outlined">Detalhes</Button>
                        <Button onClick={() => onEdit(incidente)}  variant="contained">Editar</Button>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ mt: 1.5 }}
                >
                    {incidente.descricao}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mt: 1.5,
                    }}
                >
                    Atualizado {tempoRelativo(incidente.created_at)}
                </Typography>

            </CardContent>

        </Card>
    )
}