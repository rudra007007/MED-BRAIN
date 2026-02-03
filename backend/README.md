# Med-Brain Backend API

A Node.js/Express backend for a preventive lifestyle health app with MongoDB.

## Features

- **Authentication**: JWT-based auth with signup, login, and protected routes
- **User Management**: Onboarding, preferences, profile management
- **Lifestyle Tracking**: Daily data entry and time-series retrieval
- **Analysis Engine**: Mock analysis results (ML-ready architecture)
- **Community**: Posts, comments, reactions with anonymous support

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Start MongoDB

Make sure MongoDB is running locally or update the connection string in `.env`.

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| POST | `/api/user/onboarding` | Save onboarding data |
| PUT | `/api/user/preferences` | Update preferences |

### Lifestyle Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lifestyle` | Get lifestyle data (range) |
| POST | `/api/lifestyle` | Save daily lifestyle data |
| GET | `/api/lifestyle/:date` | Get data for specific date |
| GET | `/api/lifestyle/analysis` | Get analysis results |

### Community

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/posts` | Get community feed |
| POST | `/api/community/posts` | Create new post |
| GET | `/api/community/posts/:id` | Get single post |
| POST | `/api/community/posts/:id/comments` | Add comment |
| POST | `/api/community/posts/:id/reactions` | Add reaction |
| DELETE | `/api/community/posts/:id/reactions` | Remove reaction |
| GET | `/api/community/my-posts` | Get user's posts |

## Request Examples

### Signup

```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "health_enthusiast"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Save Lifestyle Data

```json
POST /api/lifestyle
{
  "date": "2024-01-15",
  "sleep": {
    "hours": 7.5,
    "quality": "good",
    "bedtime": "23:00",
    "wakeTime": "06:30"
  },
  "activity": {
    "steps": 8500,
    "activeMinutes": 45,
    "intensity": "moderate"
  },
  "screenTime": {
    "totalHours": 3.5,
    "beforeBed": false
  },
  "stress": {
    "level": "low",
    "mood": "good"
  }
}
```

### Create Community Post

```json
POST /api/community/posts
{
  "postType": "progress",
  "content": "Hit my 10k steps goal today! Feeling great about the progress.",
  "optionalMetrics": {
    "steps": 10250,
    "mood": "great"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/med-brain |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| FRONTEND_URL | CORS origin | http://localhost:3000 |

## Project Structure

```
backend/
├── config/
│   ├── db.js           # Database connection
│   └── constants.js    # App constants
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── lifestyleController.js
│   └── communityController.js
├── middleware/
│   └── auth.js         # JWT authentication
├── models/
│   ├── User.js
│   ├── LifestyleData.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── lifestyle.js
│   └── community.js
├── utils/
│   ├── errorResponse.js
│   └── helpers.js
├── server.js           # Entry point
├── package.json
└── .env.example
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Protected routes middleware
- Input validation with express-validator
- CORS configuration
- No sensitive data exposure

## Analysis Response Format

```json
{
  "driftScore": 35,
  "riskTrend": "stable",
  "consistencyScore": 80,
  "lifestyleState": "moderate",
  "topContributors": [
    { "factor": "activity", "impact": "medium", "message": "Daily steps below 10,000" }
  ],
  "summary": {
    "avgSleep": 7.2,
    "avgSteps": 7500,
    "avgScreenTime": 3.5,
    "daysTracked": 24
  }
}
```

## License

MIT
