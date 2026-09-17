import Login from "./pages/login";
import Register from "./pages/register";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";
import ServerError from "./pages/ServerError";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, backendOffline } = useAuth();
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#181b22] text-sm text-[#9da4b2]">Loading your workspace...</main>;
  if (backendOffline) return <ServerError />;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading, backendOffline } = useAuth();
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#181b22] text-sm text-[#9da4b2]">Loading...</main>;
  if (backendOffline) return <ServerError />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
  <Routes>
    {/* Public routes */}
    <Route path="/signin" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/500" element={<ServerError />} />

    {/* Protected routes */}
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

    {/* Default route */}
    <Route path="/" element={<Navigate to="/signin" replace />} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  );
}

export default App;
