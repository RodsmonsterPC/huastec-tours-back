const mongoose = require('mongoose');
const slugify = require('slugify');

const itineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [{ type: String }],
});

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede tener más de 100 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    duration: {
      type: String,
      required: [true, 'La duración es obligatoria'],
    },
    location: {
      type: String,
      required: [true, 'La ubicación es obligatoria'],
    },
    category: {
      type: String,
      enum: ['Agua', 'Senderismo', 'Cultura', 'Extremo', 'Aventura'],
      default: 'Aventura',
    },
    difficulty: {
      type: String,
      enum: ['Fácil', 'Moderado', 'Difícil', 'Extremo'],
      default: 'Moderado',
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String, default: '' },
      },
    ],
    itinerary: [itineraryItemSchema],
    included: [{ type: String }],
    notIncluded: [{ type: String }],
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      default: 12,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before saving
tourSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Ensure unique slug
tourSchema.pre('save', async function (next) {
  if (this.isModified('slug') || this.isNew) {
    const Tour = this.constructor;
    let slug = this.slug;
    let count = 0;
    while (await Tour.findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${this.slug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
