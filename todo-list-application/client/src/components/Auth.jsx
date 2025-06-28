import React, { useState } from "react"
import axios from "axios";



function Auth(props) {
    const[isLoggedIn, setIsLoggedIn] = useState(false)
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [err, setErr] = useState("")
    const [success, setSuccess] = useState("")


    function viewLogin(status) {
        setErr("")
        setSuccess("")
        setIsLoggedIn(status)
    }

    function clearError() {
        setErr("")
    }

    async function handleSubmit(e, endpoint) {
        e.preventDefault()
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check for empty fields
        if (!trimmedEmail || !trimmedPassword || (!isLoggedIn && !trimmedConfirmPassword)) {
            setErr("Email, password, and confirm password are required.");
            return;
        }

        // Check email format
        if (!emailRegex.test(trimmedEmail)) {
            setErr("Please enter a valid email address.");
            return;
        }
        // Check for the confirmation password
        if (!isLoggedIn && trimmedPassword !== trimmedConfirmPassword) {
            setErr("Confirmation did not match. Please try again!")
            return;
        }
        try {
            const VITE_API_URL = import.meta.env.VITE_API_URL
            const response = await axios.post(`${VITE_API_URL}/${endpoint}`,{
                email: trimmedEmail,
                password: trimmedPassword
            }, {
                withCredentials: true
            })
            if (response.data.success) {
                setErr("")
                const { success } = response.data
                setSuccess(success)
            }  else {
                window.location = "/"
            }
        }
        catch (err) {
            // Axios error responses from backend come here
            if (err.response && err.response.data && err.response.data.error) {
                setErr(err.response.data.error); // Display backend-specific error message
            } else if (err.message) {
                // Network errors or unexpected errors
                setErr(err.message);
            } else {
                setErr("Something went wrong. Please try again later.");
            }
            setSuccess("");
        }

    }

    return(
        <div className="auth-container">
            <h2>{isLoggedIn? "Please log in": "Please sign up"}</h2>
            <form className="login-form">
                <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={clearError}
                />
                <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={clearError}
                />
                {!isLoggedIn && <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={clearError}
                />}
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e, isLoggedIn? "login" : "signup")}
                >SUBMIT</button>
            </form>
            <div className="message-container">
                {err && <p className="error-message">{err}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
            <div className="auth-options">
                <button className="btn btn-light" onClick={() => viewLogin(false)}>Sign Up</button>
                <button className="btn btn-success" onClick={() => viewLogin(true) }>Login</button>

            </div>

        </div>
    )
}

export default Auth