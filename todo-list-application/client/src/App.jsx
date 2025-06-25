import React, {useEffect, useState} from 'react'
import './App.css'
import Input from "./components/Input.jsx"
import ListItems from "./components/ListItems.jsx";
import Auth from "./components/Auth.jsx";
import axios from "axios";



function App() {
    const [items, setItems] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false )
    const [email, setEmail] = useState("")


    async function manageAuth() {
            try{
                const VITE_API_URL_VERIFY = import.meta.env.VITE_API_URL_VERIFY
                const response = await axios.get(VITE_API_URL_VERIFY, {
                    withCredentials: true
                })
                response.data && setIsAuthenticated(true)
                setEmail(response.data.email)
            }
            catch (err) {
                console.error(err.message)
            }
    }

    useEffect(() => {
        manageAuth()
    }, [])


    async function fetchData(){
        try{
            const API_URL_GET = import.meta.env.VITE_API_URL_GET
            const response = await axios.get(`${API_URL_GET}`, {
                withCredentials: true
            })
            const data = response.data
            setItems(data)
        }
        catch (err){
            console.error(err.message)
        }
    }
  useEffect(() => {
      fetchData()
  },[])

    function updateItemInState (id, newDescription) {
       setItems(prevItems =>
           prevItems.map(item =>
            item.id === id ? { ...item, description: newDescription } : item
           )
       )
    }


    async function deleteItem(id) {
        try{
            const API_URL_DELETE = import.meta.env.VITE_API_URL_DELETE;
            await axios.delete(`${API_URL_DELETE}${id}`, {
                withCredentials: true
            });
            setItems(items.filter(item => {
                return item.id !== id
            }))
        }
        catch(err){
            console.log(err.message)
        }

    }

    async function signOut() {
        try{
            const VITE_API_URL_SIGNOUT = import.meta.env.VITE_API_URL_SIGNOUT
            const response = await axios.post(VITE_API_URL_SIGNOUT, {
            }, {
                withCredentials: true
            })
            window.location = "/"
        }
        catch (err) {
            console.error(err.message)
        }
    }

  return (
      <>
          {!isAuthenticated && <Auth />}
          {isAuthenticated &&
              <div>
                  <Input
                      getData={fetchData}
                      signOut={() => signOut()}
                      email={email}
                  />
                <ul className="container mt-0">
                    {items.map(item => {
                        return <ListItems
                            key={item.id}
                            text={item.description}
                            onDelete={() => deleteItem(item.id)}
                            item={item}
                            onUpdate={updateItemInState}
                        />
                    })}
                </ul>
              </div>}
      </>
  )
}

export default App
