# ToDo List Application

## Overview
This is a secure, full-stack ToDo List application built using the PERN stack (PostgreSQL, Express, React, Node.js). It allows users to sign up, log in, and manage personalised todo items through a smooth and responsive single-page interface.

The app uses **React Router** for SPA (Single Page Application) behavior — meaning users can navigate between routes (login, dashboard, etc.) without full page reloads. JWT authentication is handled securely via `httpOnly` cookies.

## Table of Contents
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used) 
- [Dependencies](#dependencies)
- [Challenges and Solutions](#challenges-and-solutions)
- [Installation Guide](#installation-guide)
- [Development Workflow](#development-workflow)
- [Credit](#credit)

## Live Demo
**Access the deployed application here:**  

[https://todo-list-snowy-alpha-10.vercel.app/auth](https://todo-list-snowy-alpha-10.vercel.app/auth)

## Screenshots
<p align="center">
  <img src="client/public/authpage-screenshot.png" alt="Home page featuring user authentication" width="600" />
</p>
<p align="center"><em>Home page featuring user authentication</em></p>

<p align="center">
  <img src="client/public/todoitems-screenshot.png" alt="ToDo items" width="600" />
</p>
<p align="center"><em>Example of ToDo items</em></p>

## Features
* **Secure Authentication:** Users can securely log in. Upon authentication, a JSON Web Token (JWT) is generated and stored in an `httpOnly` and `secure` cookie for added security.
* **Edit and Delete:** Users can update or remove their existing todo items.
* **User-Specific Data:** All data is scoped to the authenticated user via backend-authenticated API.

## Technologies Used
### Frontend
* **ReactJS:** Component-based JavaScript library for building the user interface
* **React Router:** Enables client-side routing and SPA behavior
* **Bootstrap:** CSS framework for responsive and mobile-first design
### Backend
* **Node.js**: To run JavaScript on the server-side of the application
### Database
* **PostgreSQL**: To create a database for the web application

## Dependencies
### Frontend
The directory structure of the client side of the application has been created using Vite. The full list of dependencies are as follows;
* **react:** Created by Vite to enable writing a React application 
* **react-dom:** Created by Vite to enable writing a React application
* **react-router-dom:** To enable navigation and routing in React apps without reloading the page.
* **axios:** To enable frontend to make http requests to the backend API of the application
### Backend
* **bcrypt:** To hash the passwords before storing them in a database
* **cookie-parser:** To access the JSON Web Token stored in a cookie
* **cors:** To enable the frontend Vite server to communicate with the backend API
* **dotenv:** To securely store sensitive information like the database credentials or API keys
* **express:** To create a backend API
* **jsonwebtoken:** To generate a JSON Web Token for user authentication/authorisation
* **pg:** To interact with the PostgreSQL from the backend

## Challenges and Solutions
## Backend

### Securely Storing JWT Without Exposing It to Frontend JS

**Challenge:**  
Avoid storing JWT tokens in localStorage or accessible client-side storage to prevent XSS attacks.

**Solution:**
- Store JWT as an `httpOnly` cookie so it’s inaccessible to frontend JavaScript but sent automatically with requests.
- Use backend middleware to decode the token from the cookie and authorise requests.

### Managing Cross-Origin Cookies and CORS Configuration

**Challenge:**  
Enable secure cookies to be sent between frontend (`localhost:5173`) and backend (`localhost:3000`) during development.  

**Solution:**
- Configure CORS with `credentials: true` on both backend and frontend requests.
- Set cookie options to `httpOnly: true`, `secure: true`, and `sameSite: 'none'` to allow cross-site cookies over https.

### Creating Authorisation Middleware

**Challenge:**  
Protect routes by verifying the JWT from cookies and attaching user info for use in route handlers.  

**Solution:**
- Write `authorise` middleware that verifies JWT, handles errors, and assigns decoded user info to `req.user`.
- Use this middleware on routes requiring authentication.

### Associating Todos With Users in the Database

**Challenge:**  
Ensure todos are linked to the user who created them and prevent unauthorized access.  

**Solution:**
- Use a `user_id` foreign key in the `items` table referencing `users.id`.
- Filter all todo queries by `req.user.id` to only return the logged-in user’s data.

### Password Hashing and Signup Validation

**Challenge:**  
Securely hash passwords before storing and prevent duplicate user registration.  

**Solution:**
- Use `bcrypt` to hash passwords asynchronously before database insertion.
- Check if a user already exists by email before allowing signup.

### Handling JWT Expiration

**Challenge:**  
Ensure users are logged out or prompted to reauthenticate after token expiration.  

**Solution:**
- Set JWT expiry to 1 hour.
- In middleware, reject requests with expired tokens, forcing re-login.

## Frontend

### Detecting Authentication Status Without Access to JWT Token

**Challenge:**  
React cannot read `httpOnly` cookies, so it can’t directly check login status.  

**Solution:**
- Call backend `/verify` endpoint with credentials on app load.
- Set React auth state (`isAuthenticated`, `email`) based on backend response.

### Conditional Data Fetching Based on Authentication

**Challenge:**  
Avoid fetching protected data (todos) before authentication is confirmed.  

**Solution:**
- Use separate hooks or conditional logic to fetch todos only if authenticated.

### Smooth UI Updates After Login, Logout, and Data Changes

**Challenge:**  
Ensure the UI reflects changes (like login, logout, or item updates) without requiring full page reloads.

**Solution:**
- Used `React Router`’s `<Navigate />` and `useNavigate()` to handle routing after login and logout, replacing previous `window.location` calls.
- Updated React state (`items`, `isAuthenticated`) directly after authentication or data changes to trigger re-renders and reflect the latest state.

### Handling Cross-Origin Requests with Cookies in Frontend

**Challenge:**  
Ensure cookies are sent and received properly during cross-origin API calls.  

**Solution:**
- Always use `withCredentials: true` in axios requests.
- Make sure your backend sets proper CORS headers with `credentials: true` and specific origin.

### Migrating to React Router for SPA Behavior

**Challenge:**  
The original version relied on `window.location` reloads, which broke the single-page experience and made the UI feel clunky.

**Solution:**
- Integrated `react-router-dom` to manage routing between login and dashboard views.
- Used conditional rendering with `<Navigate />` and state-based route guards to protect authenticated pages.
- Enabled seamless user flow without page reloads, improving user experience and aligning with modern SPA standards.

## Installation Guide
This project is located in the `ToDo List Application` directory of a larger repository called `portfolio`. It requires a `.env` file and a PostgreSQL database to run. To install and run the project, please follow the following steps;
1. Clone the repository:  
```bash
git clone https://github.com/nima-karkhaneh/portfolio.git
cd todo-list-application
```
2. Change directory to `client`:

`cd client`

3. In the client directory, install the dependencies:

`npm install`

4. Create a `.env` file in the `client` directory and fill it out with the following values:


```
VITE_API_URL=http://localhost:3000
VITE_API_PATH_TODOS=/todos/
VITE_API_PATH_SUBMIT=/submit
VITE_API_PATH_VERIFY=/verify
VITE_API_PATH_SIGNOUT=/signout
```

- `VITE_API_URL` is the base URL of your backend (update this if deploying).
- The other values are relative API paths that are combined in the frontend code to build complete URLs.
- This setup allows you to easily switch environments (e.g., production vs. local) without changing your codebase.

5. Change directory to the root directory of the application:

`cd ../`

6. Install the dependencies:

`npm install`

7. Launch **pgAdmin** and connect to your PostgreSQL server. Create a new database followed by creating the following two tables:

```
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200)
);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    description VARCHAR(200)
);

```
8. Create a `.env` file in the root of the project and replace the placeholders with your local PostgreSQL credentials and your JWT secret. Here is an example for your `.env` file:
```
DB_USER="Your PostgreSQL username (usually postgres unless you specified another)"
DB_HOST="localhost"
DB_DATABASE="The name of your database (e.g., my_project_db)"
DB_PASSWORD="Your PostgreSQL password"
DB_PORT="5432"
JWT_SECRET="Your own created JWT secret"

```
9. Run the backend API:

`node index.js`

10. Change directory to `client` and run the following command:

 `npm run dev`

11. Visit http://localhost:5173 in your browser to start the application.

## Development Workflow
This project follows a Git-based feature branch workflow to simulate professional team collaboration and maintain a clean, stable codebase—even as a solo developer:

- New features, bug fixes, and improvements are developed in dedicated branches with descriptive names (e.g., `todoapp/frontend-error-handling-refinement`, `todoapp/responsive-design-improvements`, `todoapp/env-refacotr`).
- Changes are committed locally with meaningful messages and pushed to the remote repository using `git push origin <branch-name>`.  
- In `todoapp/backend-validation-ui-tweak` branch, I practiced `git rebase -i` to clean up my commit history before pushing. This included rewording one of the commits to ensure a professional, readable commit log. The rebase was done prior to merging the branch into `main`, following industry-standard Git hygiene practices.
- Pull Requests (PRs) are created on GitHub from these branches to merge changes into the `main` branch.
- As part of the PR process:
  - The author provides a detailed description of the changes in Markdown format, highlighting key updates and areas for improvement.
  - Code reviews are performed through inline comments and general feedback on the PR.
  - Multiple inline comments can be grouped as a single review submission.
  - A role-playing supervisor review is simulated to provide constructive feedback and approve the PR, demonstrating collaboration skills.
- Once approved, the PR is merged into the `main` branch on GitHub with a descriptive merge commit.
- After merging remotely, the local `main` branch is kept up to date by running `git pull`.
- Feature branches are preserved to maintain history, but can be deleted after merging if preferred.

This workflow ensures a stable `main` branch, clean commit history, and showcases industry-standard Git practices and teamwork—key skills for professional development environments.


## Credit
While this project was independently developed, a few online resources were referenced for learning purposes:

1. **PERN Stack Course** by *The Stoic Programmers* – This tutorial series offered a helpful introduction to building a ToDo app using the PERN stack. However, the tutorial stored JWT tokens in `localStorage`, which is insecure. My implementation significantly differs in that it uses `httpOnly` and `secure` cookies for authentication. While some frontend logic and Bootstrap styles are similar, my version features a different dashboard layout, includes user email display, and emphasizes security — which was not the focus of the tutorial.

2. **3hrs to Build and Deploy an Authenticated TO DO APP!** by *Code With Ania Kubow* – This tutorial demonstrated JWT-based authentication, but stored tokens in cookies accessible from React (i.e., not httpOnly). I used this resource for general structure inspiration but implemented secure cookie handling with `httpOnly` and `secure` flags to prevent client-side access — a key improvement in my version.

3. **The Complete Full-Stack Web Development Bootcamp** by *Dr. Angela Yu* (The App Brewery) – This Udemy course helped me build a solid foundation in React. However, it focused on frontend-only projects and server-rendered apps using EJS. Integrating React with a custom backend and PostgreSQL database was a challenge I pursued independently beyond the scope of the course.

This project reflects my initiative to go beyond tutorials by implementing secure authentication and building a fully functioning full-stack application from the ground up.



