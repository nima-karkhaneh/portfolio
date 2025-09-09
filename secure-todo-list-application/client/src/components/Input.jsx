import { useState } from "react";
import axios from "axios";
import {SUBMIT_URL} from "../api/endpoints.js";



function Input(props) {
    const [inputText, setInputText] = useState("")
    function setItem(e) {
        const { value } = e.target;
        setInputText(value)
    }

async function addItem(e) {
    e.preventDefault();
    if (inputText.trim()) {
        try {
            await axios.post(SUBMIT_URL, {
                description: inputText.trim(),
            }, {
                withCredentials: true
            });
            props.getData();
            setInputText("");
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                alert(backendError);
            } else {
                console.error("Add item error:", err?.message);
                alert("Could not add your todo item. Please try again.");
            }
        }
    } else {
        alert("Please add your Todo Item!");
    }
}

    return(
        <>
        <div className="container">
            <div className="header">
                <h1>Daily ToDo List</h1>
                <button className="btn btn-light" onClick={props.signOut}>Sign out</button>
            </div>
            <p className="mb-5">Welcome, {props.email}</p>
            <form>
                <input className="form-control" type="text" placeholder="Add your ToDo Item" onChange={setItem} value={inputText} />
                <button type="submit" className="btn btn-primary" onClick={addItem}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input