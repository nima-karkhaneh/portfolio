import express from "express";
import env from "dotenv"
import nodemailer from "nodemailer"
import favicon from "serve-favicon"
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


// GET routes

app.get("/", (req,res)=>{
    res.render("index.ejs", {
        errors: []
    });
})
app.get("/founder", (req,res)=>{
    res.sendFile(__dirname+"/views/founder.html")
})
app.get("/services",(req,res)=>{
    res.sendFile(__dirname +"/views/services.html")
})
app.get("/portfolio", (req,res)=>{
    res.sendFile(__dirname + "/views/portfolio.html")
})
app.get("/state-st", (req,res)=>{
    res.sendFile(__dirname + "/views/state-st.html")
})
app.get("/kensington-st", (req,res)=>{
    res.sendFile(__dirname + "/views/kensington-st.html")
})
app.get("/nulla", (req,res)=>{
    res.sendFile(__dirname + "/views/nulla.html")
})

// for debugging only

app.get("/success", protectSuccessPage, (req,res)=>{
   res.sendFile(__dirname + "/views/success-page.html" )
})
app.get("/unsuccess", protectUnsuccessPage, (req,res)=>{
    res.sendFile(__dirname + "/views/unsuccess-page.html")
})

// POST route and Middleware validators
app.post("/submit",
    [
        body("firstname").trim().escape().notEmpty().withMessage("First name is required."),
        body("lastname").trim().escape().notEmpty().withMessage("Last name is required."),
        body("email").trim().isEmail().withMessage("Invalid email address."),
        body("phone").trim().notEmpty().withMessage("Phone number is required."),
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
                return res.redirect("/unsuccess");
            } else {
                console.log(info.response);
                req.session.allowSuccessPage = true;
                return res.redirect("/success");
            }
        });
    }
);




app.listen(port, ()=>{
    console.log(`server is listening on port http://localhost:${port}`)
});