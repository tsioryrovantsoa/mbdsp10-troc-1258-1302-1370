import NavBar from "../NavBar";
import { useParams } from 'react-router-dom';
import { Box, Typography, Card } from '@mui/material';

export default function ItemDetail() {

    let { id } = useParams();

    return (
        <>
            <NavBar/>
            <div style={{marginTop:'1%'}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Item Detail {id}
                    </Typography>

                    <br></br>

                    <Card sx={{ width: 300, height: 300, marginLeft: '10px' }}>

                    </Card>
                </Box>
            </div>
        </>
    )
}