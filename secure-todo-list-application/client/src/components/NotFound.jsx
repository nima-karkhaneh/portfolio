import React from "react";
import { Link } from "react-router-dom";


function NotFound() {
    return(
        <div id="page-404">
            <h1>404</h1>
            <p className="not-found-text">The page you are looking for does not exists.</p>
            <Link to="/">Back to home</Link>
        </div>
    )
}

export default NotFound;