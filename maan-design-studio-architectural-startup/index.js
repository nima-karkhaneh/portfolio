import express from "express";
import env from "dotenv"
import nodemailer from "nodemailer"
import favicon from "serve-favicon"
import { dirname } from "path";
import { fileURLToPath } from "url";


const app = express();
env.config();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(favicon(__dirname + "/public/images/favicon.ico"))
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


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

app.get("/success", (req,res)=>{
   res.sendFile(__dirname + "/views/success-page.html" )
})
app.get("/unsuccess", (req,res)=>{
    res.sendFile(__dirname + "/views/unsuccess-page.html")
})

// POST route

app.post("/submit", (req,res)=>{
    const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth:{
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const mailOptions = {
        to: process.env.CLIENT_EMAIL,
        subject: `Message from: ${req.body.firstname} ${req.body.lastname} with an email address ${req.body.email} and phone No. ${req.body.phone}`,
        text: req.body.text
    }

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err.message)
            res.sendFile(__dirname + "/views/unsuccess-page.html")
        } else {
            console.log(info.response)
            res.sendFile(__dirname + "/views/success-page.html")
        }
    });
});


app.listen(port, ()=>{
    console.log(`server is listening on port http://localhost:${port}`)
});