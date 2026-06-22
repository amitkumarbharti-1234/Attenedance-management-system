const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/teacher-dashboard', auth, (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Teachers only.' });
    }
    res.json({ message: 'Welcome to the Teacher Dashboard' });
});

router.get('/student-dashboard', auth, (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    res.json({ message: 'Welcome to the Student Dashboard' });
});

module.exports = router;
