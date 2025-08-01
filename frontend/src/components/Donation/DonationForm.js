import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DonationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [cause, setCause] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchCauseDetails = async () => {
            try {
                setLoading(true);
                // Fetch the specific cause details from the new backend endpoint
                const response = await api.get(`/causes/${id}`);
                setCause(response.data);
            } catch (err) {
                setError('Cause not found or is no longer active.');
                console.error("Failed to fetch cause details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCauseDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            setError('Please enter a valid donation amount.');
            return;
        }
        setLoading(true);
        setError('');
        
        try {
            // Send the donation to the backend
            await api.post(`/donors/donate/${id}`, 
                { amount_donated: amount },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setLoading(false);
            setSuccess(true);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Donation failed. Please try again.');
            console.error("Donation submission error:", err);
        }
    };

    if (loading) {
        return <div className="container mx-auto p-8 text-center">Loading cause...</div>;
    }

    if (success) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-green-600">Thank You!</h1>
                    <p className="mt-4 text-lg text-gray-700">Your generous donation to "{cause?.title}" has been processed successfully.</p>
                    <button onClick={() => navigate('/causes')} className="mt-8 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                        Back to Causes
                    </button>
                </div>
            </div>
        );
    }
    
    if (error || !cause) {
         return <div className="container mx-auto p-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2">
                    <div className="p-8 lg:p-12">
                        <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
                        <p className="mt-2 text-gray-600">You are supporting:</p>
                        <h2 className="text-xl font-semibold text-blue-600 mt-1">{cause.title}</h2>
                        
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Donation Amount</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600">This is a placeholder for a secure payment gateway integration.</p>
                                </div>
                            </div>
                            
                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Donate $${amount || '0.00'}`}
                            </button>
                        </form>
                    </div>
                    <div className="hidden lg:block">
                        <img src={cause.image_url || `https://placehold.co/600x400/3b82f6/ffffff?text=Thank+You!`} alt={cause.title} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationForm;
