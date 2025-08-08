import express from "express";
import axios from "axios";
import env from "dotenv";
import favicon from "serve-favicon";
import path from "path";

const app = express();
env.config();
const port = process.env.PORT || 3000;


app.use(favicon(path.resolve("public/images/favicon.ico")));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.get("/", (req,res) => {
        res.render("index.ejs" , {})
})


app.post("/submit", async (req, res) => {
    const city = req.body.city;
    const cityPattern = /^[A-Za-z\s\-']{2,50}$/;

    if (!cityPattern.test(city)) {
        const errMsg = "Town has to be in Australia";
        return res.status(400).render("index.ejs", { errMsg });
    }

    const key = process.env.API_KEY;

    try {
        // 1. Get current weather
        const currentRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},AU&appid=${key}&units=metric`
        );
        const result = currentRes.data;
        const { lon, lat } = result.coord;

        // 2. Get 5-day / 3-hour forecast
        const forecastRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
        );
        const forecastData = forecastRes.data;
        const timezoneOffset = forecastData.city.timezone; // in seconds

        // 3. Current UTC time & cutoff UTC (24h ahead)
        const nowUtc = new Date();
        const cutoffUtc = new Date(nowUtc.getTime() + 24 * 60 * 60 * 1000);

        // Helper: format Date with offset (in seconds) to local-like string (yyyy-mm-dd hh:mm:ss)
        function formatWithOffset(date, offsetSeconds) {
            const localTimestamp = date.getTime() + offsetSeconds * 1000;
            const localDate = new Date(localTimestamp);

            const pad = n => n.toString().padStart(2, "0");

            return `${localDate.getUTCFullYear()}-${pad(localDate.getUTCMonth() + 1)}-${pad(localDate.getUTCDate())} ` +
                `${pad(localDate.getUTCHours())}:${pad(localDate.getUTCMinutes())}:${pad(localDate.getUTCSeconds())}`;
        }


        // Filter forecast entries for next 24h by UTC time
        const next24hTemps = forecastData.list
            .filter(entry => {
                const entryUtc = new Date(entry.dt_txt + "Z");
                return entryUtc > nowUtc && entryUtc <= cutoffUtc;
            })
            .map(entry => entry.main.temp);

        if (process.env.NODE_ENV !== "production") {
            console.log(`Timezone offset (seconds): ${timezoneOffset}`);
            console.log(`UTC Now: ${nowUtc.toISOString()}`);
            console.log(`Local Now: ${formatWithOffset(nowUtc, timezoneOffset)}`);
            console.log(`Cutoff (24h UTC): ${cutoffUtc.toISOString()}`);
            console.log(`Cutoff (24h local): ${formatWithOffset(cutoffUtc, timezoneOffset)}`);

            console.log("Forecast entries for next 24h (local time):");
            forecastData.list.forEach(entry => {
                const entryUtc = new Date(entry.dt_txt + "Z");
                if (entryUtc > nowUtc && entryUtc <= cutoffUtc) {
                    console.log(`→ ${entry.dt_txt} UTC → ${formatWithOffset(entryUtc, timezoneOffset)} local → ${entry.main.temp}°C`);
                }
            });
        }


        // Calculate temp range: current + forecast
        const allTemps = [result.main.temp, ...next24hTemps];
        const tempMin = Math.min(...allTemps);
        const tempMax = Math.max(...allTemps);

        // Final data object for rendering
        const data = {
            description: result.weather[0].main,
            icon: result.weather[0].icon,
            city: result.name,
            temp: Math.round(result.main.temp),
            tempMin: Math.round(tempMin),
            tempMax: Math.round(tempMax),
            humidity: result.main.humidity
        };

        res.render("index.ejs", data);

    } catch (err) {
        let errMsg;

        if (err.response) {
            console.error(`400 | ${err.message}`);
            errMsg = "Town has to be in Australia";
            res.status(400).render("index.ejs", { errMsg });
        } else if (err.request) {
            console.error(`503 | ${err.message}`);
            errMsg = "Unable to connect to weather service";
            res.status(503).render("index.ejs", { errMsg });
        } else {
            console.error(`500 | Unexpected error: ${err.message}`);
            errMsg = "Something went wrong";
            res.status(500).render("index.ejs", { errMsg });
        }
    }
});


// catch-all middleware

app.use((req, res) => {
    res.status(404).render("404.ejs")
})


if (process.env.NODE_ENV !== 'production') {
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running at http://localhost:${port}`);
    });
} else {
    app.listen(port);
}
