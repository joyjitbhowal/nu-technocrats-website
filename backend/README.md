# NU Technocrats Club - Backend API

This is the backend API for the NU Technocrats Club website, built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

4. **Configure Environment Variables**
   Edit `.env` file with your settings:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/nu-technocrats
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Email (optional for development)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### API Base URL
- Development: `http://localhost:5000`
- Health Check: `http://localhost:5000/health`

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── errorMiddleware.js   # Error handling
├── models/
│   ├── User.js             # User schema
│   ├── Department.js       # Department schema
│   ├── Event.js           # Event schema
│   └── Announcement.js    # Announcement schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── memberRoutes.js    # Member endpoints
│   ├── eventRoutes.js     # Event endpoints
│   └── ...               # Other route files
├── services/
│   └── emailService.js    # Email functionality
├── utils/              # Utility functions
├── uploads/           # File uploads
├── scripts/           # Database scripts
├── server.js         # Main server file
└── package.json     # Dependencies
```

## 🛠️ Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Seed database with sample data
npm run seed

# Run database migrations
npm run migrate
```

## 🔧 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Member, Admin, etc.)
- Email verification
- Password reset functionality

### Database Models
- **User**: Complete user profiles with roles and permissions
- **Department**: Club departments with leadership and resources
- **Event**: Comprehensive event management
- **Announcement**: Club communications and notifications

### Security Features
- Password hashing with bcrypt
- JWT token security
- Rate limiting
- CORS protection
- Helmet security headers

### Email System
- Welcome emails
- Email verification
- Password reset emails
- Bulk notifications

## 🌐 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "stack": "..." // Only in development
}
```

## 🔐 Authentication

### JWT Token Usage
Include the token in request headers:
```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `student` - Basic access
- `member` - Club member access
- `team-lead` - Team leadership privileges
- `department-head` - Department management
- `vice-president` - Executive access
- `president` - Full club access
- `admin` - Administrative access
- `coordinator` - Faculty coordinator access

## 📧 Email Configuration

For email functionality, configure SMTP settings:

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use app password in `EMAIL_PASS`

### Environment Variables
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nutechnocrats.club
```

## 🗄️ Database Setup

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# The application will connect automatically
```

### MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nu-technocrats
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Email Sending Failed**
   - Verify email credentials
   - Check SMTP settings
   - Ensure app password is correct

3. **JWT Token Errors**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings

4. **CORS Issues**
   - Update `FRONTEND_URL` in `.env`
   - Check CORS configuration in `server.js`

## 📈 Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=super-secure-production-secret
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "nu-technocrats-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🧪 Testing

### Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test files
npm test -- auth.test.js
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by NU Technocrats Club Development Team**