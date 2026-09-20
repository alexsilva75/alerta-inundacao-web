import {
    Card,
    CardContent,
    Typography,
    CircularProgress
} from '@mui/material';

interface StatCardProps{
    title: string;
    value?:number;
}

export function StatCard({title, value}: StatCardProps){
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {value === undefined ? 
                        (<CircularProgress size={28} sx={{mt: 1}}/>) 
                        : 
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{mt: 1}}
                        >
                            {value}
                        </Typography>
                        }
                </Typography>
            </CardContent>
        </Card>
    );
}
