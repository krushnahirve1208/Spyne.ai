const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/:name', UserController.searchByName);
router.put('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

module.exports = router;
