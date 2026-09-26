export const getNivelColor = (nivel: string) => {
    switch (nivel) {
        case "Alto":
            return "error";

        case "Moderado":
            return "warning";

        case "Baixo":
            return "success";

        default:
            return "default";
    }
};