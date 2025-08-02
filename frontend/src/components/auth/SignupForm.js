import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Building, Mail, Lock } from 'lucide-react';
import api from '../../api/axios'; // 1. Import the centralized api instance

export default function SignupPage() {
    const [userType, setUserType] = useState('donor');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: userType === 'donor' ? 'Donor' : 'NGO'
            };

            // 2. Use the api instance instead of fetch
            await api.post('/auth/register', payload);
            
            // On success, redirect to the login page
            navigate('/login');

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. An unexpected error occurred.');
            }
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden lg:h-auto lg:max-h-[750px]">
                <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Heart className="h-10 w-10 text-blue-500" />
                                <span className="text-3xl font-bold text-blue-500">plsfundme</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
                            <p className="text-gray-500 mt-2">Join our community to make a difference.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg mb-6">
                            <button onClick={() => setUserType('donor')} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${userType === 'donor' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-slate-200'}`}>
                                I am a Donor
                            </button>
                            <button onClick={() => setUserType('ngo')} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${userType === 'ngo' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-slate-200'}`}>
                                I am an NGO
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
                            
                            <div className="relative">
                                {userType === 'donor' ? <User className={iconClass} /> : <Building className={iconClass} />}
                                <input type="text" name="username" placeholder={userType === 'donor' ? 'Username' : 'Organization Name'} value={formData.username} onChange={handleInputChange} className={inputClass} required />
                            </div>
                            <div className="relative">
                                <Mail className={iconClass} />
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={inputClass} required />
                            </div>
                            <div className="relative">
                                <Lock className={iconClass} />
                                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className={inputClass} required />
                            </div>
                            <div className="relative">
                                <Lock className={iconClass} />
                                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className={inputClass} required />
                            </div>
                            <div>
                                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed">
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-500 hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block relative">
                     <img 
                        src="https://placehold.co/800x700/3b82f6/ffffff?text=Welcome!" 
                        alt="Community of people smiling" 
                        className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center bg-gradient-to-t from-black/60 to-transparent">
                         <h2 className="text-4xl font-bold leading-tight">Start Your Journey of Giving Today.</h2>
                         <p className="mt-4 text-lg text-blue-100/90 max-w-sm">Be the reason for someone's smile. Your support creates ripples of change.</p>
                     </div>
                </div>
            </div>
        </div>
    );
}
