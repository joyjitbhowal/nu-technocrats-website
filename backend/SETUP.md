# NU Technocrats Club Backend Setup Guide

This guide will help you set up and run the backend server for the NU Technocrats Club website.

## 📋 Prerequisites

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download here](https://www.mongodb.com/)
- **Git** (for version control) - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nu-technocrats-club
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nu-technocrats-club

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
REFRESH_TOKEN_EXPIRES_IN=30d

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@nutechnocrats.club
ADMIN_PASSWORD=admin123

# Optional: AI Integration (Google Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Database Setup & Seeding
Set up your database with sample data:

```bash
# Seed the database with sample data
npm run seed
```

This will create:
- **Admin user** with full access
- **Sample departments** (Web Dev, AI/ML, Cybersecurity, Mobile Dev, UI/UX)
- **Sample users** with different roles (president, vice-president, members)
- **Sample announcements** and events

### 4. Start the Server

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📁 Project Structure

```
backend/
├── config/          # Configuration files
│   └── database.js  # Database connection
├── controllers/     # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── adminController.js
│   └── ...
├── middleware/      # Custom middleware
│   ├── auth.js      # Authentication middleware
│   ├── errorHandler.js
│   └── ...
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Department.js
│   ├── Event.js
│   └── Announcement.js
├── routes/          # API routes
│   ├── auth.js
│   ├── admin.js
│   └── ...
├── scripts/         # Utility scripts
│   └── seedDatabase.js
├── services/        # Business logic
│   └── emailService.js
├── utils/           # Utility functions
├── uploads/         # File uploads (created automatically)
├── server.js        # Main server file
└── .env            # Environment variables
```

## 🔐 Default Admin Credentials

After seeding the database, you can log in with:
- **Email**: `admin@nutechnocrats.club` (or your ADMIN_EMAIL from .env)
- **Password**: `admin123` (or your ADMIN_PASSWORD from .env)

## 🛠️ Available Scripts

```bash
# Start server in production mode
npm start

# Start server in development mode with auto-restart
npm run dev

# Seed database with sample data
npm run seed

# Run tests
npm test
```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /verify-email` - Verify email address

### Admin Routes (`/api/admin`) - Requires Admin Role
- `GET /dashboard` - Get dashboard statistics
- `GET /users` - Get all users with pagination
- `PUT /users/:id` - Update user details
- `DELETE /users/:id` - Delete user
- `PUT /users/:id/membership` - Update membership status
- `POST /users/bulk-email` - Send bulk email notifications
- `GET /analytics` - Get system analytics
- `GET /logs` - Get system logs

### User Routes (`/api/users`) - Coming Soon
- User management endpoints

### Event Routes (`/api/events`) - Coming Soon
- Event CRUD operations

### Department Routes (`/api/departments`) - Coming Soon
- Department management

### Announcement Routes (`/api/announcements`) - Coming Soon
- Announcement management

## 🔧 Configuration Details

### Database Configuration
The application supports both local MongoDB and MongoDB Atlas:

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/nu-technocrats-club
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nu-technocrats-club
```

### Email Configuration
Configure email service for notifications:

**Gmail (recommended for development):**
```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Generate app password in Gmail
```

**Other SMTP Services:**
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

### Security Features
- **JWT Authentication** with refresh tokens
- **Password hashing** using bcrypt
- **Rate limiting** to prevent abuse
- **CORS** configuration for frontend integration
- **Helmet** for security headers
- **Input validation** using Joi

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MongoDB is running
   - Check your MONGODB_URI in .env
   - For Atlas, ensure your IP is whitelisted

2. **Email Service Not Working**
   - For Gmail, enable 2FA and generate an app password
   - Check your email credentials in .env
   - Ensure "Less secure app access" is enabled (not recommended for production)

3. **JWT Errors**
   - Ensure JWT_SECRET is set and secure
   - Check token expiration settings

4. **Permission Denied**
   - Check user roles in database
   - Ensure middleware is correctly applied to routes

### Logs and Debugging
- Check server logs in the terminal
- Enable debug mode by setting `NODE_ENV=development`
- Use `npm run dev` for detailed error messages

## 📚 Next Steps

1. **Frontend Integration**: Connect with the React frontend
2. **Email Templates**: Customize email templates in `services/emailService.js`
3. **File Uploads**: Configure Cloudinary for image uploads
4. **API Documentation**: Generate API documentation using Swagger
5. **Testing**: Add comprehensive test coverage
6. **Deployment**: Deploy to production (Heroku, AWS, etc.)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check this setup guide
2. Review the error logs
3. Check the .env configuration
4. Contact the development team

---

**Happy coding! 🚀**