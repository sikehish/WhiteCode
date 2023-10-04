import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Popover, List, ListItem, ListItemText, Drawer, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { state } = useAuthContext();
    const logout = useLogout();
    const navigate = useNavigate();

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
        <ListItem
            button
            onClick={() => {
                logout();
                navigate('/');
                handleProfileMenuClose();
            }}
            component={Link}
            to="/"
        >
            <ListItemText primary="Logout" />
        </ListItem>
    ) : (
        <ListItem
            button
            onClick={() => {
                navigate('/login');
                handleProfileMenuClose();
            }}
            component={Link}
            to="/login"
        >
            <ListItemText primary="Login" />
        </ListItem>
    );

    // Conditionally render user profile icon and associated content
    let profileIconButton = null;
    let userProfileContent = null;

    if (state?.user) {
        profileIconButton = (
            <IconButton
                aria-label="Profile Menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircleIcon />
            </IconButton>
        );

        userProfileContent = (
            <div className="text-center border-b border-gray-300 pb-3">
                <ListItem>
                    <Avatar alt={state.user.name} src={state.user.profilePicture} className="mx-auto" />
                </ListItem>
                <ListItem>
                    <Link to="/profile" className="mx-auto text-center font-bold">{state.user.name}</Link>
                </ListItem>
            </div>
        );
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Link to={state?.user ? '/dashboard' : '/'} className="flex items-center">
                    <img src="/path-to-logo.png" alt="Logo" className="mr-4" />
                </Link>
                <Typography variant="h5" className="flex-grow text-center" style={{ fontFamily: 'Product Sans, sans-serif', fontWeight: 'bold' }}>
                    WhiteCode
                </Typography>
                {profileIconButton}
                {userProfileContent && (
                    <div>
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
                            <List>
                                {userProfileContent}
                                <ListItem button component={Link} to="/meeting">
                                    <ListItemText primary="Start a meeting" />
                                </ListItem>
                                <ListItem button component={Link} to="/settings">
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                {loginLogoutItem}
                            </List>
                        </Drawer>
                        <Popover
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <List>
                                {userProfileContent}
                                <ListItem button component={Link} to="/meeting">
                                    <ListItemText primary="Start a meeting" />
                                </ListItem>
                                <ListItem button component={Link} to="/settings">
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                {loginLogoutItem}
                            </List>
                        </Popover>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
