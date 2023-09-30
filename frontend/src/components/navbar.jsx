import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { useAuthContext } from '../context/AuthContext';


function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const logout=useLogout()
    const{ state }=useAuthContext()
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout =   () => {
         logout();
        navigate('/');
    };

    const menuItems = state?.user
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
                    <Link to='/room'> Video Call </Link>
                    <div className="md:hidden flex-grow-1 text-right">
                        {state ? (
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
                                    ) : text.toLowerCase() === 'login' ? (
                                        <Link to="/login" className="hover:text-gray-300">
                                            Login
                                        </Link>
                                    ) : (
                                        // Content to render for other cases (Home, About, Services, Contact, etc.)
                                        <Link
                                            to={state?.user ? '/dashboard/*' : '/'}
                                            //to={`/${text.toLowerCase()}`} we can use this if we need this content, maybe add github profiles here
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

            <div className="lg:hidden">
                <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
                    <List className="w-64">
                        {menuItems.map((text) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => {
                                    if (text.toLowerCase() === 'logout') {
                                        handleLogout();
                                    } else if (text.toLowerCase() === 'login') {
                                        // navigate(`/${text.toLowerCase()}`);
                                        navigate('/login')
                                    } else {
                                        navigate(state?.user ? '/dashboard/*' : '/')
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
