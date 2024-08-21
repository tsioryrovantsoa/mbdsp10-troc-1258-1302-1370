import React, { useState, useEffect } from 'react';
import NavBar from "../NavBar";
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, ImageList, ImageListItem, CircularProgress } from '@mui/material';
import ItemService from '../../Service/itemService';

export default function ItemDetail() {

    let { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageLoading, setImageLoading] = useState(true);

    const fetchImageUrls = async (imageIds) => {
        const urls = [];
        for (const imageId of imageIds) {
            try {
                const response = await ItemService.getImage(imageId);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = URL.createObjectURL(blob);
                urls.push(url);
            } catch (error) {
                console.error(`Error fetching image for id ${imageId}:`, error);
            }
        }
        setImageUrls(urls);
        setImageLoading(false);
    };


    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await ItemService.getDetailItem(id); // Supposons que vous ayez une méthode getItem dans votre ItemService
                setItem(response.data);
                const imageIds = response.data.images.map(image => image.image_id);
                await fetchImageUrls(imageIds);
            } catch (error) {
                console.error('Error fetching item details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    return (
        <>
            <NavBar/>
            <div style={{marginTop:'1%'}}>
                {
                    loading ? (
                        <CircularProgress />
                    ) : !item ? (
                        <Typography>Item not found</Typography>
                    ) : (
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Item Detail
                            </Typography>

                            <br></br>

                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="body2">
                                        Category: {item.category}
                                    </Typography>
                                    <Typography variant="body2">
                                        Status: {item.status}
                                    </Typography>
                                    <Typography variant="body2">
                                        Created by: {item.user.name}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <ImageList sx={{ width: 500, height: 450 }} cols={1} rowHeight={200}>
                                {imageUrls.map((imageUrl, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={imageUrl}
                                            alt={`Image ${index}`}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>

                        </Box>
                    )
                }
                
            </div>
        </>
    )
}