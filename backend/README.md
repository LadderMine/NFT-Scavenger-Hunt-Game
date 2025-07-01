<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CORS Configuration

The backend is configured to handle Cross-Origin Resource Sharing (CORS) for development purposes:

- Frontend Origin: http://localhost:3000
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Security Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
- Credentials: Enabled

### Setup Instructions

1. Create a `.env` file in the root directory
2. Add the following environment variables:
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development

To test if everything is working:

Start your backend (should run on port 3001)
Start your frontend (should run on port 3000)
Make a test request from frontend to backend
Check browser's developer tools Network tab - you should see no CORS errors

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

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
- [Modules](#modules)

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

## Modules

- **Achievements**: Manage player achievements and badges.
- **Content**: Handle educational articles and videos.
- **In-App Notifications**: Manage notifications within the application.
- **Puzzle**: Core puzzle management for the scavenger hunt.
- **Puzzle Category**: Categorization of puzzles.
- **Puzzle Dependency**: Manage dependencies and eligibility for puzzles.
- **Puzzle Submission**: Handle player submissions for puzzles.
- **Rewards**: Manage NFT and other rewards.
- **Time Trial**: Handle time-based challenges.
- **User Inventory**: Manage player inventory including NFTs and badges.
- **User Report Card**: Track player progress and performance.
- **NFT Claim**: Standalone module for handling NFT claims via StarkNet smart contracts, supporting both mock and real interactions with error handling and retry logic.
