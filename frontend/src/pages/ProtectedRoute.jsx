import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
