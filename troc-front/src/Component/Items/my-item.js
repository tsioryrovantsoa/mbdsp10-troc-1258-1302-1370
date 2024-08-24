import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import { Box, Button, Typography, InputBase, Card, CardContent, CardActions, CardMedia, Pagination, 
    CircularProgress,  Select, MenuItem, InputLabel, FormControl, Grid, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import ItemService from '../../Service/itemService';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import UserService from '../../Service/userService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteItemDialog from './delete-item-dialog';

const ItemImage = ({ imageId }) => {

    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            setImageLoading(true);
            try {
                const response = await ItemService.getImage(imageId);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (error) {
                console.error(`Error fetching image for id ${imageId}:`, error);
            } finally {
                setImageLoading(false);
            }
        };

        if (imageId) {
            fetchImage();
        }

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageId]);

    if (imageLoading) {
        return <CircularProgress />;
    }

    return (
        <CardMedia
            sx={{ height: 140 }}
            image={imageUrl || "/static/images/cards/contemplative-reptile.jpg"}
            title="Item image"
        />
    );
};

export default function MyItem() {

    const navigate = useNavigate();

    console.log("id",UserService.getUserIdFromToken());

    const [myItems, setMyItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);

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

    const fetchMyItems = async () => {
        setIsLoading(true);
        const params = {
            keyword,
            category,
            page,
            size
        };
    
        const filteredParams = Object.entries(params)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
        try {
            const response = await ItemService.getMyItems(filteredParams);
            setMyItems(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const fetchCategories = async () => {
        try {
            const response = await ItemService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function goToDetail(itemId) {
        navigate(`/item/${itemId}`);
    }

    useEffect(() => {
        fetchMyItems();
    }, [page, size, keyword, category]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function openDeleteItemDialog(item) {
        setItemToDelete(item);
    }
    
    function closeDeleteItemDialog() {
        setItemToDelete(null);
    }

    const handleDeleteItem = async (itemId) => {
        try {
            await ItemService.deleteItem(itemId);
            fetchMyItems();
            closeDeleteItemDialog();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

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
                    My Items
                </Typography>

                <br></br>

                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item xs={6} sm={4} md={3}>
                        <Search sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px', boxShadow: 'none', width: '100%' }}>
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
                                fetchMyItems();
                            }
                            }}
                        />
                        </Search>
                    </Grid>

                    <Grid item xs={6} sm={4} md={3}>
                        <FormControl required fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                            sx={{ minHeight: '40px' }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories.map((categ) => (
                            <MenuItem key={categ} value={categ}>{categ}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Grid>
                </Grid>


                
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {myItems.map((item) => (
                            <>
                                <Card key={item.id} sx={{ width: 300, height: 300, marginLeft: '10px' }}>
                                    <ItemImage imageId={item.images[0]?.image_id} />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Button size="small" variant="contained" onClick={() => goToDetail(item.itemId)}>
                                            <InfoIcon fontSize="small" sx={{marginRight: '5px'}}/>
                                            Detail
                                        </Button>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => openDeleteItemDialog(item)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                                <DeleteItemDialog
                                    item={itemToDelete}
                                    open={itemToDelete !== null}
                                    handleClose={closeDeleteItemDialog}
                                    handleDelete={handleDeleteItem}
                                />
                            </>
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
                    </>
                )}

            </Box>
        </div>
        </>
    )
}