// src/pages/DonatePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function DonatePage() {
  const { causeId } = useParams();
  const navigate = useNavigate();

  // Simulate authentication check (replace with real logic)
  const isAuthenticated = false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Donate to Cause ID: {causeId}</h1>
      <p>
        This is where your donation form will go. You can fetch cause details
        using the ID.
      </p>
    </div>
  );
}

export default DonatePage;
