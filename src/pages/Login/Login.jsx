import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = getUserFriendlyMessage(error.code);
        setError(errorMessage);
      });
  }
  return (
    <div className="flex justify-center items-center overflow-hidden h-screen ">
      <div className="flex flex-col bg-car-600 p-5 text-white lg:w-1/4 rounded-md">
        <h1 className="text-3xl font-bold text-center pb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
          <span className="h-4 mb-6">
            {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          </span>
          <span>
            <label>Email address:</label>
            <input
              className="p-2 text-xl flex text-black bg-white w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              value={email}
            />
          </span>
          <span>
            <label>Password:</label>
            <input
              className="p-2 text-xl flex text-black bg-white w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </span>

          <p className="text-center text-l">
            I don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-bold">
              Register
            </Link>
          </p>
          <input
            className="p-2 text-xl bg-white text-car-700 font-bold cursor-pointer hover:bg-slate-400 hover:text-white transition-all duration-500 rounded-sm"
            type="submit"
            value="Login"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
