// routes.js
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import { Header } from "../components/Header/Header.jsx";
import UserGuard from "./UserGuard.jsx";
import About from "../pages/About/About.jsx";
import Catalog from "../pages/Catalog/Catalog.jsx";
import CarForm from "../pages/CarFom/CarForm.jsx";
import bg from "../../public/bg.jpg";
import Details from "../pages/Details/Details.jsx";
export const Layout = () => {
  const outletStyle = {
    backgroundImage: `url(${bg})`, // Use the imported image directly
    backgroundSize: "cover", // Adjust as needed
    backgroundPosition: "center",
    minHeight: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column", // Flex properties help in aligning content
  };

  return (
    <>
      <Header />
      <div style={outletStyle}>
        <Outlet />
      </div>
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/add", element: <CarForm /> },
      { path: "/details/:id", element: <Details /> },
      {
        element: <UserGuard />,
        children: [
          { path: "/register", element: <Register /> },
          { path: "/login", element: <Login /> },
        ],
      },
    ],
  },
]);
