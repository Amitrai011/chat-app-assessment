import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/Login.module.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserProvider";
import Loader from "./Loader";

const Login = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Invalid email or password");
      return;
    }

    try {
      setShowLoader(true);
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoader(false);
      navigate("/");
    } catch (err) {
      setShowLoader(false);
      toast.error("Invalid email or password");
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <button type="submit">Login</button>
      </form>
      {showLoader && <Loader />}
      <Link to="/register">
        Don't have an account{" "}
        <strong style={{ color: "#3942a4" }}>Register?</strong>
      </Link>
    </div>
  );
};

export default Login;
