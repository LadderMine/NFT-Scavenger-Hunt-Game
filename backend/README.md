## NFT Scavenger Hunt Backend

This repository contains the backend for the **NFT Scavenger Hunt** application, built with [NestJS](https://nestjs.com/). The backend is responsible for handling authentication, API endpoints, database interactions, and other server-side functionality required for the NFT Scavenger Hunt experience.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Testing Endpoints](#testing-endpoints)
- [API Documentation](#api-documentation)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview

The **NFT Scavenger Hunt** backend provides the server-side logic for managing users, NFTs, hunts, and rewards. It is built using NestJS for its modular architecture and TypeScript for type safety and maintainability.  

The primary objectives include:
- Managing user authentication and session handling.
- Facilitating interactions with the NFT-related features.
- Providing endpoints for frontend consumption.
- Ensuring a scalable and maintainable backend architecture.

---

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v13 or later)
- [Git](https://git-scm.com/)

---

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/NFT-scavenger-hunt.git
   cd NFT-scavenger-hunt
   ```

2. **Navigate into the backend folder:**
  navigate into the backend folder:
   ```bash
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up the database:**
   Ensure PostgreSQL is running and create a database for the application.

5. **Configure environment variables:**
   Create a `.env` file in the root of the project and add the required variables (see the [Environment Variables](#environment-variables) section below).

6. **Run database migrations (if applicable):**
   ```bash
   npm run typeorm:run
   ```

---

## Environment Variables

The application uses the following environment variables. Ensure they are configured in a `.env` file:

```plaintext
# Database configuration
DATABASE_HOST=localhost                 # Database host
DATABASE_PORT=5432                      # Database port
DATABASE_USER=your_database_user        # Database username
DATABASE_PASSWORD=your_database_password # Database password
DATABASE_NAME=nft_scavenger_hunt        # Database name
DATABASE_SYNC=true                      # Enable auto-sync for entities (use with caution in production)
DATABASE_LOAD=true                      # Enable autoload of entities (true/false)

# Environment
NODE_ENV=development                    # Application environment (development/production)
API_VERSION=v1                          # API version (e.g., v1)
```

---

## Running the Server

1. **Start the development server:**
   ```bash
   npm run start
   ```

2. **Run the production server:**
   ```bash
   npm run start:prod
   ```

3. **Watch for file changes (hot-reloading):**
   ```bash
   npm run start:dev
   ```

The server will be available at `http://localhost:<port>` (default: 3000).

---

## Testing Endpoints

You can test the API endpoints using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

1. Start the server (see [Running the Server](#running-the-server)).
2. Access the API at `http://localhost:3000/api/<version>` (replace `<version>` with the configured API version).

---

## API Documentation

The application uses [Swagger](https://swagger.io/) for API documentation. Once the server is running, you can access the documentation at:

- **Swagger UI:** `http://localhost:3000/api/docs`

This provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Contribution Guidelines

We welcome contributions to the NFT Scavenger Hunt backend! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your meaningful commit message here"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request to the `main` branch of this repository.

Please ensure your code follows the existing style and passes all linting and tests. For more detailed guidelines, refer to the [Contribution Guidelines](https://gist.github.com/yusuftomilola/940e7b0be02b69e41cdeda95b4925e21).

## License

This project is licensed under the [MIT License](LICENSE).

