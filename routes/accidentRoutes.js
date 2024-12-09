const express = require('express');
const accidentController = require('../controllers/accidentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', accidentController.getAllAccidents);
router.get('/:id', accidentController.getAccidentById);

module.exports = router;
