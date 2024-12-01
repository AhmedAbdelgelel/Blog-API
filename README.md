# Blog Website API

A full-featured RESTful API for a blog website built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Signup, Login, Email Verification)
- Password Reset Functionality
- Blog Post Management (CRUD operations)
- Comment System
- Input Validation
- Error Handling
- JWT Authentication
- Email Notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   - Copy `.env.example` to `.env`
   - Fill in your configuration values

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- GET `/api/auth/verify-email/:code` - Verify email

### Blog Posts
- POST `/api/blog/create` - Create a new blog post
- GET `/api/blog` - Get all blog posts
- GET `/api/blog/:id` - Get a specific blog post
- PUT `/api/blog/:id` - Update a blog post
- DELETE `/api/blog/:id` - Delete a blog post

### Comments
- POST `/api/blog/:id/comments` - Add a comment to a blog post
- DELETE `/api/blog/:blogId/comments/:commentId` - Delete a comment

### User Profile
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update user profile

## Security Features

- Password Hashing
- JWT Authentication
- Input Validation
- XSS Protection
- Rate Limiting
- Error Handling

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

## Error Handling

The API includes a global error handling middleware that provides consistent error responses across all endpoints.

## Input Validation

All endpoints include input validation using express-validator to ensure data integrity.
