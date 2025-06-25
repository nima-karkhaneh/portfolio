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

    async function handleSubmit(e, endpoint) {
        e.preventDefault()
        if (!isLoggedIn && password !== confirmPassword) {
            setErr("Confirmation did not match. Please try again!")
        } else {
            try {
                const VITE_API_URL = import.meta.env.VITE_API_URL
                const response = await axios.post(`${VITE_API_URL}/${endpoint}`,{
                    email: email,
                    password: password
                }, {
                    withCredentials: true
                })
                if (response.data.error) {
                    const { error } = response.data;
                    setSuccess("")
                    setErr(error)
                }  else if (response.data.success) {
                    setErr("")
                    const { success } = response.data
                    setSuccess(success)
                }  else {
                    window.location = "/"
                }
            }
            catch(err) {
                console.error(err)
            }
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
                />
                <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLoggedIn && <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e, isLoggedIn? "login" : "signup")}
                >SUBMIT</button>
            </form>
            {err && <p>{err}</p>}
            {success && <p>{success}</p>}
            <div className="auth-options">
                <button className="btn btn-light" onClick={() => viewLogin(false)}>Sign Up</button>
                <button className="btn btn-success" onClick={() => viewLogin(true) }>Login</button>

            </div>

        </div>
    )
}

export default Auth