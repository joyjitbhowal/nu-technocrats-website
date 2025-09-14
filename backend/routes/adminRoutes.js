const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(isAdmin);

// Dashboard and Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getSystemAnalytics);
router.get('/logs', getSystemLogs);

// User Management
router.get('/users', getAllUsers);
router.put('/users/bulk', bulkUpdateUsers);
router.get('/export/users', exportUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/membership', updateMembershipStatus);

// Notifications
router.post('/notifications/email', sendBulkNotification);

// Info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'NU Technocrats Club Admin Panel API',
        version: '1.0.0',
        endpoints: {
            dashboard: 'GET /api/admin/dashboard - Dashboard statistics',
            analytics: 'GET /api/admin/analytics - System analytics',
            users: 'GET /api/admin/users - User management',
            userUpdate: 'PUT /api/admin/users/:id - Update user',
            userDelete: 'DELETE /api/admin/users/:id - Delete user',
            bulkUpdate: 'PUT /api/admin/users/bulk - Bulk update users',
            membership: 'PUT /api/admin/users/:id/membership - Update membership status',
            export: 'GET /api/admin/export/users - Export users data',
            notifications: 'POST /api/admin/notifications/email - Send bulk emails',
            logs: 'GET /api/admin/logs - System logs'
        }
    });
});

module.exports = router;
