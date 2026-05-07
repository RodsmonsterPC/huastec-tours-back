require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tour = require('../models/Tour');

const sampleTours = [
  {
    title: 'Cascada de Tamul',
    description: 'Embárcate en una travesía hacia la "Joya de la Huasteca". La Cascada de Tamul, de 105 metros de altura, es la cascada más espectacular de la región. Nuestra expedición curada te lleva por las turquesas aguas del Río Tampaón en pangas tradicionales.',
    price: 1250,
    duration: '5 Horas',
    location: 'Aquismón, SLP',
    category: 'Agua',
    difficulty: 'Moderado',
    featured: true,
    rating: 4.9,
    reviewCount: 120,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        alt: 'Cascada de Tamul'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'El Ascenso a Tamul',
        description: 'Comenzamos la mañana con un viaje panorámico a Aquismón. Nos embarcaremos en pangas y remeremos contra la corriente turquesa del Río Tampaón.',
        activities: ['Remo en pangas con guías locales', 'Vista completa de la cascada de 105m', 'Visita al cenote Cueva del Agua']
      }
    ],
    included: ['Guías bilingües especializados', 'Todo el equipo de seguridad', '4 comidas (cocina regional huasteca)', 'Transporte de ida y vuelta'],
    notIncluded: ['Seguro de viaje personal', 'Bebidas alcohólicas', 'Propinas para guías'],
    isActive: true,
  },
  {
    title: 'Sótano de las Golondrinas',
    description: 'Uno de los pozos profundos más grandes del mundo, el Sótano de las Golondrinas es un espectáculo natural impresionante. Cada mañana, millones de golondrinas emergen en un espiral hipnótico.',
    price: 950,
    duration: '4 Horas',
    location: 'Aquismón, SLP',
    category: 'Cultura',
    difficulty: 'Fácil',
    featured: true,
    rating: 4.8,
    reviewCount: 85,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200',
        alt: 'Sótano de las Golondrinas'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'El Gran Pozo',
        description: 'Caminata matutina para llegar al borde del sótano justo antes del amanecer.',
        activities: ['Observación del vuelo de las golondrinas', 'Fotografía de vida silvestre', 'Sendero de regreso por la selva']
      }
    ],
    included: ['Guía experto', 'Transporte', 'Equipo de observación'],
    notIncluded: ['Comida', 'Seguro personal'],
    isActive: true,
  },
  {
    title: 'Jardín Surrealista Xilitla',
    description: 'Explora el Jardín Escultórico de Edward James en Xilitla, una obra maestra arquitectónica entre la selva tropical de San Luis Potosí.',
    price: 1100,
    duration: '8 Horas',
    location: 'Xilitla, SLP',
    category: 'Cultura',
    difficulty: 'Fácil',
    featured: true,
    rating: 4.7,
    reviewCount: 156,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539614474468-f423a2d2270c?w=1200',
        alt: 'Jardín Surrealista Xilitla'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Día completo en Xilitla',
        description: 'Visita al jardín escultórico y exploración del pueblo mágico.',
        activities: ['Tour guiado por el jardín', 'Visita al pueblo de Xilitla', 'Comida típica local']
      }
    ],
    included: ['Guía cultural', 'Entrada al jardín', 'Transporte'],
    notIncluded: ['Comida extra', 'Compras personales'],
    isActive: true,
  },
  {
    title: 'Puente de Dios',
    description: 'Una formación natural de roca que crea un puente sobre una poza de agua cristalina color turquesa. Un lugar mágico para nadar y contemplar.',
    price: 800,
    duration: '6 Horas',
    location: 'Tamasopo, SLP',
    category: 'Agua',
    difficulty: 'Fácil',
    featured: false,
    rating: 4.9,
    reviewCount: 210,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504214208698-ea446addba5e?w=1200',
        alt: 'Puente de Dios'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Paraíso Natural',
        description: 'Descenso y nado en el Puente de Dios.',
        activities: ['Nado en aguas cristalinas', 'Descenso por toboganes naturales', 'Picnic junto al río']
      }
    ],
    included: ['Guía', 'Equipo de seguridad', 'Transporte'],
    notIncluded: ['Comida', 'Seguro'],
    isActive: true,
  },
  {
    title: 'Cascadas de Micos',
    description: 'Un sistema de cascadas en diferentes niveles que permiten deslizarse por toboganes naturales, saltar desde diferentes alturas y nadar en pozas de agua cristalina.',
    price: 750,
    duration: '4 Horas',
    location: 'Ciudad Valles, SLP',
    category: 'Agua',
    difficulty: 'Moderado',
    featured: false,
    rating: 4.8,
    reviewCount: 94,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200',
        alt: 'Cascadas de Micos'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Aventura en Micos',
        description: 'Toboganes naturales y saltos en las cascadas.',
        activities: ['Toboganes naturales', 'Saltos de altura variada', 'Snorkel en pozas']
      }
    ],
    included: ['Guía', 'Chaleco salvavidas', 'Transporte'],
    notIncluded: ['Comida', 'Equipo fotográfico'],
    isActive: true,
  },
  {
    title: 'Cascada de Minas Viejas',
    description: 'Dos impresionantes cascadas gemelas que caen en una amplia poza de color turquesa. Un lugar sereno y majestuoso ideal para conectar con la naturaleza.',
    price: 850,
    duration: '5 Horas',
    location: 'Ciudad Valles, SLP',
    category: 'Senderismo',
    difficulty: 'Moderado',
    featured: false,
    rating: 4.9,
    reviewCount: 112,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
        alt: 'Cascada de Minas Viejas'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Senderismo a Minas Viejas',
        description: 'Caminata por sendero boscoso hasta las cascadas gemelas.',
        activities: ['Senderismo guiado', 'Nado en poza principal', 'Observación de flora y fauna']
      }
    ],
    included: ['Guía naturalista', 'Equipo básico', 'Transporte'],
    notIncluded: ['Equipo de fotografía', 'Comida'],
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'huasteca-aventura' });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Tour.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin27';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@huasteca.com';
    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword,
      name: 'Administrador Huasteca',
    });
    console.log(`👤 Admin created: ${adminUser.email} / ${adminPassword}`);

    // Create tours one by one to trigger pre-save slug hooks
    let createdCount = 0;
    for (const tourData of sampleTours) {
      await Tour.create(tourData);
      createdCount++;
    }
    console.log(`🏞️  Created ${createdCount} tours`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL || 'admin@huasteca.com'}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin27'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
