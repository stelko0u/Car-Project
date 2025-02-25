import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";

import { AuthContext, AuthProvider } from "./Context/AuthContext.jsx";
import { Header } from "./components/Header/Header.jsx";
import UserGuard from "./Routes/UserGuard.jsx";

const Layout = () => (
  <>
    <Header />
    <Outlet /> {/* This will render the current page component */}
    {/* <Footer></Footer> */}
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
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

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
