import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const user = useSelector((state: any) => state.auth.user);

  const authUser =
    user || JSON.parse(localStorage.getItem("customer") || "null");

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;