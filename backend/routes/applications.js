const express = require('express');
const router = express.Router();
const { applyScheme, getApplicationStatus, updateApplicationStatus, getAllApplications } = require('../controllers/applicationController');
const requireAuth = require('../middleware/requireAuth');


router.post('/', applyScheme);
router.get('/', requireAuth, getApplicationStatus);  // 👈 Secured route
router.patch('/:applicationId', updateApplicationStatus);
router.get('/all', getAllApplications);


module.exports = router;
