import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const Navbar = () => {
    const { user, logout } = useAuth(); // Get user and logout function from context

    const getDashboardLink = () => {
        if (!user) return "/";
        switch (user.role) {
            case 'Admin':
                return '/dashboard/admin';
            case 'NGO':
                return '/dashboard/ngo';
            case 'Donor':
            default:
                return '/dashboard/donor';
        }
    };

    const linkClass = "text-gray-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClass = "bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors";

    return (
        <nav className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <Heart className="h-8 w-8 text-blue-500" />
                            <span className="text-2xl font-bold text-blue-500">plsfundme</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Home</NavLink>
                            <NavLink to="/causes" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Causes</NavLink>
                            <NavLink to="/about" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>About Us</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Contact</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Hi, {user.username}</span>
                                <Link to={getDashboardLink()} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md">Dashboard</Link>
                                <button onClick={logout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut size={22} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-500 px-4 py-2 rounded-md text-sm font-medium">Log In</Link>
                                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
