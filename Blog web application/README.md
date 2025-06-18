
# Journalog – A Simple Blog Application

## Overview  
**Journalog** is a web blog application that allows users to create, edit, and delete posts. Each post is timestamped and displayed in reverse chronological order (latest posts first). The app demonstrates clean backend routing, dynamic templating with EJS, and responsive frontend styling.

<p align="center">
  <img src="public/images/home-screenshot.png" alt="Journalog homepage" width="600" />
</p>
<p align="center"><em>Main posts page showing blog entries.</em></p>

<p align="center">
  <img src="public/images/no-posts-screenshot.png" alt="Journalog no-posts" width="600" />
</p>
<p align="center"><em>View when no posts are created.</em></p>

<p align="center">
  <img src="public/images/posts-screenshot.png" alt="Journalog posts" width="600" />
</p>
<p align="center"><em>Example of a post created with the line breaks preserved.</em></p>

---

## Features
- Create, edit, and delete posts
- Posts are timestamped and ordered newest-first
- Clean and responsive layout with partials (header & footer)
- Preserves line breaks from user input (multi-line post formatting)
- Intuitive interface for post editing and deletion

---

## Technologies Used

### Frontend
- **Embedded JavaScript (EJS):** For dynamic templating and rendering data on the frontend
- **CSS:** For styling and responsive design
- **Vanilla JavaScript:** To enhance interactivity

### Backend
- **Node.js:** JavaScript runtime for server-side logic

---

## Dependencies
- **express:** Web framework for handling routes and server logic
- **ejs:** Template engine for rendering HTML with embedded JavaScript

---

## Challenges & Solutions

### 1. Conditional Scrollbar Display  
**Challenge:**  
The posts container always showed a vertical scrollbar, even when there were no posts — creating unnecessary visual clutter.  

**Solution:**  
Used conditional logic in the EJS template to apply a `.no-scroll` class only when there were no posts. This class toggled the `overflow-y` CSS property in the stylesheet, preventing the scrollbar from appearing unless needed.

---

### 2. Simplifying Date Formatting  
**Challenge:**  
JavaScript’s default `Date()` output included verbose timezone info (e.g., `GMT+1000` and full timezone names), making the UI look cluttered.  

**Solution:**  
Formatted the date on the backend using `toLocaleDateString()` and `toLocaleTimeString()` with custom options to return a cleaner, user-friendly string like `"17 June 2025 at 20:47"`.

---

### 3. Implementing Post Editing with Prefilled Form Values  
**Challenge:**  
Allowing users to edit a post by pre-populating the form with the current post content.  

**Solution:**  
Used dynamic routing (`/edit/:postID`) to fetch the selected post by ID. Passed the data to the `edit-posts.ejs` template and prefilled the input fields using EJS. Unchanged fields were preserved during submission.

---

### 4. Deleting a Specific Post by ID  
**Challenge:**  
Enable reliable and efficient deletion of a single post using its unique identifier.  

**Solution:**  
Created a dynamic GET route (`/posts/delete/:postID`) to locate the post in the in-memory array and remove it using `splice()`, then redirected back to the updated posts view.

---

### 5. Reusing Header and Footer with Partials  
**Challenge:**  
Avoid code duplication and maintain consistency across multiple views.  

**Solution:**  
Abstracted the header and footer into partial EJS files (`partials/header.ejs` and `partials/footer.ejs`) and included them in all views using `<%- include("partials/header.ejs") %>` and `<%- include("partials/footer.ejs") %>`. This made the layout modular and easy to maintain.

---

### 6. Preserving Line Breaks in User-Submitted Posts
**Challenge:**  
When users wrote multi-line posts using a `<textarea>`, any line breaks (e.g. pressing Enter) were ignored when rendering the post on the page. This caused all the text to appear as one continuous block, making posts hard to read.

**Solution:**  
Applied the CSS rule `white-space: pre-line` to a reusable `.post-text` class. This property tells the browser to preserve newline characters while still allowing natural line wrapping. The class was then applied to all `<p>` elements displaying user-submitted post content:

```ejs
<p class="post-text"><%= post.text %></p>
```
```css
.post-text {
  white-space: pre-line;
}
```

## Installation

This project is located in the `Blog web application` folder of a larger repository named `Portfolio`.

To run it locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/nima-karkhaneh/Portfolio.git
   cd "Blog web application"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   node index.js
   ```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000)

---

## Credit

This project was created as a **capstone project** for the *Complete Full-Stack Web Development Bootcamp* by **The App Brewery**, taught by **Dr. Angela Yu**.  
While the course provided foundational knowledge, all logic, structure, and implementation in this blog application were developed independently as part of the capstone challenge.
