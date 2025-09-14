const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // Basic Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },

    // Student Information
    studentId: {
        type: String,
        sparse: true, // Allow null but unique when present
        trim: true
    },
    year: {
        type: String,
        enum: ['1st-year', '2nd-year', '3rd-year', '4th-year', 'graduate', 'alumni'],
        default: '1st-year'
    },
    major: {
        type: String,
        trim: true,
        maxlength: [100, 'Major cannot exceed 100 characters']
    },

    // Club Information
    role: {
        type: String,
        enum: ['student', 'member', 'team-lead', 'department-head', 'vice-president', 'president', 'admin', 'coordinator'],
        default: 'student'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    membershipStatus: {
        type: String,
        enum: ['pending', 'active', 'inactive', 'suspended', 'alumni'],
        default: 'pending'
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },

    // Profile Information
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
        type: String,
        trim: true
    }],
    interests: [{
        type: String,
        trim: true
    }],
    profilePicture: {
        type: String, // URL to profile picture
        default: ''
    },

    // Contact Information
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    linkedinUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https:\/\/(www\.)?linkedin\.com\//.test(v);
            },
            message: 'Please enter a valid LinkedIn URL'
        }
    },
    githubUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https:\/\/(www\.)?github\.com\//.test(v);
            },
            message: 'Please enter a valid GitHub URL'
        }
    },

    // Activity Tracking
    projectsCompleted: {
        type: Number,
        default: 0,
        min: 0
    },
    eventsAttended: {
        type: Number,
        default: 0,
        min: 0
    },
    workshopsAttended: {
        type: Number,
        default: 0,
        min: 0
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },

    // Security
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // Preferences
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        eventNotifications: {
            type: Boolean,
            default: true
        },
        newsletterSubscription: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for member since duration
userSchema.virtual('memberSince').get(function() {
    const now = new Date();
    const joined = this.joinedDate;
    const diffTime = Math.abs(now - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} days`;
    } else if (diffDays < 365) {
        return `${Math.floor(diffDays / 30)} months`;
    } else {
        return `${Math.floor(diffDays / 365)} years`;
    }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ studentId: 1 });
userSchema.index({ department: 1 });
userSchema.index({ role: 1 });
userSchema.index({ membershipStatus: 1 });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generate and sign JWT
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            role: this.role 
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate random bytes
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;
};

module.exports = mongoose.model('User', userSchema);