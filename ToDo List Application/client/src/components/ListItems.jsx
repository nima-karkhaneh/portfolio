import React from "react";



function ListItem(props) {
    return(
        <>
            <div className="list-cont container mt-5">
                <li>{props.text}</li>
                <div className="btn-cont">
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-danger" onClick={props.onDelete}>Delete</button>
                </div>
            </div>
        </>
    )
}

export default ListItem;