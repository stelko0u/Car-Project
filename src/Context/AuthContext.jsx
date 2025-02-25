import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // console.log("Auth state changed: ", currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const values = {
    user,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={values}>{!loading && children}</AuthContext.Provider>;
}

export const FireBaseErrors = {
  InvalidEmail: "auth/invalid-email",
  MissingEmail: "auth/missing-email",
  WrongPassword: "auth/wrong-password",
  EmailAlreadyUse: "auth/email-already-in-use",
  TooManyRequests: "auth/too-many-requests",
  UserNotFound: "auth/user-not-found",
};
export const getUserFriendlyMessage = (error) => {
  switch (error) {
    case FireBaseErrors.EmailAlreadyUse:
      return "The email you've selected is already in use!";
    case FireBaseErrors.InvalidEmail:
      return "Your email is invalid!";
    case FireBaseErrors.MissingEmail:
      return "The email field is required!";
    case FireBaseErrors.WrongPassword:
      return "Your email or password is incorrect!";
    case FireBaseErrors.TooManyRequests:
      return "Stop spaming!!!!!";
    case FireBaseErrors.UserNotFound:
      return "Your email or password is incorrect!";
  }
};
