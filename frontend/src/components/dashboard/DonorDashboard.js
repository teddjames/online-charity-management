import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Heart, History, User, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

// --- Helper Components ---

const SidebarLink = ({ icon, text, to, active, onClick }) => {
    const commonClasses = `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left`;
    const activeClasses = `bg-blue-500 text-white shadow`;
    const inactiveClasses = `text-gray-600 hover:bg-blue-100 hover:text-blue-600`;

    if (onClick) {
        return <button onClick={onClick} className={`${commonClasses} ${inactiveClasses}`}>{icon}<span className="ml-3">{text}</span></button>;
    }
    return <Link to={to} className={`${commonClasses} ${active ? activeClasses : inactiveClasses}`}>{icon}<span className="ml-3">{text}</span></Link>;
};

// --- Main Dashboard Component ---

export default function DonorDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ totalDonated: 0, causesSupported: 0 });
    const [recentDonations, setRecentDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDonorData = async () => {
            if (!user?.token) return;
            try {
                setLoading(true);
                setError('');
                const response = await api.get('/donors/my-donations', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                
                const donations = response.data;
                // Get the 5 most recent donations for the dashboard
                setRecentDonations(donations.slice(0, 5));

                const totalDonated = donations.reduce((acc, donation) => acc + (donation.amount_donated || 0), 0);
                const causesSupported = new Set(donations.map(d => d.donation_request?.id).filter(id => id)).size;
                
                setStats({ totalDonated, causesSupported });

            } catch (err) {
                setError('Failed to load your donation data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonorData();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex">
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden lg:flex flex-col">
                <div className="h-20 flex items-center justify-center border-b">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-blue-500" />
                        <span className="text-2xl font-bold text-blue-500">Donor Panel</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} text="Dashboard" to="/dashboard/donor" active />
                    {/* THIS IS THE FIX: Point to the new donation history page */}
                    <SidebarLink icon={<History size={20} />} text="Donation History" to="/donations/history" />
                    <SidebarLink icon={<User size={20} />} text="My Profile" to="/profile" />
                </nav>
                <div className="px-4 py-6 border-t">
                    <SidebarLink icon={<LogOut size={20} />} text="Logout" onClick={logout} />
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.username}!</h1>
                        <p className="text-sm text-gray-500">Thank you for your continued support.</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-500 hover:text-blue-500"><Bell size={24} /></button>
                        <div className="flex items-center space-x-3">
                            <img src={`https://placehold.co/100x100/EBF8FF/3182CE?text=${user.username.charAt(0).toUpperCase()}`} alt="User Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700">{user.username}</h4>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                            <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="text-sm font-semibold text-gray-500">Total Donated</h3>
                            <p className="text-3xl font-bold text-green-600 mt-1">${stats.totalDonated.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="text-sm font-semibold text-gray-500">Causes Supported</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.causesSupported}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Donations</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Cause</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="text-center py-8">Loading your donations...</td></tr>
                                    ) : recentDonations.length > 0 ? recentDonations.map(donation => (
                                        <tr key={donation.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{donation.donation_request?.title || 'Cause details not found'}</td>
                                            <td className="px-6 py-4">${donation.amount_donated.toLocaleString()}</td>
                                            <td className="px-6 py-4">{new Date(donation.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="text-center py-8 text-gray-500">You haven't made any donations yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
