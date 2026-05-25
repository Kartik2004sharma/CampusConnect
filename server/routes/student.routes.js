const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken, restrictTo('student'));

router.get('/dashboard', studentController.getDashboard);
router.get('/grievances', studentController.getMyGrievances);
router.post('/grievances', studentController.submitGrievance);
router.get('/timetable', studentController.getTimetable);
router.get('/events', studentController.getMyEvents);
router.get('/events/all', studentController.getAllEvents);
router.post('/events/:id/register', studentController.registerForEvent);
router.get('/mentor-sessions', studentController.getMyMentorSessions);
router.post('/mentor-sessions', studentController.requestMentorSession);
router.get('/faculties', studentController.getFaculties);

router.put('/profile', studentController.updateProfile);

router.get('/lost-found', studentController.getLostFoundItems);
router.post('/lost-found', studentController.reportLostFound);
router.put('/lost-found/:id/claim', studentController.claimItem);

module.exports = router;
