import React, { useState } from "react"

function Auth() {
    const[isLoggedIn, setIsLoggedIn] = useState(true)
    const [err, setErr] = useState(null)

    function viewLogin(status) {
        setErr(null)
        setIsLoggedIn(status)
    }
    return(
        <div className="auth-container">
            <h2>{isLoggedIn? "Please log in": "Please sign up"}</h2>
            <form className="login-form">
                <input className="form-control" type="email" placeholder="Email"/>
                <input className="form-control" type="password" placeholder="Password"/>
                {!isLoggedIn && <input className="form-control" type="text" placeholder="Confirm your password"/>}
                <button className="btn btn-primary" type="submit">SUBMIT</button>
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