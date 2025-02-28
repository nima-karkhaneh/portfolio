import React, {useEffect, useState} from 'react'
import './App.css'
import Input from "./components/Input.jsx"
import ListItems from "./components/ListItems.jsx";
import Auth from "./components/Auth.jsx";
import axios from "axios";


function App() {
    const [items, setItems] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(null)


    function authenticate(a) {
       if (!a) {
           setIsAuthenticated(false)
       } else if (a === "login") {
           setIsAuthenticated(true)
       } else {
           setIsAuthenticated(true)
       }
    }

    useEffect(() =>{
        async function fetchData(){
            try{
                const API_URL_GET = import.meta.env.VITE_API_URL_GET
                const response = await axios.get(API_URL_GET)
                const data = response.data
                setItems(data)
            }
            catch (err){
                console.log(err.message)
            }
        }
        fetchData()
    }, [])


    async function deleteItem(id) {
        try{
            const API_URL_DELETE = import.meta.env.VITE_API_URL_DELETE;
            await axios.delete(`${API_URL_DELETE}${id}`)
            setItems(items.filter(item => {
                return item.id !== id
            }))

        }
        catch(err){
            console.log(err.message)
        }

    }

  return (
      <>
          {!isAuthenticated && <Auth login={authenticate} />}
          {isAuthenticated &&
              <div>
                <Input signOut={() => authenticate()} manageAuth={authenticate}/>
                <ul className="container mt-0">
                    {items.map(item => {
                        return <ListItems key={item.id} text={item.description} onDelete={() => deleteItem(item.id)} item={item} />
                    })}
                </ul>
              </div>}
      </>
  )
}

export default App
