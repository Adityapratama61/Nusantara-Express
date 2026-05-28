import { Navigate, Outlet } from "react-router-dom";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "staff") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
