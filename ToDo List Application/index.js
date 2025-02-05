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

// API ROUTES

// GET ROUTE
app.get("/todos", async (req, res) => {
    try{
        const item = await db.query("SELECT * FROM items ORDER BY id ASC")
        res.json(item.rows)
    }
    catch(err){
        console.error(err.message)
    }
})

// POST ROUTE
app.post("/submit", async (req, res) => {
    const { description } = req.body;
    try{
         const addItem = await db.query("INSERT INTO items (description) VALUES ($1) RETURNING *;", [description])
        res.json(addItem.rows[0])
    }
    catch(err){
        console.error(err.message)
    }

})

// GET A SPECIFIC ITEM
app.get("/todos/:id", async (req, res) => {
    try{
        const { id }= req.params
        const selectedItem = await db.query("SELECT * FROM items WHERE id = ($1);", [id])
        res.json(selectedItem.rows)
    }
    catch(err){
        console.error(err.message)
    }
})

// UPDATE AN ITEM
app.put("/todos/:id", async (req, res) => {
    try{
        const { description } = req.body
        const { id } = req.params
        const selectedItem = await db.query("UPDATE items SET description = ($1) WHERE id = ($2)", [description, id]);
        res.json("Item has been updated successfully!")
    }
    catch(err){
        console.error(err)
    }
})

// DELETE AN ITEM
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const deletedItem = await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    res.json("Item was deleted!")
})

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`)
})