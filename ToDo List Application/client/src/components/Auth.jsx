import React, { useState } from "react"
import axios from "axios";

let userID;
function Auth(props) {
    const[isLoggedIn, setIsLoggedIn] = useState(false)
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [err, setErr] = useState("")



    function viewLogin(status) {
        setErr(null)
        setIsLoggedIn(status)
    }

    async function handleSubmit(e, endpoint) {
        e.preventDefault()
        if (!isLoggedIn && password !== confirmPassword) {
            setErr("Confirmation did not match. Please try again!")
        } else {
            const response = await axios.post(`http://localhost:3000/${endpoint}`,{
                email: email,
                password: password
            })
            setErr("")
            if (endpoint === "login") {
                const { id } = response.data;
                userID = id;
                {props.login()}
            } else {
                alert(response.data)
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
            <div className="auth-options">
                <button className="btn btn-light" onClick={() => viewLogin(false)}>Sign Up</button>
                <button className="btn btn-success" onClick={() => viewLogin(true) }>Login</button>

            </div>

        </div>
    )
}

export default Auth
export { userID }