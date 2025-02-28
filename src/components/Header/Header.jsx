import { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getAuth, signOut } from "firebase/auth";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const auth = getAuth();

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await signOut(auth);
      setIsOpen(false); // Затваряне на менюто след излизане
    } catch (error) {
      console.log(error);
    }
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="bg-car-500 text-white p-3">
      <div className="flex justify-between">
        <nav className="hidden md:flex space-x-3 flex justify-between w-full">
          <h1 className="text-xl font-bold">CarDeals</h1>
          <span className="flex justify-between space-x-3">
            <Link to="/" className="hover:mt-0.5">
              Home
            </Link>
            <Link to="/about" className="hover:mt-0.5">
              About
            </Link>
            <Link to="/catalog" className="hover:mt-0.5">
              Catalog
            </Link>
            <Link to="/services" className="hover:mt-0.5">
              Services
            </Link>
            <Link to="/contact" className="hover:mt-0.5">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/add" className="hover:mt-0.5">
                Add car
              </Link>
            )}
          </span>
          <span className="flex justify-between space-x-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:mt-0.5">
                  Login
                </Link>
                <Link to="/register" className="hover:mt-0.5">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="hover:mt-0.5">
                Logout
              </button>
            )}
          </span>
        </nav>

        <span className="md:hidden p-1 flex justify-between items-center w-screen">
          <h1 className="text-xl font-bold">AutoCar</h1>
          <button className="md:hidden p-1 " onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </span>
      </div>

      {isOpen && (
        <nav className="md:hidden p-4 flex flex-col space-y-2 items-start">
          <Link to="/" className="hover:ml-2" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/about" className="hover:ml-2" onClick={closeMenu}>
            About
          </Link>
          <Link to="/catalog" className="hover:ml-2" onClick={closeMenu}>
            Catalog
          </Link>
          <Link to="/services" className="hover:ml-2" onClick={closeMenu}>
            Services
          </Link>
          <Link to="/contact" className="hover:ml-2" onClick={closeMenu}>
            Contact
          </Link>
          {isAuthenticated && (
            <Link to="/add" className="hover:ml-2" onClick={closeMenu}>
              Add car
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:ml-2" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="hover:ml-2" onClick={closeMenu}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="hover:ml-2">
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
};
