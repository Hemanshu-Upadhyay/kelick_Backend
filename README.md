# Project Name: Kelick Assignment Backend

## Overview

This Assigment is submitted as proof of concept as part of submission of Frontend and Backend

---

## Flow

### 1. **Authentication Flow (Login/Signup)**

- **Signup**: Users can create a new account by providing their credentials (username/email, password).
- **Login**: After signing up, users can log in using their credentials. Upon successful login, a JWT token is issued to the user.
- **Authentication Middleware**: The token is sent with each request in the `Authorization` header. The middleware verifies the token, ensuring the user is authenticated before they can access protected routes (e.g., fetching tax data).

### 2. **Tax Data Flow**

- **Fetching Tax Data**: When a user requests their tax data (via `GET /tax-data/:userId`), the following sequence occurs:

  1.  **Cache Check**: The system checks Redis to see if the tax data for the user is cached.
  2.  **Cache Hit**: If data is found in the cache, it is returned immediately, bypassing the need to fetch from the database or external API.
  3.  **Cache Miss**: If data is not found in Redis, the system queries the database for the tax data.
  4.  **Database Miss**: If no data is found in the database, the system fetches the tax data from the external IRAS API.
  5.  **Saving Data**: If the data is fetched from the IRAS API, it is stored in the PostgreSQL database for future use and also cached in Redis for quicker access on subsequent requests.

- **Caching**: Redis is used to store tax data with an expiration time of 1 hour to ensure faster access and reduce load on the database and external IRAS API.

### 3. **Job Processor**

- **Tax Data Job Processor**: The job processor periodically processes tax data and may perform background tasks like updating records or fetching the latest tax data. This is implemented using job queues or cron jobs that run on the server.

---

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- Redis
- PostgreSQL

### Steps to Set Up

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Hemanshu-Upadhyay/kelick_Backend.git
   cd kelick_Backend
   ```

2. **Install dependencies**:

   ```bash
   npm install in both folders
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```bash
   DATABASE_URL=postgres://username:password@localhost:5432/tax_data_db
   IRAS_API_URL=http://localhost:6000/iras
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Start Redis**:
   Ensure Redis is running:

   ```bash
   redis-server
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

---

## API Endpoints

### 1. **POST auth/signup**

- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token":"your token"
  }
  ```

### 2. **POST auth/login**

- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
   {
    "token":"your token"
  }
  ```

### 3. **GET /tax-data/:userId**

- **Request**: Requires a valid JWT token in the `Authorization` header.
  ```bash
  curl -H "Authorization: Bearer jwt_token_here" http://localhost:4000/tax-data/123
  ```
- **Response**:
  ```json
  {

    "id": 11,
    "employeeName": "John Doe",
    "taxYear": "2024",
    "taxableIncome": 50000,
    "taxAmount": 5000
  }
  ```

### 4. **POST /iras (Mock IRAS API)**

- **Request**: Sent by the service to fetch data from the external IRAS API (hosted on a different server).
  ```bash
  curl -X POST  http://localhost:6000/iras
  ```
- **Response**:
  ```json
  {
    "employeeName": "John Doe",
    "taxYear": "2024",
    "taxableIncome": 50000,
    "taxAmount": 5000
  }
  ```

---

## Project Structure

```
├── config/
│   ├── prismaClient.js       # Prisma client setup for PostgreSQL
│   ├── redisClient.js        # Redis client setup
│   └── logger.js             # Logger setup
├── controllers/              # Controller files for handling requests
│   ├── authController.js     # Authentication logic (signup, login)
│   └── taxDataController.js  # Tax data fetching logic with Redis caching
├── services/                 # External services like IRAS API
│   └── irasService.js        # Service to interact with the mock IRAS API
├── routes/                   # Route definitions
│   ├── authRoutes.js         # Routes for authentication
│   └── taxDataRoutes.js      # Routes for fetching tax data
├── middlewares/              # Middlewares for rate limiting and authentication
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── rateLimiterMiddleware.js  # Rate limiting middleware
│   └── cacheMiddleware.js    # Cache validation middleware
├── jobs/                     # Background jobs (e.g., tax data processor)
│   └── taxDataJobProcessor.js # Job processor logic
├── .env                      # Environment variables
├── package.json              # Project dependencies and scripts
└── server.js                 # Main entry point to start the server
```

---

## Testing

To test the application:

1. **Run Unit Tests**:
   Ensure you have unit tests set up (if you have any). You can run tests using a testing framework like Jest or Mocha.

2. **Test API Endpoints**:
   - Use Postman or CURL to test the API endpoints.
   - Test login and signup first to ensure authentication is working.
   - Test the `/tax-data/:userId` endpoint to confirm Redis caching is functioning as expected.

---

## Troubleshooting

- **Redis Connection Issues**:
  - Ensure Redis server is running and accessible. You can check Redis status using `redis-cli` and `ping` the server.
- **JWT Token Errors**:
  - Ensure you are passing the token correctly in the `Authorization` header of requests.
  - Check for any errors related to invalid tokens in the response.

---
