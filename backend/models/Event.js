const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [300, 'Short description cannot exceed 300 characters']
    },

    // Event Details
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: ['workshop', 'seminar', 'competition', 'networking', 'hackathon', 'project-showcase', 'social', 'meeting'],
        default: 'workshop'
    },
    type: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'offline'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
        default: 'all-levels'
    },

    // Dates and Times
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    duration: {
        hours: {
            type: Number,
            min: 0,
            max: 72
        },
        minutes: {
            type: Number,
            min: 0,
            max: 59
        }
    },

    // Location
    venue: {
        name: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        room: {
            type: String,
            trim: true
        },
        capacity: {
            type: Number,
            min: 1
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    onlineDetails: {
        meetingLink: String,
        platform: {
            type: String,
            enum: ['zoom', 'teams', 'meet', 'discord', 'other']
        },
        meetingId: String,
        password: String,
        streamingLink: String
    },

    // Registration
    registrationRequired: {
        type: Boolean,
        default: true
    },
    registrationDeadline: Date,
    maxAttendees: {
        type: Number,
        min: 1
    },
    currentAttendees: {
        type: Number,
        default: 0,
        min: 0
    },
    waitlistEnabled: {
        type: Boolean,
        default: false
    },
    registrationFee: {
        amount: {
            type: Number,
            min: 0,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },

    // Organization
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event organizer is required']
    },
    coOrganizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    
    // Speakers/Presenters
    speakers: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        bio: String,
        title: String,
        company: String,
        profilePicture: String,
        linkedinUrl: String,
        twitterUrl: String,
        websiteUrl: String,
        isExternal: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    // Content and Resources
    agenda: [{
        time: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        duration: Number, // in minutes
        speaker: String
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    skillsLearned: [{
        type: String,
        trim: true
    }],
    prerequisites: [{
        type: String,
        trim: true
    }],
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
            enum: ['document', 'video', 'link', 'slide', 'code', 'image', 'other'],
            default: 'link'
        },
        isDownloadable: {
            type: Boolean,
            default: false
        }
    }],

    // Media
    featuredImage: String,
    gallery: [String],
    recordingUrl: String,

    // Status and Visibility
    status: {
        type: String,
        enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled', 'postponed'],
        default: 'draft'
    },
    visibility: {
        type: String,
        enum: ['public', 'members-only', 'department-only', 'private'],
        default: 'public'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'yearly']
        },
        interval: Number,
        endDate: Date,
        daysOfWeek: [Number] // 0 = Sunday, 1 = Monday, etc.
    },

    // Feedback and Analytics
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    feedback: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: String,
        isAnonymous: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Engagement
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0,
        min: 0
    },

    // Certificates
    certificateEnabled: {
        type: Boolean,
        default: false
    },
    certificateTemplate: String,
    certificatesIssued: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
    const now = new Date();
    if (this.registrationDeadline && now > this.registrationDeadline) {
        return 'closed';
    }
    if (this.maxAttendees && this.currentAttendees >= this.maxAttendees) {
        return this.waitlistEnabled ? 'waitlist' : 'full';
    }
    return 'open';
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
    const now = new Date();
    if (now < this.startDate) {
        return 'upcoming';
    } else if (now >= this.startDate && now <= this.endDate) {
        return 'ongoing';
    } else {
        return 'completed';
    }
});

// Virtual for duration in readable format
eventSchema.virtual('durationText').get(function() {
    if (!this.duration) return null;
    const { hours, minutes } = this.duration;
    let text = '';
    if (hours > 0) text += `${hours}h`;
    if (minutes > 0) text += `${text ? ' ' : ''}${minutes}m`;
    return text || null;
});

// Virtual for attendance rate
eventSchema.virtual('attendanceRate').get(function() {
    if (!this.maxAttendees) return null;
    return Math.round((this.currentAttendees / this.maxAttendees) * 100);
});

// Index for better query performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ visibility: 1 });
eventSchema.index({ department: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ isFeatured: 1, startDate: 1 });

// Generate slug before saving
eventSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        const baseSlug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with single
        
        // Add date to make slug unique
        const date = new Date(this.startDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        this.slug = `${baseSlug}-${year}-${month}-${day}`;
    }
    
    // Calculate duration if not provided
    if (this.startDate && this.endDate && !this.duration) {
        const diffMs = this.endDate - this.startDate;
        const diffMins = Math.round(diffMs / (1000 * 60));
        this.duration = {
            hours: Math.floor(diffMins / 60),
            minutes: diffMins % 60
        };
    }
    
    next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(limit = 10) {
    return this.find({
        startDate: { $gte: new Date() },
        status: { $in: ['published', 'ongoing'] },
        visibility: 'public'
    })
    .sort({ startDate: 1 })
    .limit(limit)
    .populate('organizer', 'firstName lastName')
    .populate('department', 'name color');
};

// Static method to get event statistics
eventSchema.statics.getEventStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalEvents: { $sum: 1 },
                upcomingEvents: {
                    $sum: { 
                        $cond: [
                            { $and: [
                                { $gte: ['$startDate', new Date()] },
                                { $in: ['$status', ['published', 'ongoing']] }
                            ]},
                            1,
                            0
                        ]
                    }
                },
                completedEvents: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                totalAttendees: { $sum: '$currentAttendees' },
                averageRating: { $avg: '$rating.average' }
            }
        }
    ]);
    
    return stats[0] || {
        totalEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        totalAttendees: 0,
        averageRating: 0
    };
};

module.exports = mongoose.model('Event', eventSchema);