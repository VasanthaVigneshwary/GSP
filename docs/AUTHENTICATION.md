# Authentication System - Setup & Usage Guide

**Status:** ✅ Complete  
**Created:** May 1, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Complete JWT-based authentication system for GSP with:
- ✅ User registration (signup)
- ✅ User login with credentials
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Token refresh mechanism
- ✅ User profile management
- ✅ Protected routes
- ✅ Beautiful UI with React

### Tech Stack
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React, React Router, Axios
- **Auth:** JWT (JSON Web Tokens), bcryptjs
- **Styling:** Custom CSS with modern design

---

## Project Structure

```
GSP/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MongoDB connection
│   │   │   └── jwt.js            # JWT utilities
│   │   ├── models/
│   │   │   └── User.js           # User schema & methods
│   │   ├── controllers/
│   │   │   └── authController.js # Auth logic
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT verification
│   │   ├── routes/
│   │   │   └── auth.js           # Auth endpoints
│   │   └── server.js             # Express server
│   ├── .env                      # Environment variables
│   ├── package.json              # Dependencies
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Signup.js         # Signup page
│   │   │   └── Dashboard.js      # User dashboard
│   │   ├── services/
│   │   │   └── authService.js    # API calls
│   │   ├── styles/
│   │   │   ├── index.css         # Global styles
│   │   │   ├── app.css           # App styles
│   │   │   ├── auth.css          # Auth pages styles
│   │   │   └── dashboard.css     # Dashboard styles
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── package.json              # Dependencies
│   └── .env.local
│
└── docs/
    └── AUTHENTICATION.md         # This file
```

---

## Backend Setup

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- MongoDB 4.4+ ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/gsp
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gsp
   
   # JWT
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_secret_change_this
   REFRESH_TOKEN_EXPIRE=30d
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB:**
   - **Local:** `mongod`
   - **Atlas:** Connection string in `.env`

5. **Start backend server:**
   ```bash
   npm run dev
   ```

   Expected output:
   ```
   ✓ Server running on port 5000
   ✓ Environment: development
   ✓ API Base URL: http://localhost:5000/api
   ✓ MongoDB Connected: localhost
   ```

### Backend Endpoints

All endpoints require `Content-Type: application/json`

#### 1. **User Signup**
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "password123",
  "passwordConfirm": "password123",
  "department": "Computer Science",
  "year": "Junior"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@university.edu",
      "department": "Computer Science",
      "year": "Junior",
      "points": 0,
      "rank": 0,
      "badges": [],
      "createdAt": "2026-05-01T10:30:00Z"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. **User Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@university.edu",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@university.edu",
      "points": 150,
      "rank": 42,
      "badges": ["Early Bird", "Social Butterfly"]
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 3. **Get Current User**
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### 4. **Refresh Token**
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

#### 5. **Update Profile**
```
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Computer Science student",
  "department": "Engineering",
  "year": "Senior"
}
```

---

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   Create `.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   Server opens at `http://localhost:3000`

### Pages

#### **Login Page** (`/login`)
- Email and password input fields
- "Forgot password?" link
- Link to signup page
- Demo credentials display
- Error handling with alerts
- Loading state

#### **Signup Page** (`/signup`)
- Full name input
- Email input
- Department dropdown
- Year dropdown
- Password fields with confirmation
- Form validation
- Error handling

#### **Dashboard** (`/dashboard`)
- Protected route - requires authentication
- User profile information
- Gamification statistics:
  - Total points
  - Current rank
  - Badge count
- List of earned badges
- Logout button

### Features

✅ **JWT Token Management**
- Automatic token storage in localStorage
- Token refresh mechanism
- Secure header transmission

✅ **Protected Routes**
- Redirect to login if not authenticated
- Loading state while checking auth
- Automatic redirect after successful login

✅ **Context API State Management**
- Global auth state
- User information
- Loading and error states
- Callback functions for all operations

✅ **Error Handling**
- Form validation
- API error messages
- User-friendly error alerts

✅ **Responsive Design**
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly buttons

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
```
Authorization: Bearer <your_jwt_token>
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing

### Test Credentials

**Valid User:**
```
Email: student@university.edu
Password: password123
```

### Manual Testing Steps

1. **Test Signup:**
   - Go to `/signup`
   - Fill in all fields
   - Click "Create Account"
   - Should redirect to dashboard

2. **Test Login:**
   - Go to `/login`
   - Enter email and password
   - Click "Sign In"
   - Should display dashboard

3. **Test Protected Route:**
   - Clear localStorage (DevTools → Application)
   - Try to access `/dashboard`
   - Should redirect to `/login`

4. **Test Token Refresh:**
   - Make a login request
   - Note the token
   - Wait or manually trigger refresh
   - Old token should be replaced

### API Testing with cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "department": "Computer Science",
    "year": "Junior"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Deployment

### Environment Variables for Production

Create `.env` for backend:
```env
PORT=5000
NODE_ENV=production

# Use MongoDB Atlas in production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gsp

# Use strong secrets in production
JWT_SECRET=generate_a_long_random_string_here
REFRESH_TOKEN_SECRET=generate_another_random_string_here

# Update CORS for your domain
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms

#### **Backend (Heroku/Railway/Render)**
```bash
npm run build
# or
npm start
```

#### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy the build folder
```

### Security Checklist

- [ ] Change JWT secrets to random 32+ character strings
- [ ] Use HTTPS for all URLs
- [ ] Set `NODE_ENV=production`
- [ ] Enable MongoDB authentication
- [ ] Set appropriate CORS_ORIGIN
- [ ] Remove demo credentials
- [ ] Enable HTTPS redirect
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Monitor logs for errors

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
✗ Error connecting to MongoDB: connect ECONNREFUSED
```
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- For Atlas: verify IP whitelist

**Port Already in Use:**
```
Error: listen EADDRINUSE :::5000
```
- Change PORT in `.env`
- Or kill process: `lsof -i :5000` → `kill -9 <PID>`

**JWT Secret Not Set:**
```
Error: jwt must be provided
```
- Add `JWT_SECRET` to `.env`
- Restart server

### Frontend Issues

**Cannot Connect to Backend:**
```
Error: Failed to fetch (or similar)
```
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env.local`
- Verify CORS_ORIGIN matches frontend URL

**Tokens Not Persisting:**
- Check browser localStorage is enabled
- Clear browser cache/cookies
- Try private/incognito mode

**Login Redirects to Login Page:**
- Token may be expired
- Check token validity in localStorage
- Try refreshing the page
- Clear localStorage and login again

### General Debugging

**Enable Console Logs:**

Backend (`server.js`):
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

Frontend (DevTools):
- Open F12 → Console tab
- Check for errors and network requests
- Check network tab for API calls

---

## Security Notes

1. **JWT Secrets:** Keep very secret, never commit to git
2. **Password Hashing:** Uses bcryptjs with salt rounds of 10
3. **Token Expiry:** Access tokens expire in 7 days
4. **HTTPS:** Always use HTTPS in production
5. **Input Validation:** All inputs validated on backend
6. **CORS:** Configured to accept only specified origins

---

## Next Steps

1. ✅ Authentication system complete
2. ⏳ Add Email verification
3. ⏳ Implement Password reset
4. ⏳ Add Two-factor authentication
5. ⏳ Integrate with event management system
6. ⏳ Add OAuth (Google, GitHub)
7. ⏳ Add user roles (Admin, Organizer, Student)

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review error messages carefully
3. Check browser console (F12)
4. Check server logs
5. Review `.env` configuration

