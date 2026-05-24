const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken, restrictTo('student'));

router.get('/dashboard', studentController.getDashboard);
router.get('/grievances', studentController.getMyGrievances);
router.get('/timetable', studentController.getTimetable);
router.get('/events', studentController.getMyEvents);
router.get('/mentor-sessions', studentController.getMyMentorSessions);

module.exports = router;
