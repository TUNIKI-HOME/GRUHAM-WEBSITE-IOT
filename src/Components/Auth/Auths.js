import React, { useState } from "react";
import styles from "../HomeCSS/SignInUp.module.css";
import { auth } from "../Firebase/Firebase"; // Import the auth instance from Firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Auth = () => {
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For sign-up

  const navigate = useNavigate(); // Initialize the navigate function

  const toggleForm = () => {
    setIsLoginActive((prevState) => !prevState);
  };

  const handleSignUp = async () => {
    try {
      // Firebase sign-up function
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Sign-up successful!");
      navigate("/home"); // Redirect to home page after successful sign-up
    } catch (error) {
      toast.error(error.message); // Show error message
    }
  };

  const handleLogin = async () => {
    try {
      // Firebase sign-in function
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/home"); // Redirect to home page after successful login
    } catch (error) {
      toast.error(error.message); // Show error message
    }
  };

  return (
    <>
  <div className={styles.Authpage}>
    <div className={styles.formStructor}>
      {/* SignUp Form */}
      <div className={`${styles.signup} ${isLoginActive ? styles.slideUp : ""}`}>
        <h2 className={styles.formTitle} onClick={toggleForm}>
          <span> Sign up</span>
        </h2>
        <div className={styles.formHolder}>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.submitBtn} onClick={handleSignUp}>
          Sign up
        </button>
      </div>

      {/* Login Form */}
      <div className={`${styles.login} ${!isLoginActive ? styles.slideUp : ""}`}>
        <div className={styles.center}>
          <h2 className={styles.formTitle} onClick={toggleForm}>
            <span> Log in </span>
          </h2>
          <div className={styles.formHolder}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={styles.submitBtn} onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  </div>
    </>
  );
};

export default Auth;
