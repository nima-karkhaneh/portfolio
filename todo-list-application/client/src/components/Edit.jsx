import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {TODOS_URL} from "../api/endpoints.js";


function Edit({ item, onUpdate }) {
    const [editItem, setEditItem] = useState(item.description)
    const inputRef = useRef(null);

    useEffect(() => {
        const modalEl = document.getElementById(`id${item.id}`);
        if (!modalEl) return;

        function handleShown() {
            inputRef.current?.focus();
        }

        modalEl.addEventListener("shown.bs.modal", handleShown);

        // Cleanup on unmount
        return () => {
            modalEl.removeEventListener("shown.bs.modal", handleShown);
        };
    }, [item.id]);



    function handleChange(e) {
        const { value } = e.target
        setEditItem(value)
    }
    async function updateItem() {
        try {
            const response = await axios.put(`${TODOS_URL}${item.id}`, {
                description: editItem
            }, {
                withCredentials: true
            });
            onUpdate(item.id, editItem);
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                alert(backendError);
            } else {
                console.error("Update failed:", err?.message); // for debugging
                alert("Something went wrong while updating.");
            }
        }

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
                            <button
                                id={`close-${item.id}`}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={() => setEditItem(item.description)}
                            >
                            </button>
                        </div>

                        <div className="modal-body">
                            <input
                                ref={inputRef}
                                className="form-control"
                                type="text"
                                onChange={handleChange}
                                onFocus={() => setEditItem(item.description)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        updateItem();
                                        document.getElementById(`close-${item.id}`)?.click(); // closes modal
                                        document.activeElement?.blur();
                                    }
                                }}
                                value={editItem}
                            />
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