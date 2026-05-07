const { cloudinary, upload } = require('../lib/cloudinary');

// POST /api/upload
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron imágenes' });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: file.originalname,
    }));

    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error al subir imágenes' });
  }
};

// DELETE /api/upload/:publicId
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Imagen eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar imagen' });
  }
};

module.exports = { uploadImages, deleteImage, upload };
