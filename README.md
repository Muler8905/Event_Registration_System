# Event Registration System

A full-stack web application for event management and registration built with React, Node.js, Express, and PostgreSQL.

## Features

### User Features
- User registration & login (JWT based)
- Browse upcoming and past events
- Event search, filter, and category view
- Event details page
- Event registration (free & paid-ready)
- View & cancel registrations
- User profile management

### Admin Features
- Admin authentication & role management
- Create, update, delete events
- Upload event images
- Set event capacity & deadlines
- View registered users per event
- Dashboard analytics

### System Features
- Responsive UI (mobile-first)
- Secure REST APIs
- Role-based access control
- Scalable modular architecture
- Environment-based configuration

## Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router v6
- Axios
- React Hook Form + Zod
- Context API

### Backend
- Node.js + Express.js
- JWT Authentication
- bcrypt for password hashing
- Prisma ORM
- PostgreSQL
- Multer for file uploads
- Nodemailer for emails

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-registration-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup Backend Environment**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` with your database and email configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/event_registration"
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (Optional - for email notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Setup Database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed database with sample data (includes admin user and demo events)
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Backend server on http://localhost:5000
   - Frontend server on http://localhost:5173

### Default Accounts (After Seeding)

- **Admin Account**: admin@eventhub.com / admin123
- **Demo User**: demo@example.com / demo123

### Database Commands

```bash
# Reset database and reseed with fresh data
npm run db:reset

# Only seed data (without reset)
npm run db:seed

# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push
```

## Project Structure

```
event-registration-system/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── prisma/          # Database schema
│   │   └── server.js        # Express server setup
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Events
- `GET /api/events` - Get all events (with search/pagination)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/me` - Get user's registrations
- `DELETE /api/registrations/:id` - Cancel registration

## Default Admin Account

After running the database seeder (`npm run db:seed`), you can log in with:

**Admin Account**: admin@eventhub.com / admin123
**Demo User**: demo@example.com / demo123

The seeder creates 10 sample events with realistic data and images to make the system look professional and attractive.

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (optional, defaults to http://localhost:5000/api)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting
- CORS configuration
- Environment-based secrets
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details