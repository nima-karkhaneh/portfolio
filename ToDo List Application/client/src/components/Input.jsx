import React, {useState} from "react";
import axios from "axios";

function Input() {
    const [inputText, setInputText] = useState("")
    function handleChange(e) {
        const {value} = e.target;
        setInputText(value)
    }
    async function handleClick(e) {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3000/submit", {description:inputText});
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }
    return(
        <>
        <div className="container">
            <h1>Daily ToDo List</h1>
            <form>
                <input className="form-control" type="text" placeholder="Add your ToDo Item" onChange={handleChange} value={inputText}/>
                <button type="submit" className="btn btn-outline-secondary" onClick={handleClick}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input