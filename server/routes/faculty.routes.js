const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken, restrictTo('faculty', 'admin'));

router.get('/dashboard', facultyController.getFacultyDashboard);

router.get('/notices', facultyController.getMyNotices);
router.post('/notices', facultyController.publishNotice);
router.put('/notices/:id', facultyController.updateNotice);
router.delete('/notices/:id', facultyController.deleteNotice);

router.get('/mentorship/requests', facultyController.getMentorshipRequests);
router.put('/mentorship/:id/approve', facultyController.approveSession);
router.put('/mentorship/:id/reschedule', facultyController.rescheduleSession);
router.put('/mentorship/:id/notes', facultyController.addSessionNotes);

router.get('/grievances', facultyController.getAssignedGrievances);
router.put('/grievances/:id/status', facultyController.updateGrievanceStatus);

module.exports = router;
