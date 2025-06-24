import React from "react";
import Edit from "./Edit.jsx"


function ListItem(props) {
    return(
        <>
            <div className="list-cont container mt-5">
                <li>{props.text}</li>
                <div className="btn-cont">
                    <Edit item={props.item} onUpdate={props.onUpdate} />
                    <button className="btn btn-danger" onClick={props.onDelete}>Delete</button>
                </div>
            </div>
        </>
    )
}

export default ListItem;