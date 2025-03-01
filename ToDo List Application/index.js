import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv"
import bcrypt from "bcrypt"

const app =  express()
const PORT = 3000;
const saltRounds = 10;

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
    const { description, user_id } = req.body;
    try{
        const addItem = await db.query("INSERT INTO items (description, user_id) VALUES ($1, $2) RETURNING *;", [description, user_id])
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

// SIGN UP ROUTE
app.post("/signup", async (req, res) => {
    const {email, password} = req.body
    try{
        const checkUser = await db.query("SELECT * from users  WHERE email = $1", [email])
        if (checkUser.rows.length > 0){
            res.json({error: "User already exists! Please log in!"})
        }
        else{
            bcrypt.hash(password, saltRounds, async(err, hash) =>{
                if (err) {
                    console.error(err.message)
                }
                else{
                    const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",[email, hash])
                    res.json({success: "User signed up successfully. Please log in!"})
                }
            })
        }
    }
    catch(err){
        console.log(err.message)
    }
})


// LOGIN ROUTE
app.post("/login", async(req, res) =>{
    const {email, password} = req.body
    try{
        const user = await db.query("SELECT * FROM users WHERE email = $1" , [email])
        if (user.rows.length === 0) {
            res.json({error: "Incorrect email, Please sign up first!"})
        } else {
            const storedPassword = user.rows[0].password
            bcrypt.compare(password, storedPassword, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result) {
                        res.json(user.rows[0])
                    } else {
                        res.json({error: "Incorrect Password, please try again!"})
                    }
                }
            })
        }
    }
    catch(err){
        console.log(err.message)
    }
})

