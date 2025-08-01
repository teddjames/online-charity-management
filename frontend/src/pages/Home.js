import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, HeartHandshake, BookOpen } from "lucide-react";
import api from "../api/axios";

const StatCard = ({ icon, value, label }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-200/80">
        {icon}
        <p className="text-3xl lg:text-4xl font-bold text-blue-600 mt-2">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
);

const CauseCard = ({ cause }) => {
    const {
        id,
        title,
        description,
        amount_needed,
        amount_received,
        image_url,
        category,
    } = cause;
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

export default function HomePage() {
    const [featuredCauses, setFeaturedCauses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCauses = async () => {
            try {
                setLoading(true);
                const response = await api.get('/causes/approved');
                setFeaturedCauses(response.data.slice(0, 3)); // Get first 3 for featured section
            } catch (err) {
                setError('Failed to load featured causes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCauses();
    }, []);


    return (
        <div className="bg-slate-50 font-sans">
            <main>
                <div
                    className="relative pt-16 pb-32 flex content-center items-center justify-center"
                    style={{ minHeight: "85vh" }}
                >
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://res.cloudinary.com/drurumfi8/image/upload/v1753340076/Dashboard_image_h5n2mk.png')",
                        }}
                    >
                        <span className="w-full h-full absolute opacity-50 bg-black" />
                    </div>
                    <div className="container relative mx-auto">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                                <div className="text-white">
                                    <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl mb-4">
                                        Your Kindness Can Change the World.
                                    </h1>
                                    <p className="mt-4 text-lg lg:text-xl text-gray-200">
                                        Join our community of donors and NGOs to bring hope and
                                        support to those in need. Every contribution, big or small,
                                        makes a lasting impact.
                                    </p>
                                    <Link to="/causes">
                                        <button className="mt-8 bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-xl">
                                            Explore Causes
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="relative bg-slate-100 pb-20 -mt-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={<Heart className="w-12 h-12 text-blue-500" />}
                                value="12,000+"
                                label="Lives Touched"
                            />
                            <StatCard
                                icon={<HeartHandshake className="w-12 h-12 text-blue-500" />}
                                value="150+"
                                label="Partner NGOs"
                            />
                            <StatCard
                                icon={<Search className="w-12 h-12 text-blue-500" />}
                                value="300+"
                                label="Active Causes"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">How It Works</h2>
                            <p className="text-lg text-gray-600 mt-2">
                                A simple, transparent process for making a difference.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    1. NGOs Create a Cause
                                </h3>
                                <p className="text-gray-600">
                                    Verified organizations submit donation requests detailing
                                    their needs and goals.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    2. Donors Find a Cause
                                </h3>
                                <p className="text-gray-600">
                                    Browse approved causes, filtering by category to find one that
                                    resonates with you.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <Heart size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    3. Make a Difference
                                </h3>
                                <p className="text-gray-600">
                                    Donate securely and see the direct impact of your generosity
                                    through updates and reports.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">
                                Featured Causes
                            </h2>
                            <p className="text-lg text-gray-600 mt-2">
                                These requests need your urgent attention.
                            </p>
                        </div>

                        {loading && <div className="text-center">Loading...</div>}
                        {error && <div className="text-center text-red-500">{error}</div>}
                        
                        {!loading && !error && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredCauses.map((cause) => (
                                    <CauseCard key={cause.id} cause={cause} />
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link to="/causes">
                                <button className="bg-transparent border-2 border-blue-500 text-blue-500 font-bold py-3 px-8 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                    View All Causes
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
