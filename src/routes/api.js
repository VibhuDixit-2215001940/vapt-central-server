const express = require('express');
const router = express.Router();
const { checkSubscription, uploadScanResult } = require('../controllers/userController');

// User API रroutes
router.post('/check-subscription', checkSubscription);
router.post('/upload-result', uploadScanResult);

module.exports = router;