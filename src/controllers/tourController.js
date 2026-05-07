const Tour = require('../models/Tour');
const { cloudinary } = require('../lib/cloudinary');

// GET /api/tours
const getAllTours = async (req, res) => {
  try {
    const { category, sort, featured } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'Todos') filter.category = category;
    if (featured === 'true') filter.featured = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const tours = await Tour.find(filter).sort(sortOption).lean();

    res.json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    console.error('GetAllTours error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener tours' });
  }
};

// GET /api/tours/:slug
const getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour no encontrado' });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el tour' });
  }
};

// GET /api/tours/id/:id  (admin)
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).lean();
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour no encontrado' });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el tour' });
  }
};

// POST /api/tours
const createTour = async (req, res) => {
  try {
    const tourData = { ...req.body };

    // Parse JSON fields if sent as strings
    if (typeof tourData.itinerary === 'string') tourData.itinerary = JSON.parse(tourData.itinerary);
    if (typeof tourData.included === 'string') tourData.included = JSON.parse(tourData.included);
    if (typeof tourData.notIncluded === 'string') tourData.notIncluded = JSON.parse(tourData.notIncluded);
    if (typeof tourData.images === 'string') tourData.images = JSON.parse(tourData.images);

    const tour = await Tour.create(tourData);
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('CreateTour error:', error);
    res.status(500).json({ success: false, message: 'Error al crear el tour' });
  }
};

// PUT /api/tours/:id
const updateTour = async (req, res) => {
  try {
    const tourData = { ...req.body };

    if (typeof tourData.itinerary === 'string') tourData.itinerary = JSON.parse(tourData.itinerary);
    if (typeof tourData.included === 'string') tourData.included = JSON.parse(tourData.included);
    if (typeof tourData.notIncluded === 'string') tourData.notIncluded = JSON.parse(tourData.notIncluded);
    if (typeof tourData.images === 'string') tourData.images = JSON.parse(tourData.images);

    const tour = await Tour.findByIdAndUpdate(req.params.id, tourData, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour no encontrado' });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al actualizar el tour' });
  }
};

// DELETE /api/tours/:id
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour no encontrado' });
    }

    // Delete images from Cloudinary
    for (const img of tour.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await tour.deleteOne();
    res.json({ success: true, message: 'Tour eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el tour' });
  }
};

// GET /api/tours/admin/all  (admin - includes inactive)
const getAllToursAdmin = async (req, res) => {
  try {
    const tours = await Tour.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tours' });
  }
};

module.exports = { getAllTours, getTourBySlug, getTourById, createTour, updateTour, deleteTour, getAllToursAdmin };
