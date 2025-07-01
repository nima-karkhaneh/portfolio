import React, {useEffect, useState} from 'react'
import './App.css'
import Input from "./components/Input.jsx"
import ListItems from "./components/ListItems.jsx";
import Auth from "./components/Auth.jsx";
import axios from "axios";
import { TODOS_URL, VERIFY_URL, SIGNOUT_URL } from "./api/endpoints";




function App() {
    const [items, setItems] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false )
    const [email, setEmail] = useState("")


    async function manageAuth() {
            try{
                const response = await axios.get(VERIFY_URL, {
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
            const response = await axios.get(`${TODOS_URL}`, {
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
            await axios.delete(`${TODOS_URL}${id}`, {
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
            const response = await axios.post(SIGNOUT_URL, {
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
