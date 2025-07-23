import React from 'react';
import { Heart, Target, Users, Eye } from 'lucide-react';

// --- MOCK DATA FOR TEAM MEMBERS ---
const teamMembers = [
    {
        name: 'Jane Doe',
        role: 'Founder & CEO',
        imageUrl: 'https://placehold.co/400x400/EBF8FF/3182CE?text=JD',
        bio: 'Jane is passionate about leveraging technology to create positive social change and has dedicated her career to the non-profit sector.'
    },
    {
        name: 'John Smith',
        role: 'Head of Operations',
        imageUrl: 'https://placehold.co/400x400/EBF8FF/3182CE?text=JS',
        bio: 'John ensures that our platform runs smoothly and that our partner NGOs get the support they need to succeed.'
    },
    {
        name: 'Emily White',
        role: 'Community Manager',
        imageUrl: 'https://placehold.co/400x400/EBF8FF/3182CE?text=EW',
        bio: 'Emily is the bridge between our donors and NGOs, fostering a community built on trust and shared purpose.'
    },
];

const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-center">{children}</p>
    </div>
);

export default function AboutUsPage() {
    return (
        <div className="bg-slate-50 font-sans">
            {/* Page Header with new background image */}
            <header 
                className="relative text-white py-24 sm:py-32 bg-cover bg-center"
                style={{ backgroundImage: `url('https://cdn.discordapp.com/attachments/1395611202104721448/1397275622023233746/68ebf77b-90fb-442f-b7e2-5d5a8bee8972.png?ex=688121d4&is=687fd054&hm=f9144caf3e9f63a00eb9a9609c15134e2cfaeed850dedf1d83e0b0dae7d495c0&')` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>
                        About Us
                    </h1>
                    <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-100" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.6)'}}>
                        We are a passionate team dedicated to connecting generosity with need, creating a world where everyone has the opportunity to thrive.
                    </p>
                </div>
            </header>

            {/* Our Mission & Vision Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="md:pr-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                plsfundme was born from a simple idea: that technology could bridge the gap between those who want to help and the organizations on the front lines of change. Frustrated by the inefficiencies and lack of transparency in traditional charity, our founders set out to create a platform that is direct, impactful, and trustworthy.
                            </p>
                            <p className="text-gray-600">
                                Since our launch, we have empowered hundreds of NGOs and thousands of donors to make a real, measurable difference in communities around the world.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                             <FeatureCard icon={<Target size={32} />} title="Our Mission">
                                To empower non-profit organizations by providing a transparent, efficient, and accessible platform for fundraising, connecting them with a global community of donors.
                            </FeatureCard>
                             <FeatureCard icon={<Eye size={32} />} title="Our Vision">
                                We envision a world where every charitable organization has the resources it needs to fulfill its mission and create lasting positive change.
                            </FeatureCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Team Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
                        <p className="text-lg text-gray-600 mt-2">The dedicated individuals behind our mission.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="bg-white rounded-2xl shadow-md text-center p-8">
                                <img
                                    className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-blue-200"
                                    src={member.imageUrl}
                                    alt={member.name}
                                />
                                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                <p className="text-blue-500 font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600">
                <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Ready to make a difference?
                    </h2>
                    <p className="mt-4 text-lg text-blue-100">
                        Join our community today as a donor or an NGO and start creating change.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <a href="/causes" className="inline-block rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50">
                            Find a Cause
                        </a>
                        <a href="/signup" className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-base font-medium text-white hover:bg-blue-400">
                            Register Your NGO
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
