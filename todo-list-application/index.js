import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { validateDescription, validateSignupInput, validateLoginInput, validateId } from "./utils/validators.js";


const app =  express()
const port = process.env.PORT || 3000;
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
    const userID = req.user.id
    try{
        const items = await db.query("SELECT description, id FROM items WHERE user_id = $1;", [userID])
        res.status(200).json(items.rows)
    }
    catch(err){
        console.error("Error fetching todos:", err.message)
        res.status(500).json({ error: "Server error. Please try again later." })
    }
})

// POST ROUTE
app.post("/submit", authorise,async (req, res) => {
    const { description } = req.body
    const userID = req.user.id
    const { error, cleaned } = validateDescription(description)
    if (error) return res.status(400).json({ error })
    try{
        const addItem = await db.query("INSERT INTO items (description, user_id) VALUES ($1, $2) RETURNING *;", [cleaned, userID])
        res.status(201).json(addItem.rows[0])
    }
    catch(err){
        console.error("Error inserting todo item:", err.message)
        res.status(500).json({ error: "Server error. Please try again later." })

    }
})


// UPDATE AN ITEM
app.put("/todos/:id", authorise, async (req, res) => {
    const { description } = req.body
    const { id } = req.params
    const userID = req.user.id
    const { error, cleaned } = validateDescription(description)
    const { error: invalidId, cleaned: validId } = validateId(id);

    if (error) return res.status(400).json( { error })
    if (invalidId) return res.status(400).json( { error : invalidId })

    try{
        const selectedItem = await db.query("UPDATE items SET description = ($1) WHERE id = ($2) AND user_id = ($3) RETURNING *", [cleaned, validId, userID]);
        if(selectedItem.rows.length === 0) {
            return res.status(403).json({ error:"Unauthorised to update this item or item not found." })
        }
        res.status(200).json({ message: "Todo updated successfully." })
        }
    catch(err){
        console.error("Error updating item:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." })
    }
})

// DELETE AN ITEM
app.delete("/todos/:id", authorise, async (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;
    const { error, cleaned } = validateId(id);
    if (error) return res.status(400).json ( { error });
    try{
        const deletedItem = await db.query("DELETE FROM items WHERE id = ($1) AND user_id = ($2) RETURNING *", [cleaned, userID]);
        if (deletedItem.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorised to delete this item or item not found." });
        }
        res.status(200).json({ message: "Todo was deleted successfully." })
    }
    catch (err) {
        console.error("Error deleting item:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." })
    }
})



// SIGN UP ROUTE
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const { error, cleaned } = validateSignupInput(email, password);
    if (error) return res.status(400).json( { error })
    try {
        const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [cleaned.email]);
        if (checkUser.rows.length > 0) {
            return res.status(409).json({ error: "User already exists. Please log in." });
        }
        const hash = await bcrypt.hash(cleaned.password, saltRounds);
        await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [cleaned.email, hash]);
        res.status(201).json({ success: "User signed up successfully. Please log in." });
    }
    catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});



// LOGIN ROUTE
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { error, cleaned } = validateLoginInput(email, password);
    if (error) return res.status(400).json( { error })
    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [cleaned.email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found, please sign up first!" });
        }
        const currentUser = userResult.rows[0];
        const isMatch = await bcrypt.compare(cleaned.password, currentUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect Password, please try again!" });
        }
            const payload = { id: currentUser.id, email: currentUser.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });
            return res.status(200).json({ message: "Authentication successful." });
    }
    catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
});


// VERIFY MIDDLEWARE AND ROUTE

    function authorise(req, res, next) {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(403).json({ error: "No token found." });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired token." });
            }
            req.user = decoded;
            next()
        })
    }

app.get("/verify", authorise, (req, res) => {
        res.json({ email: req.user.email })
})


// SIGN OUT ROUTE

app.post("/signout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    })
    res.status(200).json({message: "successful logout"})
})




app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})