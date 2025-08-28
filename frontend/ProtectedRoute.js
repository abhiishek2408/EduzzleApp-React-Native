import React from "react";
import { Navigate } from "react-router-dom";

const getToken = () => localStorage.getItem("token");

export default function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
