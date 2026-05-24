const express = require('express');
const router = express.Router();
const { analyzeIssue, quickSubmit } = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All AI routes should be protected
router.use(verifyToken);

router.post('/analyze-issue', analyzeIssue);
router.post('/quick-submit', quickSubmit);

module.exports = router;
