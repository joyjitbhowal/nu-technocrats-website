const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Department description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    icon: {
        type: String,
        required: [true, 'Department icon is required'],
        default: 'fas fa-code'
    },
    color: {
        type: String,
        default: '#2563eb',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
    },

    // Leadership
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coordinators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Skills and Technologies
    primarySkills: [{
        type: String,
        trim: true
    }],
    technologies: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        proficiencyLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'intermediate'
        }
    }],

    // Goals and Focus Areas
    focusAreas: [{
        type: String,
        trim: true
    }],
    currentGoals: [{
        goal: {
            type: String,
            required: true,
            trim: true
        },
        targetDate: Date,
        status: {
            type: String,
            enum: ['planned', 'in-progress', 'completed', 'postponed'],
            default: 'planned'
        }
    }],

    // Statistics
    memberCount: {
        type: Number,
        default: 0,
        min: 0
    },
    activeProjects: {
        type: Number,
        default: 0,
        min: 0
    },
    completedProjects: {
        type: Number,
        default: 0,
        min: 0
    },
    workshopsHeld: {
        type: Number,
        default: 0,
        min: 0
    },

    // Meeting Information
    regularMeetings: {
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        time: String,
        location: String,
        meetingLink: String
    },

    // Resources
    resources: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        url: String,
        type: {
            type: String,
            enum: ['tutorial', 'documentation', 'tool', 'course', 'book', 'video', 'other'],
            default: 'other'
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        }
    }],

    // Contact Information
    contactEmail: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    discordChannel: String,
    slackChannel: String,

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isRecruiting: {
        type: Boolean,
        default: true
    },
    maxMembers: {
        type: Number,
        min: 1
    },

    // Requirements for joining
    requirements: [{
        type: String,
        trim: true
    }],
    applicationProcess: {
        type: String,
        maxlength: [500, 'Application process cannot exceed 500 characters']
    },

    // Social Media
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        youtube: String,
        website: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for member capacity percentage
departmentSchema.virtual('memberCapacityPercentage').get(function() {
    if (!this.maxMembers) return null;
    return Math.round((this.memberCount / this.maxMembers) * 100);
});

// Virtual for project completion rate
departmentSchema.virtual('projectCompletionRate').get(function() {
    const totalProjects = this.activeProjects + this.completedProjects;
    if (totalProjects === 0) return 0;
    return Math.round((this.completedProjects / totalProjects) * 100);
});

// Index for better query performance
departmentSchema.index({ slug: 1 });
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });
departmentSchema.index({ isRecruiting: 1 });

// Generate slug before saving
departmentSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with single
    }
    next();
});

// Static method to get department statistics
departmentSchema.statics.getDepartmentStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalDepartments: { $sum: 1 },
                activeDepartments: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                totalMembers: { $sum: '$memberCount' },
                totalActiveProjects: { $sum: '$activeProjects' },
                totalCompletedProjects: { $sum: '$completedProjects' },
                recruitingDepartments: {
                    $sum: { $cond: [{ $eq: ['$isRecruiting', true] }, 1, 0] }
                }
            }
        }
    ]);
    
    return stats[0] || {
        totalDepartments: 0,
        activeDepartments: 0,
        totalMembers: 0,
        totalActiveProjects: 0,
        totalCompletedProjects: 0,
        recruitingDepartments: 0
    };
};

module.exports = mongoose.model('Department', departmentSchema);