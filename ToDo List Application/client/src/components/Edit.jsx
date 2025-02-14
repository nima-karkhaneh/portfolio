import React, {useState} from "react";
import axios from "axios";


function Edit({item}) {
    const [editItem, setEditItem] = useState(item.description)

    function handleChange(e) {
        const { value } = e.target
        setEditItem(value)
    }

    async function updateItem(){
        try{
            const API_URL_PUT=import.meta.env.VITE_API_URL_PUT
            await axios.put(`${API_URL_PUT}${item.id}`,{description:editItem});
            window.location = ("/")
        }
        catch(err){
            console.log(err.message)
        }

    }
    return(
        <>
            <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${item.id}`}>
                Edit
            </button>

            <div className="modal" id={`id${item.id}`} onClick={() => setEditItem(item.description)}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit your Todo Item</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setEditItem(item.description)}></button>
                        </div>

                        <div className="modal-body">
                            <input className="form-control" type="text" onChange={handleChange} value={editItem}/>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={updateItem} data-bs-dismiss="modal">Submit</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Edit