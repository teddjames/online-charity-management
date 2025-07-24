import React from "react";
import { Navigate } from "react-router-dom";
import { isDonorLoggedIn } from "../../utils/auth";

export default function PrivateRoute({ children }) {
  if (!isDonorLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
