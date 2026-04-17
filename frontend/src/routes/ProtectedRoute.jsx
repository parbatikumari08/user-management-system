import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>;
  }
  
  if (!user || !user.token) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;