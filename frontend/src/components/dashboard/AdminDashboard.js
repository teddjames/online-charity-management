import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, HelpingHand, List, Settings, LogOut, Bell, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

// --- Helper Components ---

const SidebarLink = ({ icon, text, active, onClick }) => {
    const commonClasses = `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left`;
    const activeClasses = `bg-blue-500 text-white shadow`;
    const inactiveClasses = `text-gray-600 hover:bg-blue-100 hover:text-blue-600`;

    return (
        <button onClick={onClick} className={`${commonClasses} ${active ? activeClasses : inactiveClasses}`}>
            {icon}
            <span className="ml-3">{text}</span>
        </button>
    );
};

const getStatusChip = (status) => {
    switch (status) {
        case 'Approved': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Pending': return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Rejected': return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Completed': return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
};

// --- Main Dashboard Component ---

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ totalNgos: 0, pendingApprovals: 0, totalDonations: 0 });
    const [pendingNgos, setPendingNgos] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'ngoApprovals', 'donations'

    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        try {
            setLoading(true);
            setError('');
            const [statsRes, ngosRes, requestsRes] = await Promise.all([
                api.get('/admin/stats', { headers: { Authorization: `Bearer ${user.token}` } }),
                api.get('/admin/ngos/pending', { headers: { Authorization: `Bearer ${user.token}` } }),
                api.get('/admin/donation-requests', { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setStats(statsRes.data);
            setPendingNgos(ngosRes.data);
            setDonationRequests(requestsRes.data);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNgoApproval = async (ngoId, action) => {
        try {
            await api.post(`/admin/ngos/${ngoId}/${action}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            fetchData(); // Refresh all data
        } catch (err) {
            setError(`Failed to ${action} NGO.`);
        }
    };

    const handleDonationRequestApproval = async (requestId, action) => {
        try {
            await api.post(`/admin/donation-requests/${requestId}/${action}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            fetchData(); // Refresh all data
        } catch (err) {
            setError(`Failed to ${action} donation request.`);
        }
    };

    const renderContent = () => {
        if (activeView === 'ngoApprovals') {
            return <NgoApprovalsTable loading={loading} pendingNgos={pendingNgos} handleNgoApproval={handleNgoApproval} />;
        }
        if (activeView === 'donations') {
            return <DonationRequestsTable loading={loading} donationRequests={donationRequests} handleDonationRequestApproval={handleDonationRequestApproval} />;
        }
        // Default 'dashboard' view
        return (
            <>
                <NgoApprovalsTable loading={loading} pendingNgos={pendingNgos} handleNgoApproval={handleNgoApproval} />
                <DonationRequestsTable loading={loading} donationRequests={donationRequests} handleDonationRequestApproval={handleDonationRequestApproval} />
            </>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex">
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden lg:flex flex-col">
                <div className="h-20 flex items-center justify-center border-b">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-blue-500" />
                        <span className="text-2xl font-bold text-blue-500">Admin Panel</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => setActiveView('dashboard')} active={activeView === 'dashboard'} />
                    <SidebarLink icon={<List size={20} />} text="NGO Approvals" onClick={() => setActiveView('ngoApprovals')} active={activeView === 'ngoApprovals'} />
                    <SidebarLink icon={<HelpingHand size={20} />} text="Donations" onClick={() => setActiveView('donations')} active={activeView === 'donations'} />
                </nav>
                <div className="px-4 py-6 border-t">
                    <SidebarLink icon={<LogOut size={20} />} text="Logout" onClick={logout} />
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
                    <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
                    {user && (
                        <div className="flex items-center space-x-6">
                            <button className="text-gray-500 hover:text-blue-500"><Bell size={24} /></button>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700">{user.username}</h4>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                                <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total NGOs</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalNgos}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Pending Approvals</h3><p className="text-3xl font-bold text-orange-500 mt-1">{stats.pendingApprovals}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total Raised</h3><p className="text-3xl font-bold text-green-600 mt-1">${stats.totalDonations.toLocaleString()}</p></div>
                    </div>

                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// --- Sub-components for clarity ---

const NgoApprovalsTable = ({ loading, pendingNgos, handleNgoApproval }) => (
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
                    {loading ? ( <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr> ) : 
                    pendingNgos.length > 0 ? pendingNgos.map(ngo => (
                        <tr key={ngo.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{ngo.name}</td>
                            <td className="px-6 py-4">{ngo.email}</td>
                            <td className="px-6 py-4">{ngo.date_joined}</td>
                            <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                <button onClick={() => handleNgoApproval(ngo.id, 'approve')} className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200"><CheckCircle size={20} /></button>
                                <button onClick={() => handleNgoApproval(ngo.id, 'reject')} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"><XCircle size={20} /></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">No pending NGO approvals.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const DonationRequestsTable = ({ loading, donationRequests, handleDonationRequestApproval }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Donation Request Approvals</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Cause Title</th>
                        <th scope="col" className="px-6 py-3">NGO</th>
                        <th scope="col" className="px-6 py-3">Amount Needed</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? ( <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr> ) : 
                    donationRequests.length > 0 ? donationRequests.map(req => (
                        <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{req.title}</td>
                            <td className="px-6 py-4">{req.ngo?.organization_name || 'N/A'}</td>
                            <td className="px-6 py-4">${req.amount_needed.toLocaleString()}</td>
                            <td className="px-6 py-4">{getStatusChip(req.status)}</td>
                            <td className="px-6 py-4 text-center">
                                {req.status === 'Pending' ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleDonationRequestApproval(req.id, 'approve')} className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200"><CheckCircle size={20} /></button>
                                        <button onClick={() => handleDonationRequestApproval(req.id, 'reject')} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"><XCircle size={20} /></button>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs italic">No actions</span>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500">No donation requests found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
