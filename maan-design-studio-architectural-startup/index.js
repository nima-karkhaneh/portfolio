import express from "express";
import env from "dotenv"
import nodemailer from "nodemailer"
import favicon from "serve-favicon"
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from "express-validator";
import session from "express-session"
import { protectSuccessPage, protectUnsuccessPage } from "./middleware/routeProtection.js";



const app = express();
env.config();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(favicon(__dirname + "/public/images/favicon.ico"))
app.use(express.static("public"));
app.use(express.urlencoded({ extended:true }));
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000
    }
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})
app.get("/services",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "services.html"))
})
app.get("/portfolio", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "portfolio.html"))
})
app.get("/state-st", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "state-st.html"))
})
app.get("/kensington-st", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "kensington-st.html"))
})
app.get("/nulla", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "nulla.html"))
})

// for debugging only

app.get("/success", protectSuccessPage, (req,res)=>{
   res.sendFile(path.join(__dirname, "views", "success-page.html"))
})
app.get("/unsuccess", protectUnsuccessPage, (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "unsuccess-page.html"))
})

if (process.env.NODE_ENV !== "production") {
    app.get("/forbidden", (req, res) => {
        res.sendFile(path.join(__dirname, "views", "403-forbidden-page.html"));
    });
}


// POST route and Middleware validators
app.post("/submit",
    [
        body("firstname").trim().escape().notEmpty().withMessage("First name is required."),
        body("lastname").trim().escape().notEmpty().withMessage("Last name is required."),
        body("email").trim().isEmail().withMessage("Invalid email address."),
        body("phone").trim().notEmpty().withMessage("Phone number is required.").matches(/^[0-9+\-\s()]{7,15}$/).withMessage("Invalid phone number format."),
        body("text").trim().escape().notEmpty().withMessage("Message cannot be empty.")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Send errors as JSON
        }

        const transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        const mailOptions = {
            to: process.env.CLIENT_EMAIL,
            subject: `Message from: ${req.body.firstname} ${req.body.lastname} | Email: ${req.body.email} | Phone: ${req.body.phone}`,
            text: req.body.text
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err.message);
                req.session.allowUnsuccessPage = true;
                req.session.save(() => {
                    res.json( { redirectTo: "/unsuccess" });
                });
            } else {
                console.log(info.response);
                req.session.allowSuccessPage = true;
                req.session.allowSuccessPage = true;
                req.session.save(() => {
                    res.json({ redirectTo: "/success" });
                });

            }
        });
    }
);




if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
} else {
    app.listen(port);
}
