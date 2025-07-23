import React, { useState } from 'react';
import { Search, ListFilter } from 'lucide-react';

// --- MOCK DATA ---
// A larger list of causes to populate the page, matching your backend structure.
const allCauses = [
    { id: 'dr_001', title: 'Provide Books for Underprivileged Children', description: 'Help us equip a local community library with essential books and learning materials.', amount_needed: 10000, amount_received: 4500, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Education', category: { id: 'cat_01', name: 'Education' } },
    { id: 'dr_002', title: 'Medical Supplies for Rural Clinics', description: 'Your donation can provide life-saving equipment and medicines to remote areas.', amount_needed: 25000, amount_received: 18750, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Health', category: { id: 'cat_02', name: 'Health' } },
    { id: 'dr_003', title: 'Urgent Shelter for Homeless Families', description: 'Support our mission to provide safe and warm shelter for families who have lost their homes.', amount_needed: 15000, amount_received: 6200, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Shelter', category: { id: 'cat_03', name: 'Shelter' } },
    { id: 'dr_004', title: 'Clean Water Initiative in Arid Regions', description: 'Help us build wells and provide clean, accessible drinking water to communities in need.', amount_needed: 30000, amount_received: 22500, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Environment', category: { id: 'cat_04', name: 'Environment' } },
    { id: 'dr_005', title: 'Support Local Animal Shelter', description: 'Provide food, and care for abandoned animals. Your contribution saves lives.', amount_needed: 8000, amount_received: 3100, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Animals', category: { id: 'cat_05', name: 'Animals' } },
    { id: 'dr_006', title: 'Digital Literacy for Seniors', description: 'Bridge the digital divide by providing seniors with the skills to use modern technology.', amount_needed: 5000, amount_received: 4900, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Education', category: { id: 'cat_01', name: 'Education' } },
    { id: 'dr_007', title: 'Mobile Health Screenings', description: 'Fund our mobile unit to provide free health check-ups in underserved neighborhoods.', amount_needed: 18000, amount_received: 9000, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Health', category: { id: 'cat_02', name: 'Health' } },
    { id: 'dr_008', title: 'Reforestation Project', description: 'Join us in our goal to plant 50,000 new trees this year to combat climate change.', amount_needed: 40000, amount_received: 15000, image_url: 'https://placehold.co/600x400/EBF8FF/3182CE?text=Environment', category: { id: 'cat_04', name: 'Environment' } },
];

const categories = ['All', 'Education', 'Health', 'Shelter', 'Environment', 'Animals'];

// Reusable CauseCard component
const CauseCard = ({ cause }) => {
    const { title, description, amount_needed, amount_received, image_url, category } = cause;
    const progress = (amount_received / amount_needed) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group border border-gray-100">
            <div className="relative">
                <img src={image_url} alt={title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{category.name}</div>
            </div>
            <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-2 h-14 overflow-hidden">{title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
                <div className="mb-4 mt-auto">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-700">Raised: ${Number(amount_received).toLocaleString()}</span>
                        <span className="text-sm font-semibold text-gray-500">Goal: ${Number(amount_needed).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <button className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 group-hover:scale-105 transform">
                    Donate Now
                </button>
            </div>
        </div>
    );
};


// Main Causes Page Component
export default function CausesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCauses = allCauses.filter(cause => {
        const categoryMatch = activeCategory === 'All' || cause.category.name === activeCategory;
        const searchMatch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) || cause.description.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    return (
        <div className="bg-slate-50 font-sans">
            {/* Page Header */}
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

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-10 sticky top-24 z-40">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg p-1 w-full md:w-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeCategory === category ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
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
                            <button className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-100">
                                <ListFilter size={16} />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Causes Grid */}
                {filteredCauses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCauses.map((cause) => (
                            <CauseCard key={cause.id} cause={cause} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-gray-700">No Causes Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
