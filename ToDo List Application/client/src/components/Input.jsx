import React, {useState} from "react";

function Input() {
    const [description, setDescription] = useState("")
    function handleChange(e) {
        const {value} = e.target;
        setDescription(value)
    }

    async function handleClick(e) {
        e.preventDefault();
    }
    return(
        <>
        <div className="container">
            <h1>Daily ToDo List</h1>
            <form>
                <input className="form-control" type="text" placeholder="Add your ToDo Item" onChange={handleChange} value={description}/>
                <button type="submit" className="btn btn-outline-secondary" onClick={handleClick}>Add</button>
            </form>
        </div>
        </>
    )
}

export default Input