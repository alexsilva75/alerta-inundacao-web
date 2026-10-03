
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface Usuario {
    id: number;
    name: string;
    email: string;
    must_change_pass: boolean;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface UserCardProps {
    usuario: Usuario;
    onViewDetails: (usuario: Usuario) => void;
    onEdit: (usuario: Usuario) => void;
}

export function UserCard({
    usuario,
    onViewDetails,
    onEdit,
}: UserCardProps) {

    const formatarData = (data: string) => {
        return new Intl.DateTimeFormat("pt-BR").format(
            new Date(data)
        );
    };

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                    borderColor: "divider",
                },
            }}
        >
            <CardContent
                sx={{
                    p: 2.5,
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
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 46,
                                height: 46,
                                bgcolor: "primary.light",
                                color: "primary.dark",
                            }}
                        >
                            <PersonOutlineOutlinedIcon />
                        </Avatar>

                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    overflowWrap: "anywhere",
                                    lineHeight: 1.3,
                                }}
                            >
                                {usuario.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflowWrap: "anywhere",
                                    mt: 0.5,
                                }}
                            >
                                {usuario.email}
                            </Typography>
                        </Box>

                        <Chip
                            label={
                                usuario.is_active
                                    ? "Ativo"
                                    : "Inativo"
                            }
                            color={
                                usuario.is_active
                                    ? "success"
                                    : "default"
                            }
                            size="small"
                            variant={
                                usuario.is_active
                                    ? "filled"
                                    : "outlined"
                            }
                            sx={{
                                fontWeight: 600,
                            }}
                        />
                    </Stack>

                    {/* Indicadores */}
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Chip
                            label={
                                usuario.is_admin
                                    ? "Administrador"
                                    : "Usuário"
                            }
                            color={
                                usuario.is_admin
                                    ? "info"
                                    : "default"
                            }
                            size="small"
                            variant="outlined"
                        />

                        {usuario.must_change_pass && (
                            <Chip
                                icon={<LockOutlinedIcon />}
                                label="Alteração de senha pendente"
                                color="warning"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Stack>

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
                                gap: 0.75,
                            }}
                        >
                            <CalendarTodayOutlinedIcon
                                sx={{
                                    fontSize: 16,
                                    color: "text.secondary",
                                }}
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Cadastrado em{" "}
                                {formatarData(usuario.created_at)}
                            </Typography>
                        </Stack>

                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                gap: 1,
                            }}
                        >
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<VisibilityOutlinedIcon />}
                                onClick={() =>
                                    onViewDetails(usuario)
                                }
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                Detalhes
                            </Button>

                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<EditOutlinedIcon />}
                                onClick={() =>
                                    onEdit(usuario)
                                }
                                sx={{
                                    borderRadius: 2,
                                }}
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
