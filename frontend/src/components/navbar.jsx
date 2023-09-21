import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Perform any logout logic here (e.g., clearing authentication state)
        // Then navigate to the home page ("/")
        navigate('/');
    };

    const menuItems = isAuthenticated
        ? ['Home', 'About', 'Services', 'Contact', 'Logout']
        : ['Home', 'About', 'Services', 'Contact', 'Login'];

    return (
        <div>
            <AppBar position="static" className="bg-gray-900">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className="md:hidden"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow">
                        Logo
                    </Typography>
                    <div className="md:hidden flex-grow-1 text-right">
                        {isAuthenticated ? (
                            <Link to="/" className="hover:text-gray-300">
                                Logout
                            </Link>
                        ) : (
                            <Link to="/login" className="hover:text-gray-300">
                                Login
                            </Link>
                        )}
                    </div>
                    <nav className="hidden md:flex space-x-4">
                        <ul className="flex space-x-4">
                            {menuItems.map((text) => (
                                <li key={text}>
                                    {text.toLowerCase() === 'logout' ? (
                                        <Link
                                            to="/"
                                            className="hover:text-gray-300"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/${text.toLowerCase()}`}
                                            className="hover:text-gray-300"
                                        >
                                            {text}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Toolbar>
            </AppBar>

            <div className="md:hidden">
                <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
                    <List className="w-64">
                        {menuItems.map((text) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => {
                                    if (text.toLowerCase() === 'logout') {
                                        handleLogout();
                                    } else {
                                        navigate(`/${text.toLowerCase()}`);
                                    }
                                    toggleMenu(); // Close the drawer after clicking an item
                                }}
                            >
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </div>
        </div>
    );
}

export default Navbar;
