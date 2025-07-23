import React, { useState } from "react";
import { useParams } from "react-router-dom";

const DonationForm = () => {
  const { id: causeId } = useParams();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MPESA");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You donated ${amount} via ${paymentMethod} to cause ${causeId}`);
    // TODO: Send donation to backend
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Make a Donation</h2>
      <p className="mb-4 text-sm text-gray-500">Cause ID: {causeId}</p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Amount (KES):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border mt-1"
            required
          />
        </label>
        <label className="block mb-4">
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border mt-1"
          >
            <option value="MPESA">MPESA</option>
            <option value="Card">Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
