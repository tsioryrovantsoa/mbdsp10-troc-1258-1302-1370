
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { isTokenValid } from '../Service/utils';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationService from '../Service/notificationService';
import UserService from '../Service/userService';
import { useNavigate } from 'react-router-dom';

const pages = [{name:'Items', url:'accueil'}, {name:'My Exchanges', url:'my-exchange'}, {name:'My items', url:'my-item'}];
const settings = [{name:'Profile', url:''}, {name:'Logout',url: 'sign-in'}];

export default function NavBar() {

    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [nbNotif, setNbNotif] = useState(0);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const goToNotification = () => {
        navigate('/notifications');
    }

    const userConnectedId = UserService.getUserIdFromToken();

    const fetchNbNotifications = async (userId) => {
        try {
            const response = await NotificationService.nbNotification(userId);
            setNbNotif(response.data.count);
        } catch(error) {
            console.error('Error fetching nb notifs :', error);
        }
    }

    useEffect(() => {
        fetchNbNotifications(userConnectedId);
        console.log("nbNotif", nbNotif);
    }, [userConnectedId]);

    return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    to="/"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    TROC APPLICATION
                </Typography>
    
                { isTokenValid() && (
                    <>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <MenuIcon />
                        </IconButton>
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                        {pages.map((page) => (
                            <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={`/${page.url}`}>
                            <Typography textAlign="center">{page.name}</Typography>
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        to="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        TROC APPLICATION
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page.name}
                            onClick={handleCloseNavMenu}
                            component={Link}
                            to={`/${page?.url}`}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page.name}
                        </Button>
                        ))}
                    </Box>
            
                    <Box sx={{ flexGrow: 0 }}>
                        <Button variant="contained" color="success" sx={{ marginRight: '10px' }} startIcon={<AddCircleOutlineIcon />} component={Link} to='/add-item'>
                            Add item
                        </Button>
                        <Button sx={{ color: 'white' }} >
                            <Badge badgeContent={nbNotif} color="error">
                                <NotificationsIcon onClick={() => goToNotification()} />
                            </Badge>
                        </Button>
                        <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                        </Tooltip>
                        <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu} component={Link} to={`/${setting.url}`}>
                            <Typography textAlign="center">{setting.name}</Typography>
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                    </>
                )}

            </Toolbar>
          </Container>
        </AppBar>
    );
}