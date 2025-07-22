import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">plsfundme</h3>
            <p className="text-gray-400">Connecting those who can help with those who need it most.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2"><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li className="mb-2"><Link to="/causes" className="hover:text-blue-400 transition-colors">Causes</Link></li>
              <li className="mb-2"><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For Donors</h4>
            <ul>
              <li className="mb-2"><Link to="/how-to-donate" className="hover:text-blue-400 transition-colors">How to Donate</Link></li>
              <li className="mb-2"><Link to="/signup" className="hover:text-blue-400 transition-colors">Create Account</Link></li>
              <li className="mb-2"><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For NGOs</h4>
            <ul>
              <li className="mb-2"><Link to="/apply" className="hover:text-blue-400 transition-colors">How to Apply</Link></li>
              <li className="mb-2"><Link to="/partnership" className="hover:text-blue-400 transition-colors">Partnership</Link></li>
              <li className="mb-2"><Link to="/guidelines" className="hover:text-blue-400 transition-colors">Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} plsfundme. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
