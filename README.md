# Zoku

A modern full-stack web application with authentication built using Next.js and FastAPI.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Context API
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.13
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy 2.0
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **Server:** Uvicorn

## 📁 Project Structure

```
Zoku/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   │   ├── (auth)/         # Auth pages (login, signup, etc.)
│   │   ├── home/           # Authenticated home page
│   │   └── page.tsx        # Landing page
│   ├── components/          # React components
│   │   ├── landing/        # Landing page components
│   │   ├── pages/          # Page-specific components
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts (Auth)
│   ├── api/                # API client functions
│   └── lib/                # Utilities
│
└── backend/                 # FastAPI application
    ├── server/
    │   ├── api/            # API route handlers
    │   │   └── auth.py     # Authentication endpoints
    │   ├── models/         # SQLAlchemy models
    │   │   └── users.py    # User model
    │   ├── schemas/        # Pydantic schemas
    │   │   └── users.py    # User schemas
    │   ├── crud/           # Database operations
    │   │   └── users.py    # User CRUD
    │   ├── utils/          # Utilities
    │   │   ├── auth.py     # JWT & password utilities
    │   │   ├── config.py   # Settings
    │   │   └── database.py # Database connection
    │   └── main.py         # FastAPI app entry
    └── requirements.txt     # Python dependencies
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+ and Yarn
- Python 3.13+
- PostgreSQL database

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zoku
SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:3000
DEBUG=True
```

6. Run the development server:
```bash
python run.py
```

The backend will be available at `http://localhost:8000`

## 🔑 Features

### Authentication System
- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ JWT-based authentication
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ Secure password hashing with bcrypt

### User Interface
- ✅ Modern, responsive design
- ✅ Dark/Light theme support
- ✅ Beautiful landing page
- ✅ Form validation with error handling
- ✅ Toast notifications
- ✅ Loading states

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/google/login` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user info
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Health
- `GET /health` - Health check endpoint

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend URL
4. Deploy

### Backend (Vercel/Railway/Render)

1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy using your preferred platform

## 🔧 Development

### Frontend Commands
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

### Backend Commands
```bash
python run.py     # Start development server
```

## 🗄️ Database Schema

### Users Table
- `user_id` - Primary key
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - Unique email address
- `password` - Hashed password
- `profile_image` - Profile image URL (optional)
- `is_active` - Account status
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp
- `ref_auth` - OAuth reference (for Google login)
- `reset_token` - Password reset token
- `reset_token_expiry` - Reset token expiration
- `meta` - Additional metadata (JSON)

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- CORS configured for frontend origin
- Environment variables for sensitive data
- SQL injection protection via SQLAlchemy ORM
- Input validation with Pydantic/Zod

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ by the Zoku team

## 🐛 Known Issues

None at the moment. Please report any issues you find!

## 📞 Support

For support, email support@zoku.com or open an issue in the repository.

---

**Happy Coding! 🎉**
