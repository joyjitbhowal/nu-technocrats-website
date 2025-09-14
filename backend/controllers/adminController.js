const User = require('../models/User');
const Department = require('../models/Department');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const sendEmail = require('../services/emailService');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // Get current date for filtering
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // User statistics
        const totalUsers = await User.countDocuments();
        const activeMembers = await User.countDocuments({ 
            membershipStatus: 'active',
            isActive: true 
        });
        const pendingApplications = await User.countDocuments({ 
            membershipStatus: 'pending' 
        });
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: thisMonth }
        });

        // Department statistics
        const totalDepartments = await Department.countDocuments({ isActive: true });
        const departmentStats = await Department.find({ isActive: true })
            .select('name memberCount activeProjects completedProjects')
            .sort({ memberCount: -1 });

        // Event statistics
        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({
            startDate: { $gte: now },
            status: { $in: ['published', 'ongoing'] }
        });
        const eventsThisMonth = await Event.countDocuments({
            startDate: { $gte: thisMonth }
        });
        const totalAttendees = await Event.aggregate([
            { $group: { _id: null, total: { $sum: '$currentAttendees' } } }
        ]);

        // Announcement statistics
        const totalAnnouncements = await Announcement.countDocuments();
        const publishedAnnouncements = await Announcement.countDocuments({ 
            status: 'published' 
        });
        const announcementsThisMonth = await Announcement.countDocuments({
            publishDate: { $gte: thisMonth }
        });

        // Recent activity
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName email createdAt membershipStatus');

        const recentEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title startDate status currentAttendees maxAttendees')
            .populate('organizer', 'firstName lastName');

        // User role distribution
        const userRoleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Monthly user growth (last 6 months)
        const monthlyGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    activeMembers,
                    pendingApplications,
                    newUsersThisMonth,
                    totalDepartments,
                    totalEvents,
                    upcomingEvents,
                    eventsThisMonth,
                    totalAttendees: totalAttendees[0]?.total || 0,
                    totalAnnouncements,
                    publishedAnnouncements,
                    announcementsThisMonth
                },
                departmentStats,
                recentActivity: {
                    recentUsers,
                    recentEvents
                },
                analytics: {
                    userRoleStats,
                    monthlyGrowth
                }
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics'
        });
    }
};

// @desc    Get all users with advanced filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search;
        const role = req.query.role;
        const membershipStatus = req.query.membershipStatus;
        const department = req.query.department;
        const isActive = req.query.isActive;
        const isEmailVerified = req.query.isEmailVerified;

        // Build filter query
        const filterQuery = {};

        if (search) {
            filterQuery.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) filterQuery.role = role;
        if (membershipStatus) filterQuery.membershipStatus = membershipStatus;
        if (department) filterQuery.department = department;
        if (isActive !== undefined) filterQuery.isActive = isActive === 'true';
        if (isEmailVerified !== undefined) filterQuery.isEmailVerified = isEmailVerified === 'true';

        // Get users with pagination
        const users = await User.find(filterQuery)
            .populate('department', 'name color')
            .sort({ [sortBy]: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit)
            .select('-password');

        const totalUsers = await User.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        // Prevent updating password through this endpoint
        delete updates.password;

        // Handle department change
        if (updates.department) {
            const department = await Department.findById(updates.department);
            if (!department) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid department selected'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).populate('department', 'name color');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update user'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent admin from deleting themselves
        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete your own account'
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
};

// @desc    Bulk update users
// @route   PUT /api/admin/users/bulk
// @access  Private/Admin
const bulkUpdateUsers = async (req, res) => {
    try {
        const { userIds, updates } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'User IDs array is required'
            });
        }

        // Prevent updating password
        delete updates.password;

        // Prevent admin from updating their own role to non-admin
        if (updates.role && updates.role !== 'admin' && userIds.includes(req.user._id.toString())) {
            return res.status(400).json({
                success: false,
                error: 'Cannot change your own admin role'
            });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            updates,
            { runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} users updated successfully`,
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            }
        });

    } catch (error) {
        console.error('Bulk update users error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to bulk update users'
        });
    }
};

// @desc    Approve/Reject membership applications
// @route   PUT /api/admin/users/:id/membership
// @access  Private/Admin
const updateMembershipStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status, reason } = req.body; // status: 'active', 'inactive', 'suspended', 'rejected'

        if (!['active', 'inactive', 'suspended', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid membership status'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                membershipStatus: status,
                ...(status === 'active' && { role: 'member' }) // Promote to member when approved
            },
            { new: true }
        ).populate('department', 'name color');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Send notification email based on status
        try {
            let emailTemplate, emailSubject;
            
            switch (status) {
                case 'active':
                    emailTemplate = 'membershipApproved';
                    emailSubject = 'Welcome to NU Technocrats Club!';
                    break;
                case 'rejected':
                    emailTemplate = 'membershipRejected';
                    emailSubject = 'NU Technocrats Club - Application Update';
                    break;
                case 'suspended':
                    emailTemplate = 'membershipSuspended';
                    emailSubject = 'NU Technocrats Club - Account Update';
                    break;
            }

            if (emailTemplate) {
                await sendEmail({
                    email: user.email,
                    subject: emailSubject,
                    template: emailTemplate,
                    context: {
                        firstName: user.firstName,
                        status: status,
                        reason: reason || '',
                        clubName: 'NU Technocrats Club',
                        loginUrl: `${process.env.FRONTEND_URL}/login`
                    }
                });
            }
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // Don't fail the update if email fails
        }

        res.status(200).json({
            success: true,
            message: `Membership status updated to ${status}`,
            data: { user }
        });

    } catch (error) {
        console.error('Update membership status error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update membership status'
        });
    }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSystemAnalytics = async (req, res) => {
    try {
        const { timeframe = '30' } = req.query; // days
        const days = parseInt(timeframe);
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // User analytics
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.date': 1 } }
        ]);

        // Event analytics
        const eventStats = await Event.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalAttendees: { $sum: '$currentAttendees' },
                    avgRating: { $avg: '$rating.average' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Department analytics
        const departmentPerformance = await Department.aggregate([
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: 'department',
                    as: 'events'
                }
            },
            {
                $project: {
                    name: 1,
                    memberCount: 1,
                    activeProjects: 1,
                    completedProjects: 1,
                    eventCount: { $size: '$events' },
                    projectCompletionRate: {
                        $cond: {
                            if: { $eq: [{ $add: ['$activeProjects', '$completedProjects'] }, 0] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: ['$completedProjects', { $add: ['$activeProjects', '$completedProjects'] }] },
                                    100
                                ]
                            }
                        }
                    }
                }
            },
            { $sort: { memberCount: -1 } }
        ]);

        // Engagement analytics
        const engagementStats = await Announcement.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalLikes: { $sum: { $size: { $ifNull: ['$likes', []] } } },
                    totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } },
                    avgViews: { $avg: '$views' }
                }
            }
        ]);

        // User activity by role
        const roleActivity = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    active: { $sum: { $cond: ['$isActive', 1, 0] } },
                    verified: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                timeframe: days,
                userGrowth,
                eventStats,
                departmentPerformance,
                engagementStats: engagementStats[0] || {
                    totalViews: 0,
                    totalLikes: 0,
                    totalComments: 0,
                    avgViews: 0
                },
                roleActivity
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics data'
        });
    }
};

// @desc    Export users data
// @route   GET /api/admin/export/users
// @access  Private/Admin
const exportUsers = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;

        const users = await User.find()
            .populate('department', 'name')
            .select('-password')
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Generate CSV
            const csvHeaders = [
                'Name',
                'Email',
                'Student ID',
                'Role',
                'Department',
                'Membership Status',
                'Year',
                'Skills',
                'Projects Completed',
                'Email Verified',
                'Active',
                'Joined Date',
                'Last Login'
            ];

            const csvRows = users.map(user => [
                `${user.firstName} ${user.lastName}`,
                user.email,
                user.studentId || '',
                user.role,
                user.department?.name || '',
                user.membershipStatus,
                user.year || '',
                user.skills.join('; '),
                user.projectsCompleted,
                user.isEmailVerified ? 'Yes' : 'No',
                user.isActive ? 'Yes' : 'No',
                user.createdAt.toISOString().split('T')[0],
                user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : ''
            ]);

            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
            res.send(csvContent);

        } else if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=users-export.json');
            res.json({
                exportDate: new Date().toISOString(),
                totalUsers: users.length,
                users
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid format. Use csv or json'
            });
        }

    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export users data'
        });
    }
};

// @desc    Send bulk email notifications
// @route   POST /api/admin/notifications/email
// @access  Private/Admin
const sendBulkNotification = async (req, res) => {
    try {
        const { 
            recipients, // 'all', 'members', 'students', 'department:id', array of user IDs
            subject,
            content,
            template = 'notification'
        } = req.body;

        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                error: 'Subject and content are required'
            });
        }

        let users = [];

        // Determine recipients
        if (recipients === 'all') {
            users = await User.find({ isActive: true }).select('firstName email');
        } else if (recipients === 'members') {
            users = await User.find({ 
                membershipStatus: 'active',
                isActive: true 
            }).select('firstName email');
        } else if (recipients === 'students') {
            users = await User.find({ 
                role: 'student',
                isActive: true 
            }).select('firstName email');
        } else if (recipients.startsWith('department:')) {
            const departmentId = recipients.split(':')[1];
            users = await User.find({ 
                department: departmentId,
                isActive: true 
            }).select('firstName email');
        } else if (Array.isArray(recipients)) {
            users = await User.find({ 
                _id: { $in: recipients },
                isActive: true 
            }).select('firstName email');
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid recipients parameter'
            });
        }

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No recipients found'
            });
        }

        // Send emails
        const emailResults = [];
        for (const user of users) {
            try {
                await sendEmail({
                    email: user.email,
                    subject,
                    template,
                    context: {
                        firstName: user.firstName,
                        content,
                        clubName: 'NU Technocrats Club'
                    }
                });
                emailResults.push({ email: user.email, success: true });
            } catch (error) {
                emailResults.push({ email: user.email, success: false, error: error.message });
            }
        }

        const successCount = emailResults.filter(r => r.success).length;
        const failCount = emailResults.length - successCount;

        res.status(200).json({
            success: true,
            message: `Bulk email sent. ${successCount} successful, ${failCount} failed`,
            data: {
                totalRecipients: users.length,
                successCount,
                failCount,
                results: emailResults
            }
        });

    } catch (error) {
        console.error('Bulk notification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send bulk notification'
        });
    }
};

// @desc    Get system logs (simplified implementation)
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = async (req, res) => {
    try {
        const { type = 'all', limit = 100 } = req.query;
        
        // This is a simplified implementation
        // In production, you'd want to integrate with a proper logging system
        const logs = [
            {
                timestamp: new Date(),
                level: 'info',
                message: 'User logged in',
                details: { userId: req.user._id, ip: req.ip }
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                level: 'warning',
                message: 'High number of login attempts detected',
                details: { ip: '192.168.1.1', attempts: 10 }
            }
            // Add more sample logs or integrate with actual logging system
        ];

        res.status(200).json({
            success: true,
            data: {
                logs: logs.slice(0, parseInt(limit)),
                totalLogs: logs.length
            }
        });

    } catch (error) {
        console.error('Get system logs error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system logs'
        });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    updateMembershipStatus,
    getSystemAnalytics,
    exportUsers,
    sendBulkNotification,
    getSystemLogs
};