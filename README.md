# Quacker: A Social Media Application

## Introduction
Quacker is a social media application for sharing and interacting with brief, engaging messages called "quacks". This application is built using Node.js for the backend and a basic HTML/CSS/JavaScript frontend, interacting with a MongoDB database.

## Features
- **Post and View Quacks**: Users can post their own quacks and view others' quacks.
- **Top Quacks**: The application showcases the most liked quacks.
- **Real-time Updates**: Users can add new quacks and see the latest quacks in real-time.
- **Interactive UI**: A user-friendly interface with functionalities to like and comment on quacks.

## Backend (`server.js`)
The backend server is built using native Node.js modules without any external frameworks. It handles HTTP requests, serves static files, and interacts with the MongoDB database to perform CRUD operations on quack data.

### Database Operations (`db.js`)
The `db.js` module handles all interactions with the MongoDB database. It includes functions to:
- Connect to MongoDB.
- Perform user authentication.
- Create, read, update, and delete quack posts.
- Retrieve top quacks based on likes.

### Data Seeding (`seedDB`)
The `seedDB` function initializes the database with placeholder data for testing and development purposes.

## Frontend (`index.html`, `index.css`, `index.js`)
- `index.html`: Contains the structure of the web application.
- `index.css`: Provides styling for the application.
- `index.js`: A JavaScript file that makes API calls to the backend and updates the frontend dynamically.

## Setup and Installation
1. **Prerequisites**:
   - Node.js installed.
   - MongoDB setup.

2. **Installation**:
   - Clone the repository.
   - Install necessary Node.js dependencies (if any).
   - Ensure MongoDB is running and accessible.

3. **Running the Application**:
   - Start the server by running `node server.js`.
   - Access the application via a web browser at `localhost:3000`.

## Usage
- Navigate to the main page to view all quacks.
- Use the form to submit new quacks.
- Interact with quacks by liking or commenting on them.

## Contributing
Contributions to Quacker are welcome. Please feel free to fork the repository, make improvements, and submit pull requests.

## License
Quacker is open-source software licensed under the MIT license.

---

This README provides a general overview of the Quacker application. For more detailed documentation, especially regarding the database schema and API endpoints, additional documentation files should be consulted.
# QuackTest
