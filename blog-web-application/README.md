# Journalog – A Full-Featured Blog Application

## Overview

**Journalog** is a web blog application that allows users to create, edit, and delete posts. Each post is timestamped and displayed in reverse chronological order (latest posts first). The app demonstrates clean backend routing, dynamic templating with EJS, and responsive frontend styling.

## Screenshots

## Features

- Create, edit, and delete posts
- Posts are timestamped and ordered newest-first
- Clean and responsive layout with partials (header & footer)
- Preserves line breaks from user input (multi-line post formatting)
- Truncates long posts on the homepage with a `Read more` link
- View full post on its own page (`/posts/:id`)
- RESTful architecture using proper HTTP verbs
- Intuitive interface for post editing and deletion

## Technologies Used

### Frontend

- **Embedded JavaScript (EJS):** For dynamic templating and rendering data on the frontend
- **CSS:** For styling and responsive design
- **Vanilla JavaScript:** To enhance interactivity

### Backend

- **Node.js:** JavaScript runtime for server-side logic

## Dependencies

- **express:** Web framework for handling routes and server logic
- **ejs:** Template engine for rendering HTML with embedded JavaScript
- **express-validator**: Middleware for validating and sanitising user input

## Challenges & Solutions

### Truncating Long Posts

**Challenge:** Long posts made the homepage cluttered and harder to scan.\
**Solution:** Truncated posts to 100 characters using `slice()`, then added a `Read more` anchor tag to link to the full post. Posts shorter than 100 characters omit the link.

```ejs
<% if (post.text.length > 100) { %>
  <p class="post-text preview">
      <%= post.text.length > 100 ? post.text.slice(0,100).trim() + "...": post.text  %><small><a href="/posts/<%= post.id %>">Read more</a></small>
  </p>
<% } else { %>
  <p class="post-text preview"><%= post.text %></p>
<% } %>
```

### Simplifying Date Formatting

**Challenge:** JavaScript’s default `Date()` output included verbose timezone info.\
**Solution:** Used `toLocaleDateString()` and `toLocaleTimeString()` with custom options for cleaner formatting like `17 June 2025 at 20:47`.

### Implementing Post Editing with Prefilled Form Values

**Challenge:** Needed to populate the edit form with existing content.\
**Solution:** Routed to `/edit/:postID`, passed the selected post to the template, and prefilled form fields using EJS.

### Deleting a Specific Post by ID

**Challenge:** Enable precise deletion of a post using its ID.\
**Solution:** Switched from GET-based deletion to dynamic `DELETE /posts/:postID` route using Fetch API.

### Reusing Header and Footer with Partials

**Challenge:** Avoid layout duplication across views.\
**Solution:** Created `partials/header.ejs` and `partials/footer.ejs` and included them in all templates.

### Preserving Line Breaks in User-Submitted Posts

**Challenge:** Line breaks were lost when rendering textarea input.\
**Solution:** Used CSS `white-space: pre-line` on `.post-text` elements.

```css
.post-text {
  white-space: pre-line;
}
```

## Recent Improvements

### Font Stack Refinement

**Problem:** Fonts were inconsistent across browsers.\
**Solution:** Applied global `Roboto, sans-serif` for body text and `Raleway` for headings and buttons.

### Layout & Styling Consistency Across Pages

**Problem:** Typography and spacing varied.\
**Solution:** Introduced consistent heading classes and unified spacing with reusable utility classes.

### Enhanced Validation and Error Handling

**Problem:** Users received unclear or missing error messages.\
**Solution:**

- Used `express-validator` for form and URL validation.
- Displayed errors with `.form-error` styles or Fetch-based alerts.
- Returned accurate HTTP status codes (400, 404, 500).

### Smooth UX After Post Deletion

**Problem:** After deleting all posts, page layout looked broken.\
**Solution:** Added `.no-post-msg` and removed stale query parameters after deletion.

### Custom 404 Error Page

**Problem:** Unrecognized routes showed raw Express error pages.\
**Solution:** Added styled `404.ejs` page with navigation link and semantic layout.

### Refactored CSS for Maintainability

**Problem:** Redundant vendor prefixes and messy styles.\
**Solution:** Removed outdated rules, cleaned up structure, and grouped styles by view/component.

### Refactored Edit and Delete Routes to Follow RESTful API Standards

**Problem:** Used non-RESTful GET/POST endpoints.\
**Solution:**

- Updated routes to `PUT /posts/:postID` and `DELETE /posts/:postID`
- Used Fetch API for asynchronous form handling
- Centralized logic in `script.js`

### Building a Dedicated Post View Page

**Problem:** No way to view full post from homepage.\
**Solution:** Added `/posts/:postID` route and `view-post.ejs` template with formatted full content.

### Added "Back to Blogs" Button on Full Post View

**Problem:** No intuitive way to return to blog list from full post view.\
**Solution:** Added a navigation button with Flexbox layout to balance page actions.

## Comprehensive Error Handling Refinement

### Problem

While initial form validations existed, the app lacked robust mechanisms for handling backend failures, invalid routes, and client-side network issues. This led to unclear or missing user feedback — especially during malformed requests or unexpected runtime errors.

### Solution

A full-stack error-handling layer was added to cover both client and server operations, ensuring resilient behavior, meaningful responses, and a smoother UX.

### 400 – Validation Errors

- Integrated `express-validator` to validate:
    - Form fields (`title`, `author`, `text`)
    - URL parameters (`:postID`)
- On validation failure:
    - Backend responds with `400 Bad Request`
    - Frontend either displays form field errors (via EJS) or alert messages (via Fetch)

```js
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

### 404 – Resource Not Found

- Backend explicitly checks if a post exists before attempting update or deletion.
- Responds with `404 Not Found` if:
    - The post does not exist
    - An invalid route is accessed (e.g. `/invalid-route`)
- Custom `404.ejs` page added with styled feedback and navigation link.

### 500 – Internal Server Errors

- All `PUT` and `DELETE` routes wrapped in `try/catch` blocks to capture unexpected crashes.

```js
try {
  posts[foundIndex] = updatedPost;
  res.status(200).json(...);
} catch (err) {
  res.status(500).json({ error: "Internal server error." });
}
```

- Ensures a proper server response even if something fails mid-operation.

### Client-Side Network Failures

- All `fetch()` requests now include `.catch()` blocks to capture:
    - Lost connection
    - Invalid URLs (e.g. `PUTTT` instead of `PUT`)
    - Crashed or unreachable server

```js
try {
  const response = await fetch(...);
  if (!response.ok) {
    const error = await response.json();
    alert(error.errors?.[0].msg || error.error || "Failed to update the post.");
    return;
  }
  window.location.href = `/posts/${postID}`;
} catch (err) {
  alert("Something went wrong while updating the post.");
}
```

### Benefits

- Clear user feedback for every error state
- Proper HTTP status codes used throughout (400, 404, 500)
- More maintainable and scalable code
- Eliminates silent failures or raw error dumps

## Installation

This project is located in the `Blog web application` folder of a larger repository named `portfolio`.

To run it locally:

```bash
git clone https://github.com/nima-karkhaneh/portfolio.git
cd blog-web-application
```

```bash
npm install
```

```bash
node index.js
```

Visit: [http://localhost:3000](http://localhost:3000)

## Credit

This project was created as a **capstone project** for the *Complete Full-Stack Web Development Bootcamp* by **The App Brewery**, taught by **Dr. Angela Yu**.\
While the course provided foundational knowledge, all logic, structure, and implementation in this blog application were developed independently as part of the capstone challenge.


