import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv"

const app =  express()
const PORT = 3000;

env.config();
app.use(cors())
app.use(express.json())

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

// ROUTES

// POST ROUTE
app.post("/submit", async (req, res) => {
    const { description } = req.body;
    console.log(description)
    try{
        await db.query("INSERT INTO items (description) VALUES ($1);", [description])
    }
    catch(err){
        console.error(err.message)
    }

})

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`)
})