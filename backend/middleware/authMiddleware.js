const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User no longer exists'
                });
            }

            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'Account has been deactivated'
                });
            }

            // Update last login
            req.user.lastLogin = new Date();
            await req.user.save({ validateBeforeSave: false });

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired'
                });
            }
            
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};

// Optional authentication - doesn't require token but sets user if present
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (req.user && req.user.isActive) {
                req.user.lastLogin = new Date();
                await req.user.save({ validateBeforeSave: false });
            }
        } catch (error) {
            // If token is invalid, continue without user
            req.user = null;
        }
    }

    next();
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};

// Check if user is admin or coordinator
const isAdmin = authorize('admin', 'coordinator');

// Check if user is admin, coordinator, or department head
const isLeadership = authorize('admin', 'coordinator', 'president', 'vice-president', 'department-head');

// Check if user is active member
const isActiveMember = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    const activeMemberRoles = [
        'member', 'team-lead', 'department-head', 
        'vice-president', 'president', 'admin', 'coordinator'
    ];

    if (!activeMemberRoles.includes(req.user.role) || 
        req.user.membershipStatus !== 'active') {
        return res.status(403).json({
            success: false,
            error: 'Active membership required'
        });
    }

    next();
};

// Check department access
const checkDepartmentAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    // Admins and coordinators can access all departments
    if (['admin', 'coordinator', 'president'].includes(req.user.role)) {
        return next();
    }

    // Department heads can access their own department
    if (req.user.role === 'department-head' && 
        req.user.department && 
        req.user.department.toString() === req.params.departmentId) {
        return next();
    }

    // Check if user belongs to the department being accessed
    if (req.user.department && 
        req.user.department.toString() === req.params.departmentId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        error: 'Not authorized to access this department'
    });
};

// Ownership check - user can access their own resources
const checkOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    // Admins and coordinators can access all resources
    if (['admin', 'coordinator'].includes(req.user.role)) {
        return next();
    }

    // Check if user is accessing their own resource
    if (req.params.userId && req.user._id.toString() === req.params.userId) {
        return next();
    }

    // For other resources, check if user is the owner (set in controller)
    next();
};

// Rate limiting per user
const userRateLimit = async (req, res, next) => {
    if (!req.user) {
        return next();
    }

    // Check if user has made too many requests (basic implementation)
    // In production, use Redis or similar for rate limiting
    const rateLimitKey = `rate_limit:${req.user._id}`;
    
    // For now, just log and continue
    // TODO: Implement proper rate limiting with Redis
    next();
};

// Email verification required
const requireEmailVerification = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            error: 'Email verification required',
            action: 'verify_email'
        });
    }

    next();
};

// Club membership required
const requireClubMembership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    const membershipStatuses = ['active', 'inactive']; // Allow inactive members to view some content
    
    if (!membershipStatuses.includes(req.user.membershipStatus)) {
        return res.status(403).json({
            success: false,
            error: 'Club membership required',
            membershipStatus: req.user.membershipStatus
        });
    }

    next();
};

module.exports = {
    protect,
    optionalAuth,
    authorize,
    isAdmin,
    isLeadership,
    isActiveMember,
    checkDepartmentAccess,
    checkOwnership,
    userRateLimit,
    requireEmailVerification,
    requireClubMembership
};