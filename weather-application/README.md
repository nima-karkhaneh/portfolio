# OzWeather - Current Weather Around Australia

## Overview
**OzWeather** is a weather application that provides users with current weather information — including temperature, highs/lows, and humidity — for cities and towns within **Australia**.

## Table of Contents
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Dependencies](#dependencies)
- [Challenges and Solutions](#challenges-and-solutions)
- [Installation Guide](#installation-guide)
- [Planned Improvements](#planned-improvements)
- [Final Note](#final-note)
- [Credit](#credit)

## Live Demo

**Access the deployed application here:**  
[https://ozweather.onrender.com/](https://ozweather.onrender.com/)
> **Note:** The app may take 10–20 seconds to load initially due to cold starts on the serverless backend (typical for free-tier deployments). Subsequent requests will be faster.

## Screenshots

<p align="center">
  <img src="public/images/homepage-screenshot.png" alt="OzWeather homepage" width="600" />
</p>
<p align="center"><em>Home page.</em></p>

<p align="center">
  <img src="public/images/weatherdata-screenshot.png" alt="OzWeather-Sydney weather info" width="600" />
</p>
<p align="center"><em>Example displaying weather data.</em></p>

<p align="center">
  <img src="public/images/errmsg-screenshot.png" alt="OzWeather-Error message" width="600" />
</p>
<p align="center"><em>Example displaying an error message.</em></p>

## Features

### Australia-Only Search Scope
Weather data is restricted to Australian cities using a country code filter (`AU`), avoiding global city-name conflicts.

### Current Weather Data
Displays real-time temperature, high/low, humidity, and weather conditions using OpenWeatherMap's current weather API.

### Dynamic Min/Max Calculation (Next 24 Hours)
Calculates accurate daily highs and lows using 5-day/3-hour forecast data — filtered by local time — instead of relying on static daily summaries.

### Timezone-Adjusted Forecasts
Converts UTC timestamps from the API into local time using each city’s timezone offset (in seconds), ensuring users see the correct upcoming hours in their time zone.

### Full Backend Error Handling
Handles invalid input, API errors, and undefined routes with clear feedback and custom views — not just console logs.

### Input Validation via Regex
Validates form input on the server to avoid invalid or malicious submissions before API calls are made.

### Conditional UI Behavior
Form hides after a successful weather lookup for a cleaner interface, using dynamic EJS logic.

### Custom 404 Page
Implements a catch-all middleware route to handle undefined paths and render a helpful 404 page.

### Responsive, Framework-Free Design
Built with plain CSS and media queries for a fully responsive layout across devices, without relying on external frameworks like Bootstrap or Tailwind.

### Secure API Key Handling
Uses `dotenv` to store environment variables locally and keeps sensitive keys out of the public repo with `.gitignore`.


## Technologies Used

### Frontend
* **Embedded JavaScript (EJS):** To structure the content of the website and add some functionality
* **Cascading Style Sheets (CSS):** To style the content of the website including a responsive design

### Backend
* **Node.js**: To run JavaScript on the server-side of the application

## Dependencies
* **axios:** To make `http` requests to OpenWeatherMap API
* **dotenv:** To store the sensitive information such as the API key securely
* **express:** To build server-side of the application
* **ejs:**  To enable Embedded JavasScript
* **serve-favicon:** To serve the favicon reliably

## Challenges and Solutions

### 1. Ensuring Accurate City Searches
**Challenge:**  
Some cities share the same name globally, leading to incorrect weather data.

**Solution:**  
Implemented a country code filter in the API request (`AU` for Australia) to ensure results are restricted to Australian locations only.

### 2. Robust Error Handling and Validation
**Challenge:**  
The original implementation lacked proper feedback for invalid inputs and failed API responses, making it unclear to users why their request didn’t work.

**Solution:**  
This app performs backend validation using regex and sends the appropriate HTTP status with user feedback rendered on the frontend. This ensures a more user-friendly and reliable experience.

### 3. Accurate Min/Max Temperature For the Next 24 Hour Period
**Challenge:**  
The initial logic relied on the current temperature to determine daily highs and lows, which led to unrealistic or misleading results — especially early in the day.

**Solution:**  
Implemented logic to calculate `tempMin` and `tempMax` using the 5-day/3-hour forecast API, filtered by local time. This resulted in more accurate, dynamic temperature ranges.

### 4. Timezone Offset & Local Time Conversion Fix
**Challenge:**  
Accurately converting forecast times from UTC to the city’s local time zone was complex, especially handling the timezone offset in seconds, ensuring displayed local times were correct for Australia’s multiple time zones.

**Solution:**  
Implemented a custom date formatting function that adds the OpenWeatherMap API’s timezone offset (in seconds) to the UTC date. Verified correctness extensively with console logs showing both UTC and local times. This was a non-trivial fix that ensures users see accurate local forecast times.

### 5. Full-Stack Design and Error Routing
**Challenge:**  
Many basic weather apps do not handle undefined routes, leading to generic or unhelpful error messages when users enter a wrong URL.

**Solution:**  
Built the app using Express routes, added a global catch-all route for undefined paths, and displayed a custom 404 page. The result is a well-structured full-stack application.

### 6. Form Visibility Logic After Submission
**Challenge:**  
After displaying the weather data, the form input should disappear for a better UI/UX.

**Solution:**  
Added conditional logic in the EJS form element to apply a `.invisible` class.
```ejs
<form action="/submit" method="post"
<% if (locals.city) { %>
class="invisible"
<% } %>>
    <input type="text" name="city" placeholder="Search for a town" autocomplete="off" required>
    <button class="search-btn" type="submit"><img class="search-icon"  src="./images/search icon.svg" alt=""></button>
</form>
```

### 7. Securing the API Key
**Challenge:**  
Risk of exposing sensitive API credentials in the codebase.

**Solution:**  
Used `dotenv` to load environment variables from a `.env` file and ensured `.env` was included in `.gitignore`.

### 8. Designing a Responsive UI Without a Framework
**Challenge:**  
Maintaining a clean and responsive design using only plain CSS.

**Solution:**  
Applied responsive design principles (like Flexbox) and media queries to ensure usability across devices.

## Installation Guide
This project is located in the `weather-application` directory of a larger repository called `portfolio`. It requires you to sign up to to the OpenWeatherMap API and obtain your own API key. You will also need a `.env` file to store your API key securely.
To sign up and obtain your API key, please visit the following website;  

https://openweathermap.org/api  

To install and use the project, please follow the following steps:
1. Clone the repository:
```bash
git clone https://github.com/nima-karkhaneh/portfolio.git
cd weather-application

```
2. Install the dependencies:  

`npm install`  

3. Create a `.env` file in the root directory of the project and replace the placeholders with your own API key. Here is an example of your `.env` file:
```
API_KEY="Your own API key"

```  
**Note:** Individual API keys are provided by OpenWeatherMap after signing up
4. Run the application:

`node index.js`

5. Visit http://localhost:3000 in your browser to start the application

## Planned Improvements

- **Hourly Forecasts with Icons:** Extend the forecast feature to display weather conditions in 3-hour intervals (next 24 hours), complete with icons for clearer visual representation.
- **Toast Notifications (Optional):** Provide lightweight user feedback (e.g., “City not found”) using styled toast messages instead of only inline text.
- **Performance Optimisation:** Cache API responses temporarily to reduce redundant calls to OpenWeatherMap and improve response times.

## Final Note
**OzWeather** demonstrates practical full-stack development skills with server-side input validation, making API requests, timezone-aware data handling, and responsive frontend design without frameworks. It showcases problem-solving for real-world challenges such as accurate min/max calculations, timezone conversion, and secure API key management. Planned improvements like hourly forecasts, toast notifications, and performance optimisations reflect initiative in enhancing usability and scalability. This project highlights the ability to implement maintainable, robust web applications independently.


## Credit
This project was developed independently as a capstone assignment for **The Complete Full-Stack Web Development Bootcamp** by **Angela Yu (The App Brewery)**.

Supplementary concepts were also reinforced through external learning, including the YouTube tutorial:  
*“Asynchronous JavaScript Course – Async/Await, Promises, Callbacks, Fetch API”* by **CodeLab98**.

While inspired by course objectives and tutorials, this app includes distinct features that make it a robust, independent portfolio project:
- Implements robust backend error handling and user feedback with HTTP status codes, unlike the tutorial’s frontend-only fetch with console logging.
- Accurately calculates daily minimum and maximum temperatures using the forecast API filtered by the local time, unlike the tutorial’s use of the current temperature only.
- Accurately handles timezone offset and local time conversion for Australian cities, a challenging fix to ensure correct forecast display.
- Built as a full-stack Express application with structured routing, including custom 404 error pages and catch-all middleware for undefined routes.
