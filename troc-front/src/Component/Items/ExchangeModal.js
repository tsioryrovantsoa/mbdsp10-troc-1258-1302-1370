import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import ItemService from '../../Service/itemService';

const ExchangeModal = ({ open, onClose, onSelect }) => {
    const [myItems, setMyItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (open) {
            fetchMyItems();
        }
    }, [open]);

    const fetchMyItems = async () => {
        try {
            const response = await ItemService.getMyItems(); // Assuming this endpoint exists
            console.log(response);
            setMyItems(response.data.content);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleSelect = (item) => {
        setSelectedItem(item);
    };

    const handleProposeExchange = () => {
        if (selectedItem) {
            onSelect(selectedItem.itemId);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: '50%', margin: 'auto', mt: '10%' }}>
                <Typography variant="h6" mb={2}>Select an item to exchange</Typography>
                <Grid container spacing={2}>
                    {myItems.map((item) => (
                        <Grid item xs={6} key={item.itemId}>
                            <Card
                                onClick={() => handleSelect(item)}
                                sx={{ border: selectedItem?.itemId === item.itemId ? '2px solid blue' : 'none' }}
                            >
                                <CardContent>
                                    <Typography variant="h5">{item.title}</Typography>
                                    <Typography variant="body2">{item.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProposeExchange}
                    sx={{ mt: 2 }}
                    disabled={!selectedItem}
                >
                    Proposer une échange
                </Button>
            </Box>
        </Modal>
    );
};

export default ExchangeModal;
