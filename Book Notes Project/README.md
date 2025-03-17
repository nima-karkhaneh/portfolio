# Virtual Library (Book Notes Project)
## Overview
This project showcases a platform where users can add their favourite books, reviews, ratings, and when they have read the book to a virtual library. Users can also edit the reviews or delete the books entirely after they have been added. The content of this library is sortable by date, rating, and also alphabetically for ease of navigation.
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
## Dependencies Used
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
cd Book\ Notes\ Project/

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
This project is one of the capstone projects included in **The Complete Full-Stack Web Development Bootcamp** by **The App Brewery**. The course is delivered by **Angela Yu**.

