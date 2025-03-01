import { useState } from "react";
import axios from "axios";
import { userID } from "./Auth.jsx";



function Input(props) {
    const [inputText, setInputText] = useState("")
    function setItem(e) {
        const { value } = e.target;
        setInputText(value)
    }

    async function addItem(e) {
        e.preventDefault()
        if (inputText) {
            try{
                // Sending description and userID to db for specific users
                const API_URL_POST = import.meta.env.VITE_API_URL_POST
                await axios.post(API_URL_POST, {
                    description:inputText,
                    user_id:userID
                });
                {props.getData()}
            }
            catch(err){
                console.log(err)
            }

        }
        else{
            alert("Please add your Todo Item!")
        }
    }

    return(
        <>
        <div className="container">
            <div className="header">
                <h1>Daily ToDo List</h1>
                <button className="btn btn-light" onClick={props.signOut}>Sign out</button>
            </div>
            <form>
                <input className="form-control" type="text" placeholder="Add your ToDo Item" onChange={setItem} value={inputText} />
                <button type="submit" className="btn btn-primary" onClick={addItem}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input