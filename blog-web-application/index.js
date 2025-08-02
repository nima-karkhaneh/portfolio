import express from "express";
import { postIDValidator, postValidator } from "./validation-middleware/validator.js";
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
    const reversedPosts = [...posts].reverse()

    res.render("posts.ejs", {
        posts: reversedPosts,
    });
});


// Viewing a single post by postID
app.get("/posts/:postID", postIDValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const postID = Number(req.params.postID);
    const foundPost = posts.find(p => p.id === postID);

    if (!foundPost) {
        return res.status(404).render("404.ejs", {
            message: "Blog not found."
        })
    }
    res.render("view-post.ejs", {
        foundPost,
    })
})


// Getting a specific post for editing

app.get("/edit/:postID", postIDValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const postID = Number(req.params.postID);
    const foundPost = posts.find(p => p.id === postID);

    if (!foundPost) return res.status(404).render("404.ejs", {
        message: "Blog not found."
    })

    res.render("edit-posts.ejs", {
        foundPost,
    })
})


// Submitting a new post

app.post("/submit", postValidator, (req,res) =>{
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




// Editing/Updating a specific post

app.put("/posts/:postID", [...postIDValidator, postValidator], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const postID = Number(req.params.postID);
    const foundIndex = posts.findIndex(p => p.id === postID);

    if (foundIndex === -1) {
        return res.status(404).json({ error: "Post not found." });
    }

    try {
        const foundPost = posts[foundIndex];

        const updatedPost = {
            ...foundPost,
            author: req.body.author || foundPost.author,
            title: req.body.title || foundPost.title,
            text: req.body.text || foundPost.text,
            date: getFormattedDate()
        };

        posts[foundIndex] = updatedPost;
        res.status(200).json({ message: "Post updated", post: updatedPost });
    } catch (err) {
        console.error("Unexpected error:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});



// Deleting a specific post

app.delete("/posts/:postID", postIDValidator, (req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const postID = Number(req.params.postID)
    const foundIndex = posts.findIndex(p => p.id === postID)

    if (foundIndex === -1) {
        return res.status(404).json({ error: "Post not found."})
    }

    try{
        posts.splice(foundIndex, 1);
        const noPosts = posts.length === 0;
        res.status(200).json({
            message: "Post deleted successfully.",
            noPosts
        })
    }
    catch (err) {
        console.error("Unexpected error:", err.message);
        res.status(500).json({ error: "Internal server error." })
    }
})

app.use((req, res) => {
    res.status(404).render("404.ejs", {
        message: "Page not found."
    })
})


if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
} else {
    app.listen(port);
}