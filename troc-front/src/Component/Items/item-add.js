import React, { useState } from 'react';
import { Container, Box, Avatar, Typography, Grid, TextField, Button, Alert, Link, CircularProgress } from '@mui/material';
import NavBar from '../NavBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ItemService from '../../Service/itemService';

export default function AddItem() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        status: 'DISPONIBLE',
    });
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('status', formData.status);

        newImages.forEach((image, index) => {
            formDataToSend.append(`newImages`, image);
        });

        try {
            const response = await ItemService.createItem(formDataToSend);
            setSuccess('Item created');
            console.log('Item created:', response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating item');
            console.error('Error creating item:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar/>
            <div style={{marginTop:'1%'}}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AddCircleOutlineIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add item
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    autoComplete="title"
                                    autoFocus
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="category"
                                    label="Category"
                                    name="category"
                                    autoComplete="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Item images
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            </Grid>

                            {newImages.length > 0 && (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    {newImages.map((image, index) => (
                                        <img 
                                            key={index}
                                            src={URL.createObjectURL(image)}
                                            alt={`Uploaded ${index + 1}`}
                                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    id="description"
                                    label="Description"
                                    multiline
                                    margin="normal"
                                    name="description"
                                    fullWidth
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create item'}
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    );
}