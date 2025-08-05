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
    const cityPattern = /^[A-Za-z\s\-']{2,50}$/;

    if (!cityPattern.test(city)) {
        const errMsg = "Town has to be in Australia";
        return res.status(400).render("index.ejs", {
            errMsg
        })
    }
    const key = process.env.API_KEY
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},AU&appid=${key}&units=metric`);
        const result = response.data;
        const { lon, lat } = result.coord;
        const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const today = new Date().toLocaleDateString("sv-SE"); // Gives "YYYY-MM-DD" in your local time


        const todayTemps = forecastRes.data.list
            .filter(entry => entry.dt_txt.startsWith(today))
            .map(entry => entry.main.temp)
            .slice(0,8);

        const tempMin = Math.min(...todayTemps);
        const tempMax = Math.max(...todayTemps);



        const data = {
            description: result.weather[0].main,
            icon: result.weather[0].icon,
            city: result.name,
            temp: Math.round(result.main.temp),
            tempMin: Math.round(tempMin),
            tempMax: Math.round(tempMax),
            humidity: result.main.humidity
        }
        res.render("index.ejs", data);
    }
    catch (err) {
        let errMsg;

        if (err.response) {
            // The API responded but with an error (e.g., 404 for city not found)
            console.error(`400 | ${err.message}`)
            errMsg = "Town has to be in Australia";
            res.status(400).render("index.ejs", { errMsg });
        } else if (err.request) {
            // The request was made but no response received (e.g., API server down)
            errMsg = "Unable to connect to weather service";
            console.error(`503 | ${err.message}`)
            res.status(503).render("index.ejs", { errMsg });
        } else {
            // Unexpected backend error
            errMsg = "Something went wrong";
            console.error(`500 | Unexpected error:, ${err.message}`);
            res.status(500).render("index.ejs", { errMsg });
        }
    }

})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:${port}/`);
})

