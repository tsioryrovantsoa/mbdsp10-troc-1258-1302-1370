
import React, { useState, useEffect } from 'react';
import NavBar from "../NavBar";
import { Box, Button, Typography, InputBase, Card, CardContent, CardActions, CardMedia, Pagination } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import ItemService from '../../Service/itemService';

export default function ItemList() {

    const [items, setItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [imageUrls, setImageUrls] = useState({});

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
    }));

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
    }));

    const fetchItems = async () => {
        const params = {
            keyword,
            category,
            status,
            page,
            size
        };
    
        const filteredParams = Object.entries(params)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
        try {
            const response = await ItemService.listItem(filteredParams);
            setItems(response.data.content);
            setTotalPages(response.data.totalPages);

            const imageUrlPromises = response.data.content.map(async (item) => {
                if (item.images[0]) {
                    try {
                        const imageResponse = await ItemService.getImage(item.images[0].image_id);
                        return { id: item.id, url: URL.createObjectURL(imageResponse.data) };
                    } catch (error) {
                        console.error(`Error fetching image for item ${item.id}:`, error);
                        return { id: item.id, url: null };
                    }
                }
                return { id: item.id, url: null };
            });
    
            const imageUrls = await Promise.all(imageUrlPromises);
            setImageUrls(Object.fromEntries(imageUrls.map(({ id, url }) => [id, url])));

        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    useEffect(() => {
        fetchItems();
    }, [page, size, keyword, category, status]);


    useEffect(() => {
        return () => {
            // Nettoyer les URLs des objets lors du démontage du composant
            Object.values(imageUrls).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [imageUrls]);

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
                        Item List
                    </Typography>

                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    fetchItems();
                                }
                            }}
                        />
                    </Search>

                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {items.map((item) => (
                            <Card key={item.id} sx={{ width: 300, height: 300, marginLeft: '10px' }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={imageUrls[item.id] || "/static/images/cards/contemplative-reptile.jpg"}
                                    title={item.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>

                    <br></br>

                    <Pagination 
                        count={totalPages} 
                        page={page + 1} 
                        onChange={handlePageChange} 
                        variant="outlined" 
                        color="secondary" 
                    />

                </Box>
            </div>
            
        </>
    )
}