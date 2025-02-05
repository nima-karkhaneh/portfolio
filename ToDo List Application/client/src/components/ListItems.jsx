import React from "react";
import Axios from "./Axios.jsx";
import axios from "axios";


function ListItem(props) {
    return(
        <>
            <li>{props.text}</li>
        </>
    )
}

export default ListItem;