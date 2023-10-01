import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { state } = useAuthContext();
    const navigate = useNavigate();
    const logout = useLogout();
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
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
                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                >
                    <MenuItem onClick={handleProfileMenuClose}>Start a meeting</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
                    {loginLogoutItem}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
