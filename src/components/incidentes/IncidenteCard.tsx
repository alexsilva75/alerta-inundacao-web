
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { FetchIncidenteDto as Incidente } from "../../dto/FetchIncidenteDto";
import { tempoRelativo } from "../../utils/dateFormat";
import { getNivelColor } from "../../utils/ui";

interface IncidentCardProps {
    incidente: Incidente;
    onViewDetails: (incidente: Incidente) => void;
    onEdit: (incidente: Incidente) => void;
}

export function IncidentCard({
    incidente,
    onViewDetails,
    onEdit,
}: IncidentCardProps) {

    const nivelColor = getNivelColor(incidente.nivel_severidade);

    const severityColors = {
        error: "#d32f2f",
        warning: "#ed6c02",
        success: "#2e7d32",
        default: "#9e9e9e",
    };

    const indicatorColor =
        severityColors[nivelColor as keyof typeof severityColors]
        ?? severityColors.default;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                    borderColor: "divider",
                },
            }}
        >
            {/* Indicador de severidade */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 5,
                    bgcolor: indicatorColor,
                }}
            />

            <CardContent
                sx={{
                    p: 2.5,
                    pl: 3,
                }}
            >
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {/* Cabeçalho */}
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                    >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {incidente.titulo}
                            </Typography>

                            <Stack
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.75,
                                }}
                            >
                                <PlaceOutlinedIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "text.secondary",
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {incidente.bairro}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "flex-end",
                                gap: 0.75,
                            }}
                        >
                            <Chip
                                label={incidente.nivel_severidade}
                                color={
                                    nivelColor as
                                        | "error"
                                        | "warning"
                                        | "success"
                                        | "default"
                                }
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />

                            <Chip
                                label={incidente.ativo ? "Ativo" : "Inativo"}
                                color={incidente.ativo ? "error" : "default"}
                                variant={incidente.ativo ? "filled" : "outlined"}
                                size="small"
                            />
                        </Stack>
                    </Stack>

                    {/* Descrição */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.5,
                            minHeight: "3em",
                        }}
                    >
                        {incidente.descricao}
                    </Typography>

                    <Divider />

                    {/* Rodapé */}
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                            gap: 1.5,
                        }}
                    >
                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <AccessTimeOutlinedIcon
                                sx={{
                                    fontSize: 16,
                                    color: "text.secondary",
                                }}
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Atualizado {tempoRelativo(incidente.created_at)}
                            </Typography>
                        </Stack>

                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<VisibilityOutlinedIcon />}
                                onClick={() => onViewDetails(incidente)}
                                sx={{ borderRadius: 2 }}
                            >
                                Detalhes
                            </Button>

                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<EditOutlinedIcon />}
                                onClick={() => onEdit(incidente)}
                                sx={{ borderRadius: 2 }}
                            >
                                Editar
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
