import React, {useEffect} from "react";
import axios from "axios";


function Axios () {
   useEffect(() =>{
       async function fetchData(){
            try{
                const response = await axios.get("http://localhost:3000/todos/")
                const data = response.data
                console.log(data)
            }
            catch (err){
                console.log(err.message)
            }
       }
       fetchData()
   }, [])
}

export default Axios