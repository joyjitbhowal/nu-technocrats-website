# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

The NU Technocrats Club Website is a static HTML/CSS/JavaScript website showcasing a university technical club. The project serves as a digital hub for the club's activities, featuring comprehensive information about departments, members, events, resources, and utilities.

## Tech Stack & Architecture

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid/Flexbox, CSS custom properties, responsive design
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter family)
- **AI Integration**: Google Gemini AI API (optional)
- **No Build System**: Direct browser execution, no compilation required

### File Structure
```
nu-technocrats-website/
├── index.html              # Main landing page
├── departments.html        # Department showcase
├── people.html            # Faculty and mentors
├── students.html          # Student directory
├── utilities.html         # Resources and AI assistant
├── gallery.html           # Event gallery
├── login.html            # Authentication
├── css/
│   └── style.css         # Main stylesheet (responsive design)
├── js/
│   ├── script.js         # Core site functionality
│   ├── gemini-ai.js      # AI assistant integration
│   ├── students.js       # Student directory features
│   └── utilities.js      # Resource management
├── images/               # Static assets
└── README.md            # Project documentation
```

## Common Development Commands

### Running the Project
```bash
# Method 1: Direct file access
# Simply open index.html in browser
start index.html  # Windows
open index.html   # macOS

# Method 2: Local HTTP server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000

# Method 3: Using Node.js
npx live-server
# Auto-reload on changes

# Method 4: Using PHP
php -S localhost:8000
```

### Development Workflow
```bash
# No build process needed - direct editing
# Edit HTML/CSS/JS files directly
# Refresh browser to see changes

# For production deployment
# Simply upload all files to web server
# No compilation or bundling required
```

### Testing & Validation
```bash
# HTML validation
npx html-validate *.html

# CSS validation (if validator installed)
css-validator css/style.css

# JavaScript linting (if ESLint configured)
npx eslint js/*.js

# Accessibility testing (if pa11y installed)
npx pa11y http://localhost:8000
```

### Asset Management
```bash
# Optimize images (if tools available)
npx imagemin images/* --out-dir=images/optimized

# Check broken links
npx broken-link-checker http://localhost:8000
```

## Architecture Details

### Core JavaScript Modules

#### script.js (Core Site Functionality)
- **Mobile Navigation**: Hamburger menu, responsive navigation
- **Scroll Behavior**: Smooth scrolling, active section highlighting
- **Filter Systems**: Events and projects filtering
- **Form Handling**: Contact forms with validation
- **UI Interactions**: Back-to-top, animations, modal controls

#### students.js (Student Directory)
- **Member Management**: Search, filter, pagination
- **Data Handling**: Local member database simulation
- **View Switching**: Grid/list/table views
- **Profile System**: Detailed member profiles
- **Export Features**: CSV generation for admin users

#### utilities.js (Resource Management)
- **Resource Filtering**: Category-based content filtering
- **AI Chat Interface**: Integration ready for Gemini AI
- **File Upload**: Drag-and-drop resource upload
- **Tool Integration**: External development tools
- **Permission System**: Role-based feature access

#### gemini-ai.js (AI Assistant)
- **API Integration**: Google Gemini AI connection
- **Conversation Management**: Chat history and context
- **Demo Mode**: Offline responses for testing
- **Configuration**: API key management
- **Contextual Responses**: Department-specific assistance

### CSS Architecture

#### Component-Based Styling
- **CSS Custom Properties**: Consistent color/spacing system
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable UI components
- **Utility Classes**: Layout and spacing helpers
- **Animation System**: Smooth transitions and effects

#### Key Design Patterns
- **Section-Based Layout**: Each page divided into semantic sections
- **Card Components**: Consistent card design across features
- **Filter Systems**: Unified filtering UI patterns
- **Form Styling**: Consistent form controls and validation
- **Modal System**: Overlay components for detailed views

### Data Management Patterns

#### Client-Side Data Handling
- **Local Storage**: User preferences and API keys
- **JavaScript Objects**: Member data, event information
- **Simulated APIs**: Demo data for development
- **CSV Export**: Data export functionality
- **Search/Filter**: Real-time client-side filtering

#### Form Processing
- **Client-Side Validation**: Input validation and error handling
- **FormData API**: File upload handling
- **Email Integration**: mailto: links for communication
- **Notification System**: User feedback for actions

## Integration Points

### Gemini AI Integration
- **API Configuration**: User-configurable API keys stored in localStorage
- **Context Management**: Department-specific conversation context
- **Demo Mode**: Fallback responses when API unavailable
- **Error Handling**: Graceful degradation for API failures

### External Services
- **Font Awesome**: Icon library (CDN)
- **Google Fonts**: Typography (CDN)
- **Social Media**: LinkedIn, GitHub, Twitter integration
- **Email Services**: Contact forms use mailto: protocol

## Development Guidelines

### HTML Standards
- Use semantic HTML5 elements
- Maintain consistent navigation structure across pages
- Include proper meta tags for SEO
- Ensure accessibility attributes (alt text, ARIA labels)

### CSS Best Practices
- Use CSS custom properties for consistent theming
- Implement mobile-first responsive design
- Maintain component-based organization
- Use meaningful class names following BEM-like conventions

### JavaScript Guidelines
- Use ES6+ features consistently
- Implement proper error handling
- Maintain separation of concerns (each file has specific purpose)
- Use event delegation for dynamic content
- Implement proper cleanup for memory management

### Content Management
- Update member data in students.js for directory changes
- Modify event information in index.html for announcements
- Add new resources to utilities.html for learning materials
- Update department information in departments.html

## Performance Considerations

### Loading Strategy
- External resources loaded via CDN
- Images use lazy loading where implemented
- JavaScript modules loaded asynchronously when possible
- CSS uses efficient selectors and minimal specificity

### Optimization Opportunities
- Image compression for faster loading
- CSS/JS minification for production
- Service worker for offline functionality
- Resource caching strategies

## Browser Support

### Target Browsers
- Chrome 90+ (primary development target)
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- CSS Grid with Flexbox fallbacks
- ES6+ with consideration for older browsers
- Progressive enhancement approach
- Graceful degradation for AI features

## Security Considerations

### Client-Side Security
- Input sanitization in forms
- XSS prevention in dynamic content
- API key storage in localStorage (development only)
- No sensitive data in client-side code

### Recommended Production Setup
- HTTPS enforcement
- Content Security Policy headers
- Server-side form processing
- Secure API key management
- Regular security audits

## Troubleshooting Common Issues

### AI Assistant Not Working
- Check API key configuration in localStorage
- Verify Gemini AI API access
- Use demo mode for testing
- Check browser console for errors

### Mobile Navigation Issues
- Verify CSS media queries
- Check JavaScript event listeners
- Test touch interactions
- Validate responsive breakpoints

### Form Submission Problems
- Check form validation logic
- Verify FormData handling
- Test email client integration
- Validate input sanitization

### Performance Issues
- Optimize image sizes
- Check for memory leaks in JavaScript
- Audit CSS for inefficient selectors
- Monitor network requests

This project emphasizes clean, maintainable code with progressive enhancement and accessibility in mind.

## Backend Architecture

The backend is built with Node.js, Express.js, and MongoDB, providing a robust REST API for the frontend.

### Backend Tech Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js with middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **Email**: Nodemailer with template support
- **File Upload**: Multer with Cloudinary integration
- **AI Integration**: Google Gemini AI API

### Backend File Structure
```
backend/
├── config/
│   └── database.js          # MongoDB configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── memberController.js  # Member management
│   ├── eventController.js   # Event management
│   └── ...                 # Other controllers
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── errorMiddleware.js   # Error handling
├── models/
│   ├── User.js             # User schema
│   ├── Department.js       # Department schema
│   ├── Event.js           # Event schema
│   ├── Announcement.js    # Announcement schema
│   └── Resource.js        # Resource schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── memberRoutes.js    # Member endpoints
│   └── ...               # Other route files
├── services/
│   ├── emailService.js    # Email functionality
│   ├── uploadService.js   # File upload handling
│   └── aiService.js      # Gemini AI integration
├── utils/                 # Utility functions
├── uploads/              # Local file storage
├── scripts/              # Database seeding/migration
└── server.js            # Main application entry
```

### Database Schema

#### User Model
- Authentication and profile management
- Role-based access control (Student → Admin hierarchy)
- Department associations and skill tracking
- Activity metrics and preferences

#### Department Model
- Club department organization
- Leadership structure and member management
- Resource libraries and meeting coordination
- Project tracking and statistics

#### Event Model
- Comprehensive event management
- Registration and attendance tracking
- Multi-format support (online/offline/hybrid)
- Feedback and rating systems

#### Announcement Model
- Club communication system
- Targeted audience and scheduling
- Rich media support and engagement tracking
- Comment and interaction features

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration with email verification
- `POST /login` - JWT token authentication
- `GET /me` - Current user profile
- `PUT /profile` - Profile updates
- `POST /forgot-password` - Password reset initiation
- `PUT /reset-password/:token` - Password reset completion

#### Members (`/api/members`)
- `GET /` - Member directory with filtering
- `GET /:id` - Individual member profiles
- `PUT /:id` - Profile updates (own or admin)
- `POST /:id/department` - Department assignment

#### Events (`/api/events`)
- `GET /` - Event listing with filtering
- `POST /` - Event creation (leadership roles)
- `GET /:id` - Event details
- `POST /:id/register` - Event registration
- `PUT /:id` - Event updates

#### Departments (`/api/departments`)
- `GET /` - All departments
- `GET /:id` - Department details
- `POST /:id/join` - Department join requests
- `PUT /:id` - Department updates (heads only)

#### Admin (`/api/admin`)
- User management and role assignment
- Content moderation and analytics
- Bulk operations and system configuration

## Backend Development Commands

### Initial Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if local)
mongod
```

### Development Workflow
```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Database operations
npm run seed        # Populate with sample data
npm run migrate     # Run database migrations

# Testing
npm test           # Run test suite
npm run test:watch # Watch mode for development
```

### Environment Variables
```bash
# Required for backend functionality
MONGODB_URI=mongodb://localhost:27017/nu-technocrats
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email configuration (optional in development)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# External services
GEMINI_API_KEY=your-gemini-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# CORS and security
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Database Management
```bash
# Access MongoDB shell
mongo nu-technocrats

# View collections
show collections

# Sample user query
db.users.find({role: "admin"}).pretty()

# Clear test data
db.users.deleteMany({email: /test/})
```

## Full-Stack Integration

### Frontend-Backend Connection
- Frontend makes API calls to `http://localhost:5000/api/`
- JWT tokens stored in localStorage for authentication
- Real-time updates via RESTful polling (WebSocket planned)

### Data Flow
1. **Authentication**: Frontend → Backend JWT → Database verification
2. **Content**: Database → Backend API → Frontend display
3. **File Uploads**: Frontend → Backend → Cloud storage → Database URLs
4. **AI Integration**: Frontend → Backend proxy → Gemini API → Response

### Development Synchronization
- Both frontend and backend must run simultaneously
- Frontend development server: `http://localhost:3000`
- Backend API server: `http://localhost:5000`
- MongoDB database: `mongodb://localhost:27017`

## Production Deployment Considerations

### Backend Deployment
- Use PM2 or similar process manager
- Configure environment variables securely
- Set up MongoDB Atlas for database
- Enable HTTPS and security headers
- Implement proper logging and monitoring

### Full-Stack Deployment
- Deploy frontend as static files (Netlify/Vercel)
- Deploy backend API (Heroku/DigitalOcean/AWS)
- Configure CORS for production domains
- Set up CI/CD pipelines for both parts
