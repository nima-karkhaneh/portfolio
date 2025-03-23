# Maan Design Studio - An Architectural Startup
## Overview
This project is a fully-fledged web application designed for an architectural startup called "Maan Design Studio". It features a home page with a contact section, information about the founder, services provided by the startup, and a portfolio page which showcases the founder's previous work.
## Technologies Used
### Frontend
* **HTML:** To structure the content of the website
* **CSS:** To style the content of the website including a responsive design
* **Bootstrap:** To add specific styles and extra functionality to the website
* **JavaScript:** To add functionality to the website
### Backend
* **NodeJS:** To run JavaScript on the server-side of the application
## Dependencies Used
* **dotenv:** To store sensitive information like nodemailer's username and password securely
* **express:** To create a web server on the backend of the application
* **nodemailer:** To handle the contact section of the application
* **serve-faviocn:** To serve the favicon for the application
## Installation Guide
This project is located in the `Maan Design Studio` directory of a larger repository called `Portfolio`. You can add can a `.env` file to the root of the project if you wish to see how the `nodemailer` package works. Otherwise, the application should run on `port 3000`. To run the application, please follow the following steps;
1. Clone the repository:

```bash
git clone https://github.com/nima-karkhaneh/Portfolio.git
cd Maan\ Design\ Studio\ -\ Architectural\ Startup/

```
2. Install the dependencies:

`npm install`

3. (optional) Create a `.env` in the root of the project and fill out the `nodemailer` placeholders with your own credentials. Here is an example of a `.env` file:
```
NODEMAILER_SERVICE="An email service you are using e.g. gmail"
CLIENT_EMAIL="The email in which the body of the contact form will be sent to"
NODEMAILER_USER="Your own email e.g. your gmail email"
NODEMAILER_PASS="Your nodemailer password. If you are using gmail this is called the app password and can be obtained by gmail after your have turned on the two factor authentication and provided the relevant information"
port="3000"

```
4. Run the application:

`node index.js`

5. Visit http://localhost:3000 in your browser to start the application.