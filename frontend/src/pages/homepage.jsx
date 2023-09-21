import React from 'react';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';

function HomePage({isAuthenticated}) {
    return (
        <div>
            {/* Header */}
            <header>
                <Navbar isAuthenticated={isAuthenticated}/>
            </header>

            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-16">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-semibold mb-4">Welcome to Your Dashboard</h2>
                    <p className="text-lg">Join virtual meetings, collaborate, and stay connected from anywhere.</p>
                    <div className="flex justify-center mt-6">
                        {/* Link to Start a Meeting */}
                        <Link to="/start-meeting" className="mr-4">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full">
                                Start a Meeting
                            </button>
                        </Link>
                        {/* Link to Join a Meeting */}
                        <Link to="/join-meeting">
                            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-full">
                                Join a Meeting
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold mb-4">Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Feature Cards */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Virtual Meetings</h3>
                            <p className="text-gray-700">Host and join virtual meetings with ease.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Collaborative Coding</h3>
                            <p className="text-gray-700">Code with meeting participants and run your code in real-time.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Video Calls & Chat</h3>
                            <p className="text-gray-700">Chat with participants and collaborate in real-time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Plus Button (for mobile) */}
            <div className="fixed bottom-16 right-4 md:hidden">
                {/* Link to Start a Meeting */}
                <Link to="/meeting" className="inline-block bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600">
                    <img src="" alt="Start Meeting" className="w-12 h-12" />
                </Link>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2023 Online Meeting Clone</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
