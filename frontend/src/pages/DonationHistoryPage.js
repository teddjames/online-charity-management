import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DonationHistoryPage() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user?.token) return;
            try {
                setLoading(true);
                const response = await api.get('/donors/my-donations', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setDonations(response.data);
            } catch (err) {
                setError('Failed to load donation history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [user]);

    return (
        <div className="bg-slate-50 font-sans min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        My Donation History
                    </h1>
                    <p className="mt-1 text-md text-gray-600">
                        A complete record of your generous contributions.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Cause Title</th>
                                    <th scope="col" className="px-6 py-3">NGO</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-12">Loading history...</td></tr>
                                ) : donations.length > 0 ? donations.map(donation => (
                                    <tr key={donation.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{donation.donation_request?.title || 'N/A'}</td>
                                        <td className="px-6 py-4">{donation.donation_request?.ngo?.organization_name || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold text-green-600">${donation.amount_donated.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(donation.created_at).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-12 text-gray-500">No donations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
