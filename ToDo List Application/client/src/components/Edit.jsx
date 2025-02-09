import React from "react";


function Edit(props) {
    return(
        <>
            <button type="button" className="btn btn-warning" onClick={props.onEdit} data-bs-toggle="modal" data-bs-target="#myModal">
                Edit
            </button>

            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit your Todo Item</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <input className="form-control" type="text" placeholder="Please edit your item here"/>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal">Submit</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Edit