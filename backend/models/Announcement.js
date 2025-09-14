const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },

    // Classification
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['general', 'event', 'academic', 'project', 'recruitment', 'achievement', 'deadline', 'emergency'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    // Author and Department
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },

    // Audience and Visibility
    targetAudience: [{
        type: String,
        enum: ['all', 'members', 'students', 'faculty', 'alumni', 'department-specific', 'year-specific'],
        default: 'all'
    }],
    visibility: {
        type: String,
        enum: ['public', 'members-only', 'department-only', 'private'],
        default: 'public'
    },
    targetYear: [{
        type: String,
        enum: ['1st-year', '2nd-year', '3rd-year', '4th-year', 'graduate', 'alumni']
    }],
    targetDepartments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],

    // Media and Attachments
    featuredImage: String,
    gallery: [String],
    attachments: [{
        filename: {
            type: String,
            required: true
        },
        originalName: String,
        fileSize: Number,
        mimeType: String,
        url: String,
        isDownloadable: {
            type: Boolean,
            default: true
        }
    }],

    // Related Content
    relatedEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    relatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    externalLinks: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        description: String
    }],

    // Timing and Scheduling
    publishDate: {
        type: Date,
        default: Date.now
    },
    scheduledPublishDate: Date,
    expiryDate: Date,
    isScheduled: {
        type: Boolean,
        default: false
    },
    autoExpire: {
        type: Boolean,
        default: false
    },

    // Status and Publishing
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'archived', 'expired'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: true
    },

    // Engagement and Analytics
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    // Comments
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Announcement.comments'
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Notifications
    notificationSent: {
        type: Boolean,
        default: false
    },
    emailNotificationSent: {
        type: Boolean,
        default: false
    },
    pushNotificationSent: {
        type: Boolean,
        default: false
    },

    // SEO and Metadata
    metaDescription: String,
    metaKeywords: [String],
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Virtual for like count
announcementSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Virtual for reading time estimate
announcementSchema.virtual('readingTime').get(function() {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readingTimeMinutes;
});

// Virtual for engagement rate
announcementSchema.virtual('engagementRate').get(function() {
    if (this.views === 0) return 0;
    const interactions = (this.likes?.length || 0) + (this.comments?.length || 0) + (this.bookmarks?.length || 0);
    return ((interactions / this.views) * 100).toFixed(2);
});

// Virtual for status badge
announcementSchema.virtual('statusBadge').get(function() {
    const now = new Date();
    
    if (this.status === 'published' && this.isPinned) return 'pinned';
    if (this.status === 'published' && this.isFeatured) return 'featured';
    if (this.status === 'published' && this.priority === 'urgent') return 'urgent';
    if (this.status === 'published' && this.priority === 'high') return 'important';
    if (this.expiryDate && now > this.expiryDate) return 'expired';
    if (this.isScheduled && this.scheduledPublishDate > now) return 'scheduled';
    
    return this.status;
});

// Index for better query performance
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ priority: 1, publishDate: -1 });
announcementSchema.index({ author: 1 });
announcementSchema.index({ department: 1 });
announcementSchema.index({ isFeatured: 1, publishDate: -1 });
announcementSchema.index({ isPinned: 1, publishDate: -1 });
announcementSchema.index({ tags: 1 });
announcementSchema.index({ slug: 1 });
announcementSchema.index({ visibility: 1 });
announcementSchema.index({ targetAudience: 1 });

// Generate slug before saving
announcementSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        const baseSlug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with single
        
        // Add date to make slug unique
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        this.slug = `${baseSlug}-${year}-${month}-${day}`;
    }
    
    // Generate excerpt from content if not provided
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 200).trim() + '...';
    }
    
    // Handle scheduled publishing
    if (this.isScheduled && this.scheduledPublishDate <= new Date()) {
        this.status = 'published';
        this.publishDate = new Date();
        this.isScheduled = false;
    }
    
    // Handle expiry
    if (this.autoExpire && this.expiryDate && this.expiryDate <= new Date()) {
        this.status = 'expired';
    }
    
    next();
});

// Static method to get recent announcements
announcementSchema.statics.getRecentAnnouncements = function(limit = 10, category = null) {
    const query = {
        status: 'published',
        visibility: { $in: ['public', 'members-only'] }
    };
    
    if (category) {
        query.category = category;
    }
    
    return this.find(query)
        .sort({ isPinned: -1, priority: -1, publishDate: -1 })
        .limit(limit)
        .populate('author', 'firstName lastName role')
        .populate('department', 'name color')
        .populate('relatedEvent', 'title startDate');
};

// Static method to get pinned announcements
announcementSchema.statics.getPinnedAnnouncements = function() {
    return this.find({
        status: 'published',
        isPinned: true,
        visibility: { $in: ['public', 'members-only'] }
    })
    .sort({ priority: -1, publishDate: -1 })
    .populate('author', 'firstName lastName role')
    .populate('department', 'name color');
};

// Static method to get announcement statistics
announcementSchema.statics.getAnnouncementStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalAnnouncements: { $sum: 1 },
                publishedAnnouncements: {
                    $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
                },
                pinnedAnnouncements: {
                    $sum: { $cond: [{ $eq: ['$isPinned', true] }, 1, 0] }
                },
                totalViews: { $sum: '$views' },
                totalLikes: { $sum: { $size: { $ifNull: ['$likes', []] } } },
                totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } }
            }
        }
    ]);
    
    return stats[0] || {
        totalAnnouncements: 0,
        publishedAnnouncements: 0,
        pinnedAnnouncements: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0
    };
};

// Method to check if user can view announcement
announcementSchema.methods.canUserView = function(user) {
    // Public announcements can be viewed by everyone
    if (this.visibility === 'public') return true;
    
    // Private announcements can only be viewed by author and admins
    if (this.visibility === 'private') {
        return user && (user._id.equals(this.author) || user.role === 'admin');
    }
    
    // Members-only announcements require user to be a member
    if (this.visibility === 'members-only') {
        return user && ['member', 'team-lead', 'department-head', 'vice-president', 'president', 'admin', 'coordinator'].includes(user.role);
    }
    
    // Department-only announcements require user to be in same department
    if (this.visibility === 'department-only') {
        return user && user.department && user.department.equals(this.department);
    }
    
    return false;
};

module.exports = mongoose.model('Announcement', announcementSchema);