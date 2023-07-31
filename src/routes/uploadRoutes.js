const express = require('express');
const uploadMiddleware = require('../middleware/multerMiddleware');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadController.uploadImage);

module.exports = router;
