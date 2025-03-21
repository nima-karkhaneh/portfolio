# ToDo List Application
## Overview
This project is a simple ToDo List application which allows users to securely log in, post their todo list item, edit and delete items.
## Technologies Used
### Frontend
* **ReactJS:** An open-source JavaScript library for building user interfaces
* **Bootstrap:** An open-source CSS framework designed for responsive, mobile first development
### Backend
* **Node.js**: To run JavaScript on the server-side of the application
### Database
* **PostgresSQL**: To create a database for the web application
## Dependencies Used
### Frontend
The directory structure of the client side of the application has been created using Vite. The full list of dependencies are as follows;
* **react:** Created by Vite to enable writing a react application 
* **react-dom:** Created by Vite to enable writing a react application 
* **axios:** To enable frontend to make HTTP requests to the backend API of the application
### Backend
* **bcrypt:** To hash the passwords before storing them in a database
* **cookie-parse:** To access the JSON Web Token stored in a cookie
* **cors:** To enable the frontend Vite server to communicate with the backend API
* **dotenv:** To securely store sensitive information like the database credentials or API keys
* **express:** To create a backend API
* **jsonwebtoken:** To generate a JSON Web Token for user authentication/authorisation
* **pg:** To interact with the PostgresSQL from the backend
## Features
* Allows users to securely log in to the application. To achieve this, a JSON Web Token is generated after each user has been authenticated. For added security, tokens are stored in httpOnly and secure cookies and sent to the frontend
* Allows users to post their todo item
* Allows users to edit and delete their posts
## Installation Guide
This project is located in the `ToDo List Application` directory of a larger repository called `Portfolio`. It requires a `.env` file and a PostgreSQL database to run. To install and run the project, please follow the following steps;
1. Clone the repository:  
```bash
git clone https://github.com/nima-karkhaneh/Portfolio.git
cd ToDo\ List\ Application/

```
2. Change directory to `client`:

`cd client`

3. In the client directory, install the dependencies:

`npm install`

4. Create a `.env` file in the client directory and fill it out with the following information;

```
VITE_API_URL_POST=http://localhost:3000/submit
VITE_API_URL_GET=http://localhost:3000/todos/
VITE_API_URL_DELETE=http://localhost:3000/todos/
VITE_API_URL_PUT=http://localhost:3000/todos/
VITE_API_URL=http://localhost:3000
VITE_API_URL_VERIFY=http://localhost:3000/verify
VITE_API_URL_SIGNOUT=http://localhost:3000/signout

```
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
)

```
8. Create a `.env` file in the root of the project and replace the placeholders with your local PostgreSQL credentials and your JWT secret. Here is an example for your `.env` file:
```
DB_USER="Your PostgreSQL username (usually postgress unless you specified another)"
DB_HOST="localhost"
DB_DATABASE="The name of your database (e.g., my_project_db)"
DB_PASSWORD="Your PostgreSQL password"
DB_PORT="5432"
JWT_SECRET="Your own created JWT secret"
PORT="3000"

```
9. Run the backend API:

`node index.js`

10. Change directory to `client` and run the following command:

 `npm run dev`

11. Visit http://localhost:5173 in your browser to start the application.

## Credit
This project has followed the following YouTube tutorials as a guide. Authentication and Authorisation with secured cookies has been added as an extra feature.

* PERN Stack Course - Postgres, Express, React, and Node by **The Stoic Programmers**  


* 3hrs to Build and DEPLOY an Authenticated TO DO APP! PostGres + React + Node.js + Kinsta by **Code With Ania Kubow**


