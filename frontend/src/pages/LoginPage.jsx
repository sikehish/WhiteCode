import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

function LoginPage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const {dispatch} = useAuthContext();
    const [isLogin, setIsLogin] = useState(true); // To toggle between login and signup
    const [error, setError] = useState(null);
    const [isSucc, setIsSucc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit =async (e) => {
        e.preventDefault();
        //Add the fetch request to the backend here and its should be done
        let data={
            "email":formData.email,
            "password":formData.password,
            "confirmPassword":formData.confirmPassword,
            "name":formData.name,
        }
        let reqRoute;
        if(isLogin){
            reqRoute="api/users/login";
        }
        else{
            reqRoute="api/users/signup";
        }
        const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(data),
        };
        
        if (isLogin) {
            // Perform login logic here 
            //  fetch(
            // reqRoute,requestOptions
            // ).then(()=>{

            //     setIsAuthenticated(true);
            //     navigate("/dashboard/*")
            // }).catch((e)=>{
            //     console.log("the fetch request failed");
            // });
            const response=await fetch(reqRoute,requestOptions)
            const {data}=await response.json();
            console.log(data)
           if(response.status==200){
            dispatch({user: data})
            setIsAuthenticated(true);
            navigate("/dashboard/*")
           }
           else{
                navigate('/login')
           }
            
        } else {
            // Perform signup logic here
           const response=await fetch(reqRoute,requestOptions)
           console.log(response.status)
           if(response.status==201){
                setIsLogin(true);
                navigate('/login');
           }
           else{
                navigate('/signup')
           }
           
        }

        {/* check data. REMOVE THIS LATER */ }
        //console.log('Form data:', formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-600" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3 focus:outline-none focus:border-blue-400"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3 focus:outline-none focus:border-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3 focus:outline-none focus:border-blue-400"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-600" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3 focus:outline-none focus:border-blue-400"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 w-full"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            navigate(isLogin ? '/signup' : '/login');
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
