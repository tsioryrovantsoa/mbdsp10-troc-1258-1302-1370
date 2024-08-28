import React, { useState, useEffect } from 'react';
import NavBar from "../NavBar";
import { Box, Typography, Card, CardContent, Grid, Divider, CircularProgress } from "@mui/material";
import { useParams, useNavigate  } from 'react-router-dom';
import ExchangeService from '../../Service/exchangeService';

export default function ExchangeDetail() {
    
    let { exchangeId } = useParams();

    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchExchangeDetail = async () => {
        try {
            const response = await ExchangeService.exchangeDetail(exchangeId);
            setExchange(response.data);
        } catch (error) {
            console.error('Error fetching exchange details:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchExchangeDetail();
    }, [exchangeId]);

    const statusColor = exchange?.status === 'ACCEPTE' ? 'green' :  exchange?.status === 'EN_ATTENTE' ? 'orange' :  'red';

    return (
        <>
            <NavBar />
            <div style={{ marginTop: "1%" }}>
                {
                    loading ? (
                        <CircularProgress />
                    ) : !exchange ? (
                        <Typography>Item not found</Typography>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    Exchange Detail
                                </Typography>
                                <br />

                                <Card sx={{ marginBottom: 2 }}>
                                    <CardContent>
                                        <Typography 
                                            gutterBottom 
                                            variant="h5" 
                                            component="div" 
                                            align="center" 
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                           Exchange n°{exchange.exchangeId}
                                        </Typography>
                                        <Typography variant="body2" sx={{ padding: '8px', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Requester :</span> {exchange.requester.name} 
                                        </Typography >
                                        <Typography variant="body2" sx={{ padding: '8px', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Receiver :</span> {exchange.receiver.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: statusColor }}>
                                            {exchange.status} 
                                        </Typography>

                                        <br></br>
                                        <Typography 
                                            gutterBottom 
                                            variant="h6" 
                                            component="div" 
                                            align="center" 
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                           Items exchange
                                        </Typography>

                                        <Grid container spacing={2}>
                                        {
                                            exchange.items.map((item) => (
                                                <Grid item xs={12} sm={6} key={exchange.exchangeId}>
                                                    <Card sx={{ minWidth: 275 }}>
                                                        <CardContent>
                                                            <Typography 
                                                                gutterBottom 
                                                                variant="h7" 
                                                                component="div" 
                                                                align="center" 
                                                                sx={{ fontWeight: 'bold' }}
                                                            >
                                                                {item.title}
                                                            </Typography>

                                                            <Divider sx={{ marginY: 1 }} />

                                                            <Box 
                                                                sx={{ 
                                                                    border: '1px solid gray', 
                                                                    borderRadius: '4px', 
                                                                    padding: '8px',
                                                                    marginBottom: '8px' 
                                                                }}
                                                            >
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {item.description}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {item.category}
                                                                </Typography>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>

                                            ))
                                            
                                        }
                                        </Grid>

                                    </CardContent>
                                </Card>
                            </Box>
                        </>
                    )
                }
                
            </div>
        </>
    )
}