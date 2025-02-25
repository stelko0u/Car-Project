import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const UserGuard = ({ redirectPath = "/" }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // или спинер, ако предпочиташ
  }

  // Ако потребителят е вече ауторизиран, редиректваме го към началната страница
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Ако потребителят не е ауторизиран, рендираме децата
  return <Outlet />;
};

export default UserGuard;
