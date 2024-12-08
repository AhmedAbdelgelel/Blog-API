const express = require('express');
const caseController = require('../controllers/caseController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', caseController.getAllCases);
router.get('/:id', caseController.getCaseById);

module.exports = router;
