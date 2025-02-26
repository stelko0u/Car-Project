import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { router } from "./Routes/router.jsx";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
