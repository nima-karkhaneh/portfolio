import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

const app =  express()
const PORT = 3000;
const saltRounds = 10;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

env.config();
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

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
app.get("/todos", authorise, async (req, res) => {
    try{
        const items = await db.query("SELECT description, items.id FROM items JOIN users ON users.id = items.user_id WHERE user_id = $1;", [req.user.id])
        res.json(items.rows)
    }
    catch(err){
        console.error(err.message)
    }
})

// POST ROUTE
app.post("/submit", async (req, res) => {
    const { description, userID } = req.body;
    try{
        const addItem = await db.query("INSERT INTO items (description, user_id) VALUES ($1, $2) RETURNING *;", [description, userID])
        res.json(addItem.rows[0])
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



// SIGN UP ROUTE
app.post("/signup", async (req, res) => {
    const {email, password} = req.body
    try{
        const checkUser = await db.query("SELECT * from users  WHERE email = $1", [email])
        if (checkUser.rows.length > 0){
            res.json({error: "User already exists, please log in!"})
        }
        else{
            bcrypt.hash(password, saltRounds, async(err, hash) =>{
                if (err) {
                    console.error(err.message)
                }
                else{
                    const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",[email, hash])
                    res.json({success: "User signed up successfully, please log in!"})
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
            res.json({error: "User not found, please sign up first!"})
        } else {
            const currentUser = user.rows[0]
            const currentUserStoredPassword = user.rows[0].password
            bcrypt.compare(password, currentUserStoredPassword, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (result) {
                        const token = jwt.sign( currentUser , process.env.JWT_SECRET, { expiresIn: "1hr" })
                        res.cookie("authToken", token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 60 * 60 * 1000,
                        });
                        res.status(200).send("Authentication successful!")
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

// VERIFY MIDDLEWARE AND ROUTE

    function authorise(req, res, next) {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(403).json('No token found!');
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send('Invalid or expired token');
            }
            req.user = decoded;
            next()
        })
    }

app.get("/verify", authorise, (req, res) => {
        res.json({email: req.user.email, id: req.user.id})
})


// SIGN OUT ROUTE

app.post("/signout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    })
    res.status(200).json({message: "successful logout"})
})




app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`)
})