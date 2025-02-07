import React, {useState} from "react";
import axios from "axios";


function Input(props) {
    const [inputText, setInputText] = useState("")
    function handleChange(e) {
        const {value} = e.target;
        setInputText(value)
    }

    async function handleCLick() {
        console.log("Items will be added")
        if (!inputText) {
            alert("ToDo item cannot be empty!")
        }
        else {
            try{
                const API_URL_POST = import.meta.env.VITE_API_URL_POST
                await axios.post(API_URL_POST, {description:inputText});
            }
            catch(err){
                console.log(err)
            }
        }
    }
    return(
        <>
        <div className="container">
            <h1>Daily ToDo List</h1>
            <form>
                <input className="form-control" type="text" placeholder="Add your ToDo Item" onChange={handleChange} value={inputText} />
                <button className="btn btn-primary" onClick={handleCLick}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input