const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
});

if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
}

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Static Files
app.use('/uploads', express.static('uploads'));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'NU Technocrats Backend API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to NU Technocrats Club API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            members: '/api/members',
            events: '/api/events',
            announcements: '/api/announcements',
            departments: '/api/departments',
            resources: '/api/resources',
            utilities: '/api/utilities',
            admin: '/api/admin'
        }
    });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
🚀 NU Technocrats Backend Server Started!
📡 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
💾 Database: ${process.env.NODE_ENV === 'production' ? 'Connected' : 'MongoDB Local'}
🔗 API Base URL: http://localhost:${PORT}
📚 Health Check: http://localhost:${PORT}/health
    `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;