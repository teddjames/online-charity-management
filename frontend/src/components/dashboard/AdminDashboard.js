import React from 'react';
import { LayoutDashboard, ShieldCheck, HelpingHand, List, Settings, LogOut, Bell, ChevronDown, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

// Mock data for the Admin Dashboard
const adminData = {
    stats: {
        totalNgos: 152,
        pendingApprovals: 3,
        totalDonations: 125600,
    },
    pendingNgos: [
        { id: 'ngo_004', name: 'Green World Initiative', email: 'contact@greenworld.org', dateJoined: '2024-07-20' },
        { id: 'ngo_005', name: 'Tech for Teens', email: 'info@techforteens.dev', dateJoined: '2024-07-19' },
        { id: 'ngo_006', name: 'Artisans Alliance', email: 'support@artisans.co', dateJoined: '2024-07-18' },
    ],
    recentDonationRequests: [
        { id: 'dr_008', ngo: 'Hope Foundation', title: 'Community Library Build', status: 'Pending' },
        { id: 'dr_007', ngo: 'Rural Health Bridge', title: 'Mobile Health Screenings', status: 'Approved' },
        { id: 'dr_006', ngo: 'Safe Haven Community', title: 'Emergency Shelter Kits', status: 'Approved' },
        { id: 'dr_005', ngo: 'Readers to Leaders', title: 'Digital Literacy Program', status: 'Completed' },
    ]
};

const getStatusChip = (status) => {
    switch (status) {
        case 'Approved': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Pending': return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Completed': return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
};

export default function AdminDashboard() {
    const { stats, pendingNgos, recentDonationRequests } = adminData;

    const SidebarLink = ({ icon, text, active }) => (
        <a href="#" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}>
            {icon}
            <span className="ml-3">{text}</span>
        </a>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden lg:flex flex-col">
                <div className="h-20 flex items-center justify-center border-b">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-blue-500" />
                        <span className="text-2xl font-bold text-blue-500">Admin Panel</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} text="Dashboard" active />
                    <SidebarLink icon={<List size={20} />} text="NGO Approvals" />
                    <SidebarLink icon={<HelpingHand size={20} />} text="All Donations" />
                    <SidebarLink icon={<Settings size={20} />} text="Settings" />
                </nav>
                <div className="px-4 py-6 border-t">
                    <SidebarLink icon={<LogOut size={20} />} text="Logout" />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
                    <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-500 hover:text-blue-500"><Bell size={24} /></button>
                        <div className="flex items-center space-x-3">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700">Admin User</h4>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total NGOs</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalNgos}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Pending Approvals</h3><p className="text-3xl font-bold text-orange-500 mt-1">{stats.pendingApprovals}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total Raised</h3><p className="text-3xl font-bold text-green-600 mt-1">${stats.totalDonations.toLocaleString()}</p></div>
                    </div>

                    {/* Pending NGO Approvals Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Pending NGO Approvals</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Organization Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Date Joined</th>
                                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingNgos.map(ngo => (
                                        <tr key={ngo.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{ngo.name}</td>
                                            <td className="px-6 py-4">{ngo.email}</td>
                                            <td className="px-6 py-4">{ngo.dateJoined}</td>
                                            <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                                <button className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200"><CheckCircle size={20} /></button>
                                                <button className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"><XCircle size={20} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
