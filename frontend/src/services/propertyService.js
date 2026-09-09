import api from './api';

const DEFAULT_INVENTORY = [
  {
    id: 1,
    project: 'Kosal Heights',
    building: 'Tower B',
    unitNumber: 'Unit 402',
    type: 'Apartment',
    unitType: 'THREE_BHK',
    area: '1,450 sq ft',
    superBuiltUpArea: '1,450 Sq.Ft.',
    floor: '4th Floor',
    facing: 'East Facing',
    furnishing: 'Semi-Furnished',
    parking: '1 Covered Space',
    price: 12000000,
    priceDisplay: '₹1.20 Cr',
    basePrice: '₹1,15,00,000',
    basePriceRate: '₹7,930 / Sq.Ft.',
    floorRise: '₹5,00,000',
    status: 'AVAILABLE',
    statusLabel: 'Available',
    image: '/properties/apartment-1.jpg',
    gallery: [
      '/properties/apartment-1.jpg',
      '/properties/dining-and-living.jpg',
      '/properties/bedroom-1.jpg',
      '/properties/balcony-1.jpg',
    ],
  },
  {
    id: 2,
    project: 'Kosal Heights',
    building: 'Tower B',
    unitNumber: 'Unit 1205',
    type: 'Apartment',
    unitType: 'THREE_BHK',
    area: '1,850 sq ft',
    superBuiltUpArea: '1,850 Sq.Ft.',
    floor: '12th Floor',
    facing: 'North-East',
    furnishing: 'Fully Furnished',
    parking: '2 Covered Spaces',
    price: 18000000,
    priceDisplay: '₹1.80 Cr',
    basePrice: '₹1,75,00,000',
    basePriceRate: '₹9,450 / Sq.Ft.',
    floorRise: '₹5,00,000',
    status: 'RESERVED',
    statusLabel: 'Reserved',
    image: '/properties/aprtment-2.jpg',
    gallery: [
      '/properties/aprtment-2.jpg',
      '/properties/dining-2.jpg',
      '/properties/bedroom-2.jpg',
      '/properties/balcony-2.jpg',
    ],
  },
  {
    id: 3,
    project: 'Aurelia Villas',
    building: 'Phase 1',
    unitNumber: 'Villa 08',
    type: 'Villa',
    unitType: 'VILLA',
    area: '3,200 sq ft',
    superBuiltUpArea: '3,200 Sq.Ft.',
    floor: 'G+1 Floor',
    facing: 'South-East',
    furnishing: 'Luxury Semi-Furnished',
    parking: '3 Covered Spaces',
    price: 45000000,
    priceDisplay: '₹4.50 Cr',
    basePrice: '₹4,50,00,000',
    basePriceRate: '₹14,062 / Sq.Ft.',
    floorRise: '₹0',
    status: 'AVAILABLE',
    statusLabel: 'Available',
    image: '/properties/villa-1.jpg',
    gallery: [
      '/properties/villa-1.jpg',
      '/properties/dining-1.jpg',
      '/properties/bedroom-3.jpg',
      '/properties/dining-living-1.jpg',
    ],
  },
  {
    id: 4,
    project: 'Kosal Heights',
    building: 'Tower A',
    unitNumber: 'Unit 801',
    type: 'Apartment',
    unitType: 'THREE_BHK',
    area: '1,450 sq ft',
    superBuiltUpArea: '1,450 Sq.Ft.',
    floor: '8th Floor',
    facing: 'East Facing',
    furnishing: 'Semi-Furnished',
    parking: '1 Covered Space',
    price: 12000000,
    priceDisplay: '₹1.20 Cr',
    basePrice: '₹1,15,00,000',
    basePriceRate: '₹7,930 / Sq.Ft.',
    floorRise: '₹5,00,000',
    status: 'BOOKED',
    statusLabel: 'Sold',
    image: '/properties/apartment-1.jpg',
    gallery: [
      '/properties/apartment-1.jpg',
      '/properties/bedroom-4.jpg',
      '/properties/balcony-1.jpg',
      '/properties/dining-and-living.jpg',
    ],
  },
  {
    id: 5,
    project: 'Prime Plots',
    building: 'Sector 15',
    unitNumber: 'Sector 15 - P12',
    type: 'Plot',
    unitType: 'PLOT',
    area: '2,400 sq ft',
    superBuiltUpArea: '2,400 Sq.Ft.',
    floor: 'Ground Floor',
    facing: 'North Facing',
    furnishing: 'Ready for Construction',
    parking: 'Open Parking',
    price: 8500000,
    priceDisplay: '₹85.0 Lakhs',
    basePrice: '₹85,00,000',
    basePriceRate: '₹3,541 / Sq.Ft.',
    floorRise: '₹0',
    status: 'AVAILABLE',
    statusLabel: 'Available',
    image: '/properties/villa-3.jpg',
    gallery: [
      '/properties/villa-3.jpg',
      '/properties/balcony-2.jpg',
      '/properties/bedroom-1.jpg',
    ],
  },
  {
    id: 6,
    project: 'Aurelia Villas',
    building: 'Phase 2',
    unitNumber: 'Villa 15',
    type: 'Villa',
    unitType: 'VILLA',
    area: '3,400 sq ft',
    superBuiltUpArea: '3,400 Sq.Ft.',
    floor: 'G+1 Floor',
    facing: 'East Facing',
    furnishing: 'Fully Furnished',
    parking: '2 Covered Spaces',
    price: 48000000,
    priceDisplay: '₹4.80 Cr',
    basePrice: '₹4,80,00,000',
    basePriceRate: '₹14,117 / Sq.Ft.',
    floorRise: '₹0',
    status: 'BOOKED',
    statusLabel: 'Sold',
    image: '/properties/villa-2.jpg',
    gallery: [
      '/properties/villa-2.jpg',
      '/properties/dining-living-1.jpg',
      '/properties/bedroom-2.jpg',
      '/properties/balcony-1.jpg',
    ],
  },
];

const getStoredInventory = () => {
  try {
    const saved = localStorage.getItem('kosal_crm_inventory');
    if (!saved) return DEFAULT_INVENTORY;
    const parsed = JSON.parse(saved);
    // Ensure all items have real images even if stored previously without images
    return parsed.map((item, idx) => {
      const fallback = DEFAULT_INVENTORY[idx] || DEFAULT_INVENTORY[0];
      return {
        ...fallback,
        ...item,
        image: item.image || fallback.image,
        gallery:
          item.gallery && item.gallery.length > 0
            ? item.gallery
            : fallback.gallery,
      };
    });
  } catch {
    return DEFAULT_INVENTORY;
  }
};

const persistInventory = (inv) => {
  try {
    localStorage.setItem('kosal_crm_inventory', JSON.stringify(inv));
  } catch {
    // Ignore storage quota
  }
};

let localInventory = getStoredInventory();

export const propertyService = {
  // Get all inventory units
  getAllUnits: async () => {
    try {
      const projectsRes = await api.get('/api/projects');
      if (Array.isArray(projectsRes.data) && projectsRes.data.length > 0) {
        // Can enrich from backend if data exists
      }
      return localInventory;
    } catch {
      return localInventory;
    }
  },

  // Get specific unit by ID
  getUnitById: async (id) => {
    try {
      const res = await api.get(`/api/units/${id}`);
      if (res.data) {
        const foundLocal = localInventory.find((u) => String(u.id) === String(id));
        return {
          ...(foundLocal || localInventory[0]),
          ...res.data,
        };
      }
    } catch {
      // fallback
    }
    const found = localInventory.find((u) => String(u.id) === String(id));
    return found || localInventory[0];
  },

  // Mark unit as BOOKED (lock it permanently to prevent duplicate booking)
  markUnitBooked: (unitId) => {
    const idx = localInventory.findIndex((u) => String(u.id) === String(unitId));
    if (idx !== -1) {
      localInventory[idx] = {
        ...localInventory[idx],
        status: 'BOOKED',
        statusLabel: 'Sold',
      };
      persistInventory(localInventory);
      return localInventory[idx];
    }
    return null;
  },

  // Check if unit is available
  isUnitAvailable: (unitId) => {
    const found = localInventory.find((u) => String(u.id) === String(unitId));
    return found ? found.status === 'AVAILABLE' : false;
  },

  // Add new property unit to inventory
  addPropertyUnit: async (unitData) => {
    const formattedPrice = Number(unitData.price) || 10000000;
    const priceInCr = (formattedPrice / 10000000).toFixed(2);
    const priceDisplay = formattedPrice >= 10000000
      ? `₹${priceInCr} Cr`
      : `₹${(formattedPrice / 100000).toFixed(1)} Lakhs`;

    const defaultImg =
      unitData.image ||
      (unitData.type === 'Villa'
        ? '/properties/villa-1.jpg'
        : unitData.type === 'Plot'
        ? '/properties/villa-3.jpg'
        : '/properties/apartment-1.jpg');

    const newUnit = {
      id: Date.now(),
      project: unitData.project || 'Kosal Heights',
      building: unitData.building || 'Tower A',
      unitNumber: unitData.unitNumber || `Unit ${Math.floor(Math.random() * 900 + 100)}`,
      type: unitData.type || 'Apartment',
      unitType: unitData.unitType || 'THREE_BHK',
      area: `${unitData.area || 1400} sq ft`,
      superBuiltUpArea: `${unitData.area || 1400} Sq.Ft.`,
      floor: unitData.floor || '3rd Floor',
      facing: unitData.facing || 'East Facing',
      furnishing: unitData.furnishing || 'Semi-Furnished',
      parking: unitData.parking || '1 Covered Space',
      price: formattedPrice,
      priceDisplay,
      basePrice: `₹${formattedPrice.toLocaleString()}`,
      basePriceRate: `₹${Math.round(formattedPrice / (Number(unitData.area) || 1400)).toLocaleString()} / Sq.Ft.`,
      floorRise: '₹5,00,000',
      status: unitData.status || 'AVAILABLE',
      statusLabel: unitData.status === 'AVAILABLE' ? 'Available' : 'Reserved',
      image: defaultImg,
      gallery: [
        defaultImg,
        '/properties/dining-and-living.jpg',
        '/properties/bedroom-1.jpg',
        '/properties/balcony-1.jpg',
      ],
    };

    // Try posting to backend if online
    try {
      await api.post('/api/projects/1/buildings', { name: newUnit.building });
    } catch {
      // Backend not connected or ignore
    }

    localInventory.unshift(newUnit);
    persistInventory(localInventory);
    return newUnit;
  },

  // Get all projects
  getProjects: async () => {
    try {
      const res = await api.get('/api/projects');
      return res.data;
    } catch {
      return [
        { id: 1, name: 'Kosal Heights', location: 'Noida Sector 62', active: true },
        { id: 2, name: 'Aurelia Villas', location: 'Greater Noida Expressway', active: true },
        { id: 3, name: 'Prime Plots', location: 'Yamuna Expressway', active: true },
        { id: 4, name: 'Emerald Heights', location: 'Gurugram Phase 5', active: true },
      ];
    }
  },
};

export default propertyService;
