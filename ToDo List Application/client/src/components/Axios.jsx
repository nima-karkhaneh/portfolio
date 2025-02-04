import React, {useEffect} from "react";
import axios from "axios";

const APIurl = "http://localhost:3000/todos/"

function Axios () {
   useEffect(() =>{
       async function fetchData(){
            try{
                const response = await axios.get(APIurl)
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