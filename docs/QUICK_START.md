# Quick Start Guide - Run the Application

## Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✓ Server running on port 5000
✓ API Base URL: http://localhost:5000/api
✓ MongoDB Connected
```

## Start Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Browser opens at: `http://localhost:3000`

## Test the Application

### Signup Flow
1. Go to `http://localhost:3000/signup`
2. Fill in all fields:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
   - Confirm: password123
   - Department: Computer Science
   - Year: Junior
3. Click "Create Account"
4. Should see dashboard with 0 points

### Login Flow
1. Go to `http://localhost:3000/login`
2. Use credentials from signup
3. Click "Sign In"
4. Should see dashboard

### Dashboard
- Shows your profile info
- Shows gamification stats (0 points initially)
- Shows earned badges (empty initially)
- Has logout button

## Database

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Get connection string
4. Update `.env` file

## Troubleshooting

**Backend won't start:**
```bash
# Kill any process on port 5000
lsof -i :5000
kill -9 <PID>

# Try again
npm run dev
```

**Frontend won't connect:**
- Check backend is running
- Check REACT_APP_API_URL matches backend URL
- Check CORS_ORIGIN in backend .env

**MongoDB connection error:**
- Ensure mongod is running
- Check MONGODB_URI in .env
- Verify MongoDB is accessible

## API Endpoints

All endpoints documented in [AUTHENTICATION.md](./AUTHENTICATION.md)

Key endpoints:
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

