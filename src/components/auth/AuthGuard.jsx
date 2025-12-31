import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const { authUser, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
