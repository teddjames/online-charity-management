import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const InfoCard = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <div className="text-gray-600">{children}</div>
    </div>
);

export default function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="bg-slate-50 font-sans">
            {/* Page Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Get In Touch
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        We'd love to hear from you. Please reach out with any questions or inquiries.
                    </p>
                </div>
            </header>

            {/* Contact Info Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoCard icon={<Mail size={32} />} title="Email Us">
                            <p>For general inquiries:</p>
                            <a href="mailto:info@plsfundme.com" className="text-blue-600 hover:underline">info@plsfundme.com</a>
                        </InfoCard>
                        <InfoCard icon={<Phone size={32} />} title="Call Us">
                            <p>Our support team is available Mon-Fri, 9am-5pm.</p>
                            <a href="tel:+254700000000" className="text-blue-600 hover:underline">+254 700 000 000</a>
                        </InfoCard>
                        <InfoCard icon={<MapPin size={32} />} title="Our Office">
                            <p>123 Charity Lane,</p>
                            <p>Nairobi, Kenya</p>
                        </InfoCard>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" required className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea id="message" name="message" rows="6" required className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-600/50 transform hover:-translate-y-0.5">
                                    <Send size={20} />
                                    <span>Send Message</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
