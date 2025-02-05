import {useEffect, useState} from 'react'
import './App.css'
import Input from "./components/Input.jsx"
import ListItems from "./components/ListItems.jsx";
import axios from "axios";


function App() {
    const [items, setItems] = useState([])
    useEffect(() =>{
        async function fetchData(){
            try{
                const response = await axios.get("http://localhost:3000/todos/")
                const data = response.data
                console.log(data)
                setItems(data)
            }
            catch (err){
                console.log(err.message)
            }
        }
        fetchData()
    }, [])

  return (
    <>
        <Input></Input>
        <ul className="container mt-0">
            {items.map(item => {
                return <ListItems key={item.id} text={item.description} />
            })}
        </ul>
    </>
  )
}

export default App
