import React, { useState } from "react";
import axios from "axios";

function Auth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function clearMessages() {
        setErr("");
        setSuccess("");
    }

    function viewLogin(status) {
        clearMessages();
        setIsLoggedIn(status);
    }

    async function handleSubmit(e, endpoint) {
        e.preventDefault();
        if (isSubmitting) return;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedEmail || !trimmedPassword || (!isLoggedIn && !trimmedConfirmPassword)) {
            setErr("Email, password, and confirm password are required.");
            return;
        }

        if (!emailRegex.test(trimmedEmail)) {
            setErr("Please enter a valid email address.");
            return;
        }

        if (!isLoggedIn && trimmedPassword !== trimmedConfirmPassword) {
            setErr("Confirmation did not match. Please try again!");
            return;
        }

        try {
            setIsSubmitting(true);
            const VITE_API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(
                `${VITE_API_URL}/${endpoint}`,
                { email: trimmedEmail, password: trimmedPassword },
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccess(response.data.success);
                setErr("");
            } else {
                window.location = "/";
            }
        } catch (err) {
            const errorMsg = err?.response?.data?.error || err.message || "Something went wrong. Please try again.";
            setErr(errorMsg);
            setSuccess("");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-container">
            <h2>{isLoggedIn ? "Please Log In" : "Please Sign Up"}</h2>
            <div className="container my-5 mt-0" style={{ maxWidth: "400px" }}>
                <form
                    className="login-form"
                    onSubmit={(e) => handleSubmit(e, isLoggedIn ? "login" : "signup")}
                >
                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={clearMessages}
                        value={email}
                    />
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={clearMessages}
                        value={password}
                    />
                    {!isLoggedIn ? (
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Confirm your password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={clearMessages}
                            value={confirmPassword}
                        />
                    ) : (
                        <div style={{ height: "38px" }}></div>
                    )}
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    style={{ borderWidth: "2px" }}
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Loading...</span>
                            </>
                        ) : (
                            "SUBMIT"
                        )}
                    </button>
                    <div className="auth-options">
                        <button
                            type="button"
                            className={`btn ${!isLoggedIn ? "btn-success" : "btn-light"}`}
                            onClick={() => viewLogin(false)}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className={`btn ${isLoggedIn ? "btn-success" : "btn-light"}`}
                            onClick={() => viewLogin(true)}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="message-container">
                {err && <p className="error-message">{err}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
}

export default Auth;
