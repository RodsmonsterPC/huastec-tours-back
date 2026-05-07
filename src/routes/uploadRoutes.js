const express = require('express');
const router = express.Router();
const { uploadImages, deleteImage, upload } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.array('images', 10), uploadImages);
router.delete('/:publicId', protect, deleteImage);

module.exports = router;
