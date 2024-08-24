import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Typography, Grid, TextField, Button, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import NavBar from '../NavBar';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ItemService from '../../Service/itemService';

export default function EditItem() {
    const { itemId } = useParams();  // Récupère l'itemId depuis les paramètres de l'URL
    const navigate = useNavigate();
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
    const [categories, setCategories] = useState([]);

    // Récupère les catégories
    const fetchCategories = async () => {
        try {
            const response = await ItemService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Récupère les données de l'élément à modifier
    const fetchItemDetails = async () => {
        try {
            const response = await ItemService.getDetailItem(itemId);
            setFormData({
                title: response.data.title,
                description: response.data.description,
                category: response.data.category,
                status: response.data.status,
            });
        } catch (error) {
            console.error('Error fetching item details:', error);
            setError('Error fetching item details');
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchItemDetails();
    }, [itemId]);

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

        newImages.forEach((image) => {
            formDataToSend.append(`newImages`, image);
        });

        try {
            await ItemService.updateItem(itemId, formDataToSend);
            setSuccess('Item updated successfully');
            navigate('/items');  // Redirection vers la page des éléments après mise à jour
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <div style={{ marginTop: '1%' }}>
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
                        <EditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit Item
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
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl required fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map((categ) => (
                                            <MenuItem key={categ} value={categ}>{categ}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Images
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
                            {loading ? <CircularProgress size={24} /> : 'Update Item'}
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    );
}
