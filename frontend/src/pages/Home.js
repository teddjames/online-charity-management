import React from 'react';

// You can use an icon library like lucide-react for icons
// To install: npm install lucide-react
import { Heart, Search, HeartHandshake, BookOpen } from 'lucide-react';

// --- MOCK DATA ---
// This mock data is structured to match your backend API response for donation requests.
// It includes nested category and NGO information.
const featuredCauses = [
    {
        id: 'dr_001',
        title: 'Provide Books for Underprivileged Children',
        description: 'Help us equip a local community library with essential books and learning materials for children who lack access to quality education.',
        amount_needed: 10000,
        amount_received: 4500,
        image_url: 'https://placehold.co/600x400/E2E8F0/4A5568?text=Education+Cause',
        status: 'Approved',
        category: {
            id: 'cat_01',
            name: 'Education'
        },
        ngo: {
            organization_name: 'Readers to Leaders Initiative'
        }
    },
    {
        id: 'dr_002',
        title: 'Medical Supplies for Rural Clinics',
        description: 'Many rural clinics are struggling with a shortage of basic medical supplies. Your donation can provide life-saving equipment and medicines.',
        amount_needed: 25000,
        amount_received: 18750,
        image_url: 'https://placehold.co/600x400/E2E8F0/4A5568?text=Health+Cause',
        status: 'Approved',
        category: {
            id: 'cat_02',
            name: 'Health'
        },
        ngo: {
            organization_name: 'Rural Health Bridge'
        }
    },
    {
        id: 'dr_003',
        title: 'Urgent Shelter for Homeless Families',
        description: 'Support our mission to provide safe and warm shelter for families who have lost their homes. Every contribution helps.',
        amount_needed: 15000,
        amount_received: 6200,
        image_url: 'https://placehold.co/600x400/E2E8F0/4A5568?text=Shelter+Cause',
        status: 'Approved',
        category: {
            id: 'cat_03',
            name: 'Shelter'
        },
        ngo: {
            organization_name: 'Safe Haven Community'
        }
    },
];


// Helper component for Stat cards
const StatCard = ({ icon, value, label }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-200/80">
        {icon}
        <p className="text-3xl lg:text-4xl font-bold text-blue-600 mt-2">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
);

// Helper component for Cause cards
const CauseCard = ({ cause }) => {
    const { title, description, amount_needed, amount_received, image_url, category } = cause;
    const progress = (amount_received / amount_needed) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
            <div className="relative">
                <img src={image_url} alt={title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{category.name}</div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 h-14 overflow-hidden">{title}</h3>
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{description}</p>
                <div className="mb-4">
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


// Main Home Page Component
export default function HomePage() {
    return (
        <div className="bg-slate-50 font-sans">
            {/* The Navbar is now handled by the main App.js component */}

            {/* Hero Section */}
            <main>
                <div className="relative pt-16 pb-32 flex content-center items-center justify-center" style={{ minHeight: '85vh' }}>
                    <div className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: "url('https://cdn.discordapp.com/attachments/1395611202104721448/1397272495526117426/93c31a9b-41cd-4fb5-a4ec-afbafcfec687.png?ex=68811eeb&is=687fcd6b&hm=baeaae81f9d5cf80b989c5bbde508258d09f9fb93b6902dcea5b044c1c79347f&')" }}>
                        <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                    </div>
                    <div className="container relative mx-auto">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                                <div className="text-white">
                                    <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl mb-4">
                                        Your Kindness Can Change the World.
                                    </h1>
                                    <p className="mt-4 text-lg lg:text-xl text-gray-200">
                                        Join our community of donors and NGOs to bring hope and support to those in need. Every contribution, big or small, makes a lasting impact.
                                    </p>
                                    <button className="mt-8 bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-xl" >
                                        Explore Causes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <section className="relative bg-slate-100 pb-20 -mt-24">
                     <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <StatCard icon={<Heart className="w-12 h-12 text-blue-500" />} value="12,000+" label="Lives Touched" />
                           <StatCard icon={<HeartHandshake className="w-12 h-12 text-blue-500" />} value="150+" label="Partner NGOs" />
                           <StatCard icon={<Search className="w-12 h-12 text-blue-500" />} value="300+" label="Active Causes" />
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                 <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">How It Works</h2>
                            <p className="text-lg text-gray-600 mt-2">A simple, transparent process for making a difference.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">1. NGOs Create a Cause</h3>
                                <p className="text-gray-600">Verified organizations submit donation requests detailing their needs and goals.</p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">2. Donors Find a Cause</h3>
                                <p className="text-gray-600">You can browse approved causes, filtering by category to find one that resonates with you.</p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-500 mx-auto mb-4">
                                    <Heart size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">3. Make a Difference</h3>
                                <p className="text-gray-600">Donate securely and see the direct impact of your generosity through updates and reports.</p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Featured Causes Section */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">Featured Causes</h2>
                            <p className="text-lg text-gray-600 mt-2">These requests need your urgent attention.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCauses.map((cause) => (
                                <CauseCard key={cause.id} cause={cause} />
                            ))}
                        </div>
                         <div className="text-center mt-12">
                            <button className="bg-transparent border-2 border-blue-500 text-blue-500 font-bold py-3 px-8 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                View All Causes
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* The Footer is now handled by the main App.js component */}
        </div>
    );
}
