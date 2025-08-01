import React from 'react';
import { User, Mail, Phone, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const ProfileField = ({ icon, label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1 flex items-center">
            <div className="text-gray-400 mr-3">{icon}</div>
            <p className="text-md text-gray-800">{value || 'Not set'}</p>
        </div>
    </div>
);

export function ProfileDashboard() {
    const { user } = useAuth(); // Get user from context

    if (!user) {
        return (
            <div className="text-center p-12">Loading profile...</div>
        );
    }

    // Use placeholder data if specific details aren't in the JWT
    const profileData = {
        name: user.username,
        email: user.email || 'No email provided', // Assuming email might be in your token
        role: user.role,
        avatarUrl: `https://placehold.co/400x400/EBF8FF/3182CE?text=${user.username.charAt(0).toUpperCase()}`,
        profile: {
            firstName: user.username.split(' ')[0],
            lastName: user.username.split(' ').slice(1).join(' ') || '',
            phoneNumber: '+254 712 345 678', // Placeholder
            address: '123 Charity Lane, Nairobi, Kenya' // Placeholder
        }
    };

    return (
        <div className="bg-slate-50 font-sans min-h-screen">
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

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover"
                                        src={profileData.avatarUrl}
                                        alt={profileData.name}
                                    />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
                                    <p className="text-blue-600 font-semibold">{profileData.role}</p>
                                    <p className="text-gray-500 mt-1">{profileData.email}</p>
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
                                <ProfileField icon={<User size={20} />} label="Username" value={profileData.name} />
                                <ProfileField icon={<Mail size={20} />} label="Email Address" value={profileData.email} />
                                <ProfileField icon={<Phone size={20} />} label="Phone Number" value={profileData.profile.phoneNumber} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
