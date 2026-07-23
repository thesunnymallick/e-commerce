import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const token = useSelector((state: any) => state.auth.token);

  // Fallback to localStorage after page refresh
  const authToken = token || localStorage.getItem("token");

  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;