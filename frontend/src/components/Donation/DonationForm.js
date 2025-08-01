import React from 'react';
import { useParams } from 'react-router-dom';

// This is a placeholder for the Donation Form component.
const DonationForm = () => {
    const { id } = useParams(); // Gets the cause ID from the URL

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold">Donate to Cause</h1>
            <p className="mt-2 text-gray-600">You are donating to cause ID: {id}</p>
            <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold">Donation Form Placeholder</h2>
                <p className="mt-4">
                    This is where the form to enter a donation amount and payment details will go.
                </p>
            </div>
        </div>
    );
};

export default DonationForm;
