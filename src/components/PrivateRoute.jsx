import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useFakeLogin from "../hooks/useFakeLogin";
 
export const PrivateRoute = () => {
  const { authCokie } = useFakeLogin();
  return authCokie ? <Outlet /> : <Navigate to="/" />;
};