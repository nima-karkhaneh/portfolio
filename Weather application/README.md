# OzWeather - Current Weather Around Australia
## Overview
This project is a weather application which gives users the current temperature, the maximum and minimum temperature, and the relative humidity for each city or town around Australia.
## Technologies Used
### Frontend
* **Embedded JavaScript (EJS):** To structure the content of the website and add some functionality
* **Cascading Style Sheets (CSS):** To style the content of the website including a responsive design
### Backend
* **Node.js**: To run JavaScript on the server-side of the application
## Dependencies Used
* **axios:** To make `htttp` requests to OpenWeatherMap API
* **dotenv:** To store the sensitive information such as the API key securely
* **express:** To build server-side of the application
* **ejs:**  To enable Embedded JavasScript
## Installation Guide
This project is located in the `Weather Application` directory of a larger repository called `Portfolio`. It requires you to sign up to to the OpenWeatherMap API and obtain your own API key. You will also need a `.env` file to store your API key securely.
To sign up and obtain your API key, please visit the following website;  

https://openweathermap.org/api  

To install and use the project, please follow the following steps:
1. Clone the repository:
```bash
git clone https://github.com/nima-karkhaneh/Portfolio.git
cd Weather\ application/

```
2. Install the dependencies:  

`npm install`  

3. Create a `.env` file in the root directory of the project and replace the placeholders with your own API key. Here is an example of your `.env` file:
```
API_KEY="Your own API key"
port="3000"

```  
4. Run the application:

`node index.js`

5. Visit http://localhost:3000 in your browser to start the application

## Credit
* This project is one of the capstone projects included in **The Complete Full-Stack Web Development Bootcamp** by **The App Brewery**. The course is delivered by **Angela Yu**
* This project has followed the following YouTube tutorial as a guide:
**Asynchronous JavaScript Course – Async/Await , Promises, Callbacks, Fetch API** by **CodeLab98**
