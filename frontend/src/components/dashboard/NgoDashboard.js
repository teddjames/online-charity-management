import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Megaphone, BarChart2, Building, LogOut, Bell, ChevronDown, PlusCircle, MoreVertical, X, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

// --- Helper Components ---

const getStatusChip = (status) => {
    switch (status) {
        case 'Active': case 'Approved': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Pending': return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        case 'Completed': return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
        default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
};

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

// --- Main Dashboard Component ---

export default function NgoDashboard() {
    const { user, logout } = useAuth();
    const [causes, setCauses] = useState([]);
    const [stats, setStats] = useState({ totalRaised: 0, activeCauses: 0, donors: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCause, setEditingCause] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState('dashboard');

    const fetchNgoData = useCallback(async () => {
        if (!user?.token) return;
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/ngo/causes', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const causesData = response.data;
            setCauses(causesData);

            const totalRaised = causesData.reduce((acc, cause) => acc + cause.amount_received, 0);
            const activeCauses = causesData.filter(c => c.status === 'Approved' || c.status === 'Active').length;
            setStats({ totalRaised, activeCauses, donors: 480 });

        } catch (err) {
            setError('Failed to load your dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNgoData();
    }, [fetchNgoData]);

    const handleCreateClick = () => {
        setEditingCause(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (cause) => {
        setEditingCause(cause);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (causeId) => {
        if (window.confirm('Are you sure you want to delete this cause?')) {
            try {
                await api.delete(`/ngo/causes/${causeId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                fetchNgoData(); // Refresh data after deleting
            } catch (err) {
                setError('Failed to delete cause.');
                console.error(err);
            }
        }
    };

    const renderContent = () => {
        switch(activeView) {
            case 'myCauses':
                return <MyCausesView loading={loading} causes={causes} openModal={handleCreateClick} onEdit={handleEditClick} onDelete={handleDeleteClick} />;
            case 'reports':
                return <ReportsView />;
            case 'dashboard':
            default:
                return (
                    <>
                        <StatsCards stats={stats} />
                        <MyCausesView loading={loading} causes={causes.slice(0, 5)} openModal={handleCreateClick} onEdit={handleEditClick} onDelete={handleDeleteClick} isSummary={true} />
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex">
            {isModalOpen && <CreateEditCauseModal causeToEdit={editingCause} onClose={() => setIsModalOpen(false)} onCauseCreated={fetchNgoData} />}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden lg:flex flex-col">
                <div className="h-20 flex items-center justify-center border-b">
                     <div className="flex items-center space-x-2">
                         <Megaphone className="h-8 w-8 text-blue-500" />
                         <span className="text-2xl font-bold text-blue-500">NGO Panel</span>
                     </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => setActiveView('dashboard')} active={activeView === 'dashboard'} />
                    <SidebarLink icon={<Megaphone size={20} />} text="My Causes" onClick={() => setActiveView('myCauses')} active={activeView === 'myCauses'} />
                    <SidebarLink icon={<BarChart2 size={20} />} text="Reports" onClick={() => setActiveView('reports')} active={activeView === 'reports'} />
                    <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600">
                        <Building size={20} />
                        <span className="ml-3">Organization Profile</span>
                    </Link>
                </nav>
                <div className="px-4 py-6 border-t">
                    <SidebarLink icon={<LogOut size={20} />} text="Logout" onClick={logout} />
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.username}!</h1>
                        <p className="text-sm text-gray-500">Manage your fundraising campaigns here.</p>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-6">
                            <button className="text-gray-500 hover:text-blue-500 relative"><Bell size={24} /><span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span></button>
                            <div className="flex items-center space-x-3">
                                <img src={`https://placehold.co/100x100/EBF8FF/3182CE?text=${user.username.charAt(0).toUpperCase()}`} alt="NGO Logo" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
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
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// --- Sub-components for different views ---

const StatsCards = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Total Funds Raised</h3><p className="text-3xl font-bold text-blue-600 mt-1">${stats.totalRaised.toLocaleString()}</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Active Causes</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.activeCauses}</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-sm font-semibold text-gray-500">Unique Donors</h3><p className="text-3xl font-bold text-blue-600 mt-1">{stats.donors}</p></div>
    </div>
);

const MyCausesView = ({ loading, causes, openModal, onEdit, onDelete, isSummary = false }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{isSummary ? "Recent Causes" : "My Donation Causes"}</h3>
                <button onClick={openModal} className="flex items-center space-x-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow hover:shadow-lg"><PlusCircle size={20} /><span>Create New Cause</span></button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Cause Title</th>
                            <th scope="col" className="px-6 py-3">Goal</th>
                            <th scope="col" className="px-6 py-3">Raised</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="5" className="text-center py-8">Loading causes...</td></tr>) :
                        causes.length > 0 ? causes.map(cause => (
                            <tr key={cause.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{cause.title}</th>
                                <td className="px-6 py-4">${cause.amount_needed.toLocaleString()}</td>
                                <td className="px-6 py-4">${cause.amount_received.toLocaleString()}</td>
                                <td className="px-6 py-4">{getStatusChip(cause.status)}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="relative inline-block" ref={menuRef}>
                                        <button onClick={() => setOpenMenuId(openMenuId === cause.id ? null : cause.id)} className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"><MoreVertical size={20} /></button>
                                        {openMenuId === cause.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                                                <button onClick={() => { onEdit(cause); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><Edit size={16} className="mr-2"/> Edit</button>
                                                <button onClick={() => { onDelete(cause.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"><Trash2 size={16} className="mr-2"/> Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-500">You have not created any causes yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ReportsView = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
        <h3 className="text-2xl font-bold text-gray-800">Reports</h3>
        <p className="mt-4 text-gray-600">This section is under construction. Detailed analytics and reporting features will be available here soon.</p>
    </div>
);

// Modal for creating or editing a cause
const CreateEditCauseModal = ({ causeToEdit, onClose, onCauseCreated }) => {
    const [formData, setFormData] = useState({ title: '', description: '', amount_needed: '', category_id: '' });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isEditMode = causeToEdit !== null;

    useEffect(() => {
        const fetchCategories = async () => {
            if (!user?.token) return;
            try {
                const response = await api.get('/causes/categories', { headers: { Authorization: `Bearer ${user.token}` } });
                setCategories(response.data);
                if (response.data.length > 0 && !isEditMode) {
                    setFormData(prev => ({ ...prev, category_id: response.data[0].id }));
                }
            } catch (error) {
                setError("Could not load categories.");
            }
        };
        fetchCategories();

        if (isEditMode) {
            setFormData({
                title: causeToEdit.title,
                description: causeToEdit.description,
                amount_needed: causeToEdit.amount_needed,
                category_id: causeToEdit.category.id
            });
        }
    }, [user, causeToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isEditMode ? `/ngo/causes/${causeToEdit.id}` : '/ngo/causes';
        const method = isEditMode ? 'put' : 'post';
        try {
            await api[method](url, {
    ...formData,
    amount_needed: parseFloat(formData.amount_needed),
    category_id: formData.category_id.toString()
}, {
    headers: { Authorization: `Bearer ${user.token}` }
});


            onCauseCreated();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} cause.`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Cause' : 'Create New Cause'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Cause Title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg h-32" required />
                    <input type="number" name="amount_needed" placeholder="Amount Needed ($)" value={formData.amount_needed} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" required>
                        <option value="" disabled>Select a Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600">{isEditMode ? 'Save Changes' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
