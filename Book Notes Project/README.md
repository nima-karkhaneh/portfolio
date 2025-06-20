# Virtual Bookroom (Book Notes Project)

## Overview
**Virtual Bookroom** is a full-stack web application that allows users to create and manage their collection of book reviews. Users can add books with details such as title, author, ISBN, review, star rating, and the date they read the book. Book cover images are fetched dynamically from the Open Library API to enrich the experience. While the app does not implement user authentication, it captures the reader’s name with each review to provide basic identification. The library supports sorting by date, rating, or alphabetically for easy browsing.

## Screenshots
<p align="center">
  <img src="public/images/home-screenshot.png" alt="Vitrual Bookroom homepage" width="600" />
</p>
<p align="center"><em>Virtual Bookroom home page.</em></p>
<p align="center">
  <img src="public/images/books-screenshot.png" alt="Books" width="600" />
</p>
<p align="center"><em>View when book reviews are added.</em></p>
<p align="center">
  <img src="public/images/addpage-screenshot.png" alt="Add page" width="600" />
</p>
<p align="center"><em>Virtual Bookroom add page.</em></p>
<p align="center">
  <img src="public/images/invalid-isbn-err.png" alt="Invalid ISBN error" width="600" />
</p>
<p align="center"><em>Invalid ISBN error.</em></p>

## Features
* **Add Book & Reviews:** Users can add books along with detailed reviews, star ratings, and reading dates. The name of the reader also appears after each review submission to allow for identifiable readers.
* **Edit and Delete:** Users can modify or remove their reviews anytime.
* **Dynamic Book Covers:** Book cover images are retrieved from the **Open Library API** based on ISBN.
* **Sorting:** Content can be sorted by review date, star rating, or book title alphabetically for improved navigation.
* **Responsive Design:** The interface adapts to different screen sizes for a smooth user experience.

## Technologies Used
### Frontend
* **Embedded JavaScript (EJS):** To structure the content of the website and add some functionality
* **Cascading Style Sheets (CSS):** To style the content of the website including a responsive design
* **JavaScript:** To add extra functionality to the website
### Backend
* **Node.js**: To run JavaScript on the server-side of the application
### Database
* **PostgresSQL**: To create a database for the web application
### APIs
* **Open Library API**: To access book covers

## Dependencies
* **dotenv**: To store sensitive information like the database credentials or API keys
* **express**: To build server-side of the application
* **ejs**: To enable Embedded JavasScript
* **pg**: To interact with the PostgresSQL from the backend

## Installation Guide
### Book Notes Project
This project is located in the `Book Notes Project` directory of a larger repository called `Portfolio`. It requires a `.env` file and a PostgreSQL database to run.
To install and use the project, please follow these steps:
1. Clone the repository  
```bash
git clone https://github.com/nima-karkhaneh/Portfolio.git
cd "Book Notes Project"

```
2. Install dependencies
```bash
npm install
```
3. Launch **pgAdmin** and connect to your PostgreSQL server. Create a new database followed by creating the following two tables:
```
CREATE TABLE library (
id SERIAL PRIMARY KEY,
title VARCHAR(50),
author VARCHAR(50),
isbn BIGINT,
date CHAR(10),
review TEXT,
rate INT
);

CREATE TABLE rating (
id SERIAL PRIMARY KEY,
rate INT
);

```
4. Create a `.env` file in the root of the project and replace the placeholders with your local PostgreSQL credentials. Here is an example for your `.env` file:
```
DB_USER="Your PostgreSQL username (usually postgress unless you specified another)"
DB_HOST="localhost"
DB_DATABASE="The name of your database (e.g., my_project_db)"
DB_PASSWORD="Your PostgreSQL password"
DB_PORT="5432"
PORT="3000"

```
5. Run the application:  

`node index.js `  

6. Visit http://localhost:3000 in your browser to start the application
## Credit
This project was developed independently as a capstone assignment for **The Complete Full-Stack Web Development Bootcamp** by **Angela Yu (The App Brewery)**. While inspired by course objectives, all implementation decisions, styling, and additional features (like error handling and UI improvements) were completed by myself.

