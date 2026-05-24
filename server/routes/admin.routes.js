const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken, restrictTo('admin'));

router.get('/analytics', adminController.getSystemAnalytics);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.changeUserRole);
router.put('/users/:id/deactivate', adminController.deactivateUser);

router.post('/events', adminController.manageEvents);
router.get('/grievance-pipeline', adminController.getGrievancePipeline);

module.exports = router;
