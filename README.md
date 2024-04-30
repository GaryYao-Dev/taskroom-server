# Task Room Server-side

Prerequisites
Before running the application, ensure that the following prerequisites are met:

Node.js is installed (version 18.16.1 or higher)
MongoDB is installed and running

## Installation

1. Clone the repo

   ```sh
   git clone
   ```
2. Install NPM packages

   ```sh
   cd server
   npm install
   ```
3. Configure the application

   ```sh
   MONGO_URI=mongodb+srv://taskRoom:*****@taskroom.*****.mongodb.net/taskRoomDB
   ```
4. Run the application

   ```sh
   npm start
   ```
5. The server should start running on `http://localhost:8000`
6. Run the test
   
   add the following line into `.env` file

   ```bash
   MONGO_TEST_URI=mongodb+srv://taskRoom:*****@taskroom.*****.mongodb.net/test
   ```

   run `npm test` in terminal

## Project Structure

The folder structure of this app is explained below:

├── src/
│   ├── __test__/ # Unit tests
│   │   ├── task.controller.test.js # Tests for the task controller
│   │   └── test.app.js # Test express app
│   ├── config/ # Configuration files
│   │   └── index.js # Configuration for the project
│   ├── controllers/ # Controllers handling business logic
│   │   ├── tasks.controller.js # Controller for tasks
│   │   └── users.controller.js # Controller for users
│   ├── errors/ # Custom error classes
│   │   └── not.found.js # 404 Not Found error class
│   ├── loaders/ # Loader functions
│   │   ├── db.js # Database connection loader
│   │   ├── express.js # Express app loader
│   │   └── index.js # Loader for all other loaders
│   ├── middleware/ # Middleware functions
│   │   └── error-handler.js # Error handler middleware
│   ├── models/ # Database models and schemas
│   │   ├── task.model.js # Model for tasks
│   │   └── user.model.js # Model for users
│   ├── routes/ # API routes
│   │   ├── index.js # Main router
│   │   ├── tasks.route.js # Router for tasks
│   │   └── users.route.js # Router for users
│   └── utils/ # Utility functions
│       ├── logger.js # Logger utility
│       ├── swagger.comment/ # Swagger comments for models and controllers
│       │   ├── controller.js
│       │   └── model.js
│       └── swagger.js # Swagger configuration
├── index.js # Entry point of the application
├── app.js # Express app
├── package.json # Project dependencies and scripts
├── .env# Environment variables (ignored by Git)
├── .gitignore # List of ignored files and folders
├── .eslintrc.js # ESLint configuration
└── README.md # Project documentation

## API Endpoints

The API endpoints are described below:

### Authentication

| Method | Endpoint           | Access     | Description            |
| ------ | ------------------ | ---------- | ---------------------- |
| POST   | `/api/v1/signup` | Public     | Register a new account |
| POST   | `/api/v1/login`  | Public     | Login with credentials |
| POST   | `/api/v1/tasks`  | Authorized | create a new task      |
| POST   | `/api/v1/users`  | Authorized | create a new user      |

### Task

| Method | Endpoint          | Access     | Description       |
| ------ | ----------------- | ---------- | ----------------- |
| POST   | `/api/v1/tasks` | Authorized | create a new task |

### User

| Method | Endpoint          | Access     | Description       |
| ------ | ----------------- | ---------- | ----------------- |
| POST   | `/api/v1/users` | Authorized | create a new user |

## License

Distributed under the MIT License.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
