import React, {useState} from "react";


function Edit({item}) {
    const [editItem, setEditItem] = useState(item.description)

    function handleChange(e) {
        const { value } = e.target
        setEditItem(value)
    }
    return(
        <>
            <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${item.id}`}>
                Edit
            </button>

            <div className="modal" id={`id${item.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit your Todo Item</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <input className="form-control" type="text" onChange={handleChange} value={editItem}/>
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