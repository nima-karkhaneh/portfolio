import { useState } from 'react'
import './App.css'
import Input from "./components/Input.jsx"
import ListItems from "./components/ListItems.jsx";
import  Getdata from "./components/Axios.jsx";

function App() {
  return (
    <>
        <Getdata />
        <Input></Input>
        <ul className="container mt-0">
            <ListItems></ListItems>
        </ul>
    </>
  )
}

export default App
