export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    url: '/img/gallery/4big.jpg',
    title: 'Industrial Compressor Installation',
    category: 'installations',
    category_id: 'cat-2', // Installations
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    url: '/img/gallery/11big.jpg',
    title: 'Maintenance Workshop',
    category: 'maintenance',
    category_id: 'cat-3', // Maintenance
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    url: '/img/gallery/12big.jpg',
    title: 'Quality Testing Process',
    category: 'testing',
    category_id: 'cat-4', // Testing
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    url: '/img/gallery/Al Ahmadeya.jpg',
    title: 'Advanced Manufacturing Facility',
    category: 'facilities',
    category_id: 'cat-5', // Facilities
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    url: '/img/gallery/Al Ahram.jpg',
    title: 'Training Session',
    category: 'training',
    category_id: 'cat-6', // Training
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    url: '/img/gallery/Al_Ahmadeya.jpg',
    title: 'Manufacturing Facility Equipment',
    category: 'facilities',
    category_id: 'cat-5', // Facilities
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    url: '/img/gallery/Alamia Advanced.jpg',
    title: 'Advanced Installation Project',
    category: 'installations',
    category_id: 'cat-2', // Installations
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    url: '/img/gallery/Alamia Qaliub.jpg',
    title: 'Industrial Installation - Qaliub',
    category: 'installations',
    category_id: 'cat-2', // Installations
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    url: '/img/gallery/maintenence.jpg',
    title: 'Maintenance Operations',
    category: 'maintenance',
    category_id: 'cat-3', // Maintenance
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    url: '/img/gallery/Egyptian Methanex.jpg',
    title: 'Egyptian Methanex Testing',
    category: 'testing',
    category_id: 'cat-4', // Testing
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    url: '/img/gallery/DSC00502.jpg',
    title: 'Installation Documentation',
    category: 'installations',
    category_id: 'cat-2', // Installations
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '12',
    url: '/img/gallery/BEST_ANALOG_COMPRESSOR_BG.jpg',
    title: 'Best Analog Compressor Facility',
    category: 'facilities',
    category_id: 'cat-5', // Facilities
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '13',
    url: '/img/gallery/Alex Pharma.jpg',
    title: 'Alex Pharma Installation',
    category: 'installations',
    category_id: 'cat-2', // Installations
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '14',
    url: '/img/gallery/Danone Egypt.jpg',
    title: 'Danone Egypt Testing',
    category: 'testing',
    category_id: 'cat-4', // Testing
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '15',
    url: '/img/gallery/EgyRoll.jpg',
    title: 'EgyRoll Maintenance',
    category: 'maintenance',
    category_id: 'cat-3', // Maintenance
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '16',
    url: '/img/gallery/IMG_4019.jpg',
    title: 'Training Documentation',
    category: 'training',
    category_id: 'cat-6', // Training
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];