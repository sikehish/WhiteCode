import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { state } = useAuthContext();
    const logout = useLogout();
    const navigate = useNavigate()

    const handleProfileMenuOpen = (event) => {
        if (window.innerWidth < 600) {
            setDrawerOpen(true);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleProfileMenuClose = () => {
        if (window.innerWidth < 600) {
            setDrawerOpen(false);
        } else {
            setAnchorEl(null);
        }
    };

    const loginLogoutItem = state?.user ? (
        <MenuItem onClick={() => {
            logout();
            navigate('/')
        }}>Logout</MenuItem>
    ) : (
        <MenuItem onClick={() => {
            navigate('/login')
        }}>Login</MenuItem>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Link to={state?.user ? '/dashboard' : '/'}>
                    <img src="/path-to-your-logo.png" alt="Logo" style={{ marginRight: '16px' }} />
                </Link>
                <Typography variant="h5" style={{ flexGrow: 1, textAlign: 'center', fontFamily: 'Product Sans, sans-serif', fontWeight: 'bold' }}>
                    WhiteCode
                </Typography>
                <IconButton
                    aria-label="Profile Menu"
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircleIcon />
                </IconButton>
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                        style: {
                            width: 250,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            padding: 16
                        }
                    }}
                >
                    <MenuItem onClick={handleProfileMenuClose}>Start a meeting</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
                    {loginLogoutItem}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
