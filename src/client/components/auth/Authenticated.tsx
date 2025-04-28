import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthProvider";

export default function Authenticated() {
    const { isAuthenticated, loading } = useAuth();
	console.log(loading);
	console.log(isAuthenticated);
	if (loading) return <h1>Cargando...</h1>;
    if (!isAuthenticated) return <Navigate to="/" />;
    return <Outlet />;
}
