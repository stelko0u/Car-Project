import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getUserFriendlyMessage } from "../../Context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
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
    // <div className="flex flex-col bg-blue-700 p-5 text-white w-1/4 rounded-md max-h-screen overflow-auto">

    <div className="flex justify-center items-center overflow-auto" style={{ height: "90vh" }}>
      <div className="flex flex-col bg-blue-800 p-5 text-white w-1/4 rounded-md">
        <h1 className="text-3xl font-bold text-center pb-4">Register</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-3 w-full">
          <span className="h-4 mb-6">
            {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          </span>
          <span>
            <label>Email address:</label>
            <input
              className="p-2 text-xl flex text-black w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              value={email}
            />
          </span>
          <span>
            <label>Password:</label>
            <input
              className="p-2 text-xl flex text-black w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </span>
          <span>
            <label>Confirm password:</label>
            <input
              className="p-2 text-xl flex text-black w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
            />
          </span>
          <p className="text-center text-l">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 font-bold">
              Login
            </Link>
          </p>
          <input
            className="p-2 text-xl bg-white text-blue-700 cursor-pointer hover:bg-slate-400 hover:text-white transition-all duration-500 rounded-sm"
            type="submit"
            value="Register"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
