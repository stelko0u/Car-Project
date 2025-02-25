import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Context/AuthContext.jsx";

export const Protected = ({ children }) => {
  const { user } = useContext(Context);
  console.log(user);

  if (!user) {
    return <Navigate to="/register" />;
  }
  return <>{children}</>;
};
