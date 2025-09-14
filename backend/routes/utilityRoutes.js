const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, message: 'Utility routes - Coming Soon' });
});

module.exports = router;