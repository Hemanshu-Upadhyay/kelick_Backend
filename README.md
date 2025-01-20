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
