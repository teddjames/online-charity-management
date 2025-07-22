import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Navbar = () => {
  // In a real app, you'd check auth state to show/hide links
  const isLoggedIn = false; 

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
              <Link to="/" className="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link to="/Causes" className="text-gray-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Causes</Link>
              <Link to="/about" className="text-gray-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <Link to="/dashboard/donor" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md">Dashboard</Link>
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
