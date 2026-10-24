
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedTOARoute = () => {
  const token = localStorage.getItem("toa_tp_token");

  if (!token) {
    return <Navigate to="/toa" replace />;
  }

  return <Outlet />;
};

export default ProtectedTOARoute;
