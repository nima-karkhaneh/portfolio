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
            await axios.post("http://localhost:3000/submit", {description:inputText});
            window.location = ("/")
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
                <button type="submit" className=" btn btn-primary" onClick={handleClick}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input