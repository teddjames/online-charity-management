import React from 'react';
import { LayoutDashboard, Megaphone, BarChart2, Building, Settings, LogOut, Bell, ChevronDown, PlusCircle, MoreVertical } from 'lucide-react';

// Mock data for an NGO
const ngoData = {
    name: 'Hope Foundation',
    avatarUrl: 'https://placehold.co/100x100/EBF8FF/3182CE?text=HF',
    stats: {
        totalRaised: 75200,
        activeCauses: 3,
        donors: 480
    },
    causes: [
        { id: 'C001', title: 'Winter Clothing Drive', goal: 5000, raised: 4800, status: 'Active', dateCreated: '2024-06-01' },
        { id: 'C002', title: 'Community Soup Kitchen', goal: 10000, raised: 7500, status: 'Active', dateCreated: '2024-06-15' },
        { id: 'C003', title: 'Back-to-School Supplies', goal: 7500, raised: 1200, status: 'Pending Approval', dateCreated: '2024-07-10' },
        { id: 'C004', title: 'Emergency Medical Fund', goal: 20000, raised: 20000, status: 'Completed', dateCreated: '2024-05-01' },
    ]
};

const getStatusChip = (status) => {
    switch (status) {
        case 'Active': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Pending Approval': return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Completed': return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
};

export default function NgoDashboard() {
    const { name, avatarUrl, stats, causes } = ngoData;

    const SidebarLink = ({ icon, text, active }) => (
        <a href="#" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}>
            {icon}
            <span className="ml-3">{text}</span>
        </a>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex">
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden lg:flex flex-col">
                <div className="h-20 flex items-center justify-center border-b">
                     <div className="flex items-center space-x-2">
                        <Megaphone className="h-8 w-8 text-blue-500" />
                        <span className="text-2xl font-bold text-blue-500">NGO Panel</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} text="Dashboard" active />
                    <SidebarLink icon={<Megaphone size={20} />} text="My Causes" />
                    <SidebarLink icon={<BarChart2 size={20} />} text="Reports" />
                    <SidebarLink icon={<Building size={20} />} text="Organization Profile" />
                    <SidebarLink icon={<Settings size={20} />} text="Settings" />
                </nav>
                <div className="px-4 py-6 border-t">
                    <SidebarLink icon={<LogOut size={20} />} text="Logout" />
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {name}!</h1>
                        <p className="text-sm text-gray-500">Manage your fundraising campaigns here.</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-500 hover:text-blue-500 relative"><Bell size={24} /><span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span></button>
                        <div className="flex items-center space-x-3">
                            <img src={avatarUrl} alt="NGO Logo" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700">{name}</h4>
                                <p className="text-xs text-gray-500">NGO</p>
                            </div>
                            <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total Funds Raised</h3><p className="text-3xl font-bold text-blue-600 mt-1">${stats.totalRaised.toLocaleString()}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Active Causes</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.activeCauses}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Unique Donors</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.donors}</p></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">My Donation Causes</h3>
                            <button className="flex items-center space-x-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow hover:shadow-lg"><PlusCircle size={20} /><span>Create New Cause</span></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Cause Title</th>
                                        <th scope="col" className="px-6 py-3">Goal</th>
                                        <th scope="col" className="px-6 py-3">Raised</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Date Created</th>
                                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {causes.map(cause => (
                                        <tr key={cause.id} className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{cause.title}</th>
                                            <td className="px-6 py-4">${cause.goal.toLocaleString()}</td>
                                            <td className="px-6 py-4">${cause.raised.toLocaleString()}</td>
                                            <td className="px-6 py-4">{getStatusChip(cause.status)}</td>
                                            <td className="px-6 py-4">{cause.dateCreated}</td>
                                            <td className="px-6 py-4 text-right"><button className="text-gray-500 hover:text-blue-600"><MoreVertical size={20} /></button></td>
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
