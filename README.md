# Priva Sync

Priva Sync is a chat application with authentication, protected routes, and AI-powered conversation support.

## Project Structure

- `backend/` - Node.js + Express backend API
  - `Controllers/` - Authentication and chat controller logic
  - `Middlewares/` - JWT auth and validation middleware
  - `Models/` - MySQL database connection and user model
  - `Routes/` - Auth and chat routes
- `chat-brat/` - React + TypeScript frontend built with Vite
  - `src/` - React app source files
  - `src/components/` - UI pages and reusable components
  - `src/services/api.ts` - API helpers for auth and chat

## Features

- Email/password signup and login
- JWT-based protected routes
- Chat messaging with Google Gemini AI
- Markdown rendering for chat responses
- Local storage for token and user info

## Backend Details

The backend runs on Express:

- `POST /auth/signup` - Create a new user
- `POST /auth/login` - Authenticate and return a JWT (secret Key for JWT token is password hash of user)
- `GET /auth/verify` - Verify a token
- `POST /chat/message` - Send a message to the Gemini model

### Database

The backend uses a MySQL database named `chat-brat_users` and a table named `user`.

Example schema:

```sql
CREATE DATABASE chat-brat_users;
USE chat-brat_users;
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  pass VARCHAR(255)
);
```

### Environment variables

Create a `.env` file inside `backend/` with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Frontend Details

The frontend is located in `chat-brat/` and uses React, TypeScript, and Vite.

- `src/App.tsx` - App routes and auth check
- `src/components/Chat.tsx` - Chat UI and message handling
- `src/services/api.ts` - Auth and chat request utilities

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

To start the backend:

```bash
npm start
```

### Frontend
To run frontend:
```bash
cd chat-brat
npm install
npm run dev
```

## Notes

- The backend currently derives the JWT secret from the user's hashed password. For production, switch to a dedicated `JWT_SECRET`.
- The frontend base API URL is `http://localhost:8080` in `chat-brat/src/services/api.ts`.
- The app stores `token` and `user` in `localStorage`.

## Improvements (I would like to add in future)

- Add password reset support
- Implement chat history
- Add Image, File inside prompt

