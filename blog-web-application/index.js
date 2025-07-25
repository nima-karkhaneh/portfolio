import express from "express";
import validator from "./validation-middleware/validator.js";
import {validationResult} from "express-validator";


const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


function getFormattedDate() {
    const now = new Date();
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return now.toLocaleString('en-AU', options).replace(',', '');
}

const posts= [];

// GET routes

app.get("/", (req,res)=>{
    res.render("home.ejs", {
        posts,
        noPosts: req.query.noPosts
    });
})

app.get("/new-posts", (req,res)=>{
    res.render("new-posts.ejs")
})

app.get("/posts", (req, res) => {
    if (posts.length === 0) {
        return res.redirect("/?noPosts=true");
    }
    res.render("posts.ejs", {
        posts,
    });
});

// app.get("/not-found", (req, res) => {
//     res.render("404.ejs")
// })


// Submitting a new post

app.post("/submit", validator, (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("new-posts.ejs" , {
            errors: errors.array(),
            postData: req.body
        })
    }
    const post = {
        id: posts.length + 1,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        date: getFormattedDate()
    }
    posts.push(post);
    res.redirect("/posts")
})

// Getting a specific post

// app.get("/edit/:postID", (req,res)=>{
//     const postID = Number(req.params.postID)
//     const foundPost = posts.find(p => p.id === postID);
//     if (isNaN(postID) || postID <= 0 || !foundPost)
//     {
//         return res.status(404).render("404.ejs")
//     }
//     res.render("edit-posts.ejs",{
//         foundPost: foundPost
//     });
// })

// Editing/Updating a specific post

app.put("/posts/:postID", validator, (req, res) => {
    const postID = Number(req.params.postID)
    const foundIndex = posts.findIndex(p => p.id === postID );
    if (isNaN(postID) || postID <= 0 || foundIndex === -1) return res.status(404).json({ error: "Post not found."} )


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json( {errors: errors.array()} )
    }

    const foundPost = posts[foundIndex];

    const updatedPost = {
        ...foundPost,
        author: req.body.author || foundPost.author,
        title: req.body.title || foundPost.title,
        text: req.body.text || foundPost.text,
        date: getFormattedDate()
    }

    posts[foundIndex] = updatedPost;
    res.status(200).json( { message: "Post updated", post: updatedPost })
});


// Deleting a specific post

app.get("/posts/delete/:postID", (req,res)=> {
    const postID = Number(req.params.postID)
    const foundIndex = posts.findIndex(p => p.id === postID);
    if (isNaN(postID) || postID <= 0 || foundIndex === -1) {
        return res.status(404).render("404.ejs");
    }
    posts.splice(foundIndex, 1);
    if (posts.length === 0) {
        return res.redirect("/?noPosts=true");
    }
    res.redirect("/posts")
})

// app.use((req, res) => {
//     res.status(404).render("404.ejs")
// })


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})