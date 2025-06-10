import { useAuth } from "../views/ContextData";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // Optional: Loading fallback
  if (user === null && !isLoggedIn) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is admin, allow access to any page regardless of allowedRoles
  if (user?.role === "Admin") {
    return children;
  }

  // Otherwise, check if user's role is allowed
//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

  return children;
};

export default ProtectedRoute;
