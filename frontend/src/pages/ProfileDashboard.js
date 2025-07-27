import React from 'react';
import { User, Mail, Phone, Edit, Shield } from 'lucide-react';

// Mock user data - in a real app, this would come from your state management (Redux)
const userData = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Donor', // Could be 'Donor' or 'NGO'
    avatarUrl: 'https://placehold.co/400x400/EBF8FF/3182CE?text=JD',
    profile: {
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '+254 712 345 678',
        address: '123 Charity Lane, Nairobi, Kenya'
    }
};

const ProfileField = ({ icon, label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1 flex items-center">
            <div className="text-gray-400 mr-3">{icon}</div>
            <p className="text-md text-gray-800">{value}</p>
        </div>
    </div>
);

// Changed from 'export default' to a named 'export'
export function ProfileDashboard() {
    return (
        <div className="bg-slate-50 font-sans min-h-screen">
            {/* Page Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        My Profile
                    </h1>
                    <p className="mt-1 text-md text-gray-600">
                        View and manage your personal information and settings.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover"
                                        src={userData.avatarUrl}
                                        alt={userData.name}
                                    />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-gray-800">{userData.name}</h2>
                                    <p className="text-blue-600 font-semibold">{userData.role}</p>
                                    <p className="text-gray-500 mt-1">{userData.email}</p>
                                    <button className="mt-4 inline-flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-8 py-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <ProfileField icon={<User size={20} />} label="First Name" value={userData.profile.firstName} />
                                <ProfileField icon={<User size={20} />} label="Last Name" value={userData.profile.lastName} />
                                <ProfileField icon={<Mail size={20} />} label="Email Address" value={userData.email} />
                                <ProfileField icon={<Phone size={20} />} label="Phone Number" value={userData.profile.phoneNumber} />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-8 py-6">
                             <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Change Password</h4>
                                        <p className="text-sm text-gray-500">It's a good idea to use a strong password that you're not using elsewhere.</p>
                                    </div>
                                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change</button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                                    </div>
                                    <button className="text-sm font-semibold text-blue-600 hover:underline">Enable</button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
