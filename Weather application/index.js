import express from "express";
import axios from "axios";
import env from "dotenv"

const app = express();
env.config();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.get("/", (req,res) => {
        res.render("index.ejs" , {})
})

app.post("/submit", async (req, res) =>{
    const city = req.body.city;
    const key = process.env.API_KEY
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},AU&appid=${key}&units=metric`);
        const result = response.data;
        const data = {
            description: result.weather[0].main,
            icon: result.weather[0].icon,
            city: result.name,
            temp: Math.round(result.main.temp),
            tempMin: Math.floor(result.main.temp_min),
            tempMax: Math.round(result.main.temp_max),
            humidity: result.main.humidity
        }
        res.render("index.ejs", data);
    }
    catch(err){
        const errMsg = "Town has to be in Australia";
        console.log(`Failed to fetch data, ${err.message}`)
        res.render("index.ejs",{
            errMsg: errMsg
        })
    }
})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:${port}/`);
})

