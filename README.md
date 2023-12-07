# README for Quacker Project (Microservices Architecture with Python Client)

## Introduction
Quacker is a microservices-based web application for sharing short posts, "quacks". This README provides an overview of the project's structure, including a Python-based desktop client, and instructions for setup and running.

## Microservices Architecture
Quacker operates on a microservices architecture, enhancing scalability and maintainability. The services include:
- **User Service**: Manages user authentication and registration.
- **Quack Service**: Handles creation, deletion, and interactions with quacks.

## Python Desktop Client
In addition to the web interface, Quacker features a Python-based desktop client, offering an alternative user interface for interacting with the services.

### Python Client Features
- User authentication (login/signup).
- Posting and viewing quacks.
- Liking, commenting, and deleting quacks.

## File Structure
- `index.html`, `signup.html`, `login.html`: Frontend HTML files.
- `index.js`: JavaScript for frontend logic.
- `quackService.js`: Microservice for quack-related operations.
- `quackDB.js`, `userDB.js`: Database interactions for quacks and users.
- `userService.js`: Microservice for user operations.
- `SERVER.js`: Gateway server for request routing.
- `QuackClientApp.py`: Python-based desktop client application.

## Requirements
- Node.js
- MongoDB
- Python 3
- Tkinter (for Python client)
- Requests library (for Python client)

## Setup
1. **Clone Repository**: Clone the code to your local machine.
2. **Install Dependencies**: Run `npm install` in the project directory and ensure Python dependencies are installed.
3. **Configure MongoDB**: Set up MongoDB and update connection strings in `quackDB.js` and `userDB.js`.
4. **Microservices Deployment**: Optionally containerize and orchestrate using Docker and Kubernetes.

## Running the Application
1. **Start Microservices**: Start each microservice (user and quack services) independently.
2. **Gateway Server**: Launch `SERVER.js` for request routing.
3. **Access the Web Application**: Open `http://localhost:3000` in a web browser.
4. **Run Python Client**: Execute `QuackClientApp.py` to start the desktop client.

## Python Desktop Client Usage
- **Login/Signup**: Authenticate or create a new user account.
- **Post Quacks**: Share new quacks.
- **View and Interact with Quacks**: View, like, comment, and delete quacks.

## Microservices Management
- Independently monitor and scale services.
- Update services with minimal impact on others.

## Security and Deployment Considerations
- Implement robust security measures, especially for user data and service communication.
- Consider cloud deployment for scalability and high availability.

## Support
For contributions or issues, please use the project's GitHub repository. For questions specific to the Python client, refer to `QuackClientApp.py`.
