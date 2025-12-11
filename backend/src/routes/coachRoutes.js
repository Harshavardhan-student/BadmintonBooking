const express = require('express');
const router = express.Router();
const controller = require('../controllers/coachController');

router.get('/', controller.getCoaches);
router.post('/', controller.createCoach);
router.put('/:id', controller.updateCoach);
router.delete('/:id', controller.deleteCoach);

module.exports = router;
