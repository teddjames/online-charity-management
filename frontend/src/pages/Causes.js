import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// --- Reusable CauseCard component (Updated to match HomePage version) ---
const CauseCard = ({ cause }) => {
    const { id, title, description, amount_needed, amount_received, image_url, category } = cause;
    const progress = amount_needed > 0 ? (amount_received / amount_needed) * 100 : 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
            <div className="relative">
                <img src={image_url || `https://placehold.co/600x400/EBF8FF/3182CE?text=Cause`} alt={title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {category?.name || 'General'}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 h-14 overflow-hidden">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
                    {description}
                </p>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-700">
                            Raised: ${Number(amount_received || 0).toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                            Goal: ${Number(amount_needed || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <Link to={`/donate/${id}`}>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 group-hover:scale-105 transform">
                        Donate Now
                    </button>
                </Link>
            </div>
        </div>
    );
};


// --- Main Causes Page Component ---
export default function CausesPage() {
    const [allCauses, setAllCauses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const [causesRes, categoriesRes] = await Promise.all([
                    api.get('/causes/approved'),
                    api.get('/causes/categories')
                ]);
                setAllCauses(causesRes.data);
                setCategories(['All', ...categoriesRes.data.map(c => c.name)]);
            } catch (err) {
                setError('Failed to load causes. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCauses = allCauses.filter(cause => {
        const categoryMatch = activeCategory === 'All' || (cause.category && cause.category.name === activeCategory);
        const searchMatch = (cause.title && cause.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
                              (cause.description && cause.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return categoryMatch && searchMatch;
    });

    return (
        <div className="bg-slate-50 font-sans">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Find a Cause to Support
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Browse through active donation requests and make a difference today.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-4 rounded-xl shadow-md mb-10 sticky top-24 z-40">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg p-1 w-full md:w-auto overflow-x-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex-shrink-0 ${activeCategory === category ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search causes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
                
                {loading && <div className="text-center py-20">Loading Causes...</div>}
                {error && <div className="text-center py-20 text-red-600">{error}</div>}
                
                {!loading && !error && (
                    filteredCauses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCauses.map((cause) => (
                                <CauseCard key={cause.id} cause={cause} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-semibold text-gray-700">No Causes Found</h3>
                            <p className="text-gray-500 mt-2">There are no approved donation requests at the moment.</p>
                        </div>
                    )
                )}
            </main>
        </div>
    );
}