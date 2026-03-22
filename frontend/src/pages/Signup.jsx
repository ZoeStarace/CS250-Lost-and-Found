import "./signup.css";
import { useState } from "react";
import { signup } from "../firebase.js";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="signup-container">
      <form className="signup-form-container" onSubmit={signup}>
        <h1 className="signup-title">Create an account</h1>
        <input
          className="signup-form-input"
          name="firstName"
          type="text"
          placeholder="First Name"
          minLength="1"
          maxLength="20"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="signup-form-input"
          name="lastName"
          type="text"
          placeholder="Last Name"
          minLength="1"
          maxLength="20"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="signup-form-input"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="signup-form-input"
          name="password"
          type="password"
          placeholder="Password"
          minLength="10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="signup-form-input"
          name="confirm-password"
          type="password"
          placeholder="Confirm Password"
          minLength="10"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          className="signup-form-submit"
          type="submit"
          value="Create Account"
        />
        <a className="login-link" href="/login">
          Already have an account? Log in here.
        </a>
      </form>
    </div>
  );
}
