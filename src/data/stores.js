/**
 * SmartShop AI - Nearby Physical Store Locations & Inventory
 * IMPORTANT NOTICE:
 * All store addresses, inventory stock levels, and store prices are realistic DEMO DATA
 * created for demonstration and hackathon testing purposes.
 */

export const PHYSICAL_STORES = [
  {
    id: 'croma-indiranagar',
    name: 'Croma Megastore - Indiranagar',
    brand: 'Croma',
    city: 'Bengaluru',
    area: '100ft Road, Indiranagar',
    address: 'No. 772, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 80 4930 2200',
    email: 'indiranagar@croma.com',
    hours: '10:00 AM – 9:30 PM (Open Today)',
    rating: 4.6,
    reviewsCount: 1820,
    coordinates: {
      lat: 12.9716,
      lng: 77.6412
    },
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
    amenities: ['Curbside Pickup', 'Live Product Demo', 'Onsite Tech Experts', 'Free Parking', 'Device Trade-In'],
    // Product stock map: productId -> { stock: number, status: 'In Stock' | 'Limited Stock' | 'Out of Stock', price: number }
    inventory: {
      'macbook-air-m3-13': { stock: 4, status: 'In Stock', price: 126900 },
      'dell-xps-13-9340': { stock: 2, status: 'In Stock', price: 149990 },
      'asus-rog-zephyrus-g14': { stock: 1, status: 'Limited Stock', price: 162990 },
      'lenovo-thinkpad-e14': { stock: 5, status: 'In Stock', price: 61990 },
      'hp-pavilion-15': { stock: 6, status: 'In Stock', price: 54990 },
      'iphone-16-pro': { stock: 3, status: 'Limited Stock', price: 125900 },
      'samsung-galaxy-s24-ultra': { stock: 4, status: 'In Stock', price: 122999 },
      'oneplus-12': { stock: 7, status: 'In Stock', price: 66999 },
      'google-pixel-9-pro': { stock: 2, status: 'Limited Stock', price: 104999 },
      'sony-wh-1000xm5': { stock: 8, status: 'In Stock', price: 28490 },
      'bose-quietcomfort-ultra': { stock: 3, status: 'In Stock', price: 31490 },
      'apple-airpods-pro-2': { stock: 12, status: 'In Stock', price: 21990 },
      'boat-rockerz-550': { stock: 15, status: 'In Stock', price: 1999 },
      'apple-watch-series-10': { stock: 2, status: 'Limited Stock', price: 47900 },
      'samsung-galaxy-watch-7': { stock: 5, status: 'In Stock', price: 28999 },
      'oneplus-watch-2': { stock: 4, status: 'In Stock', price: 22999 },
    }
  },
  {
    id: 'reliance-koramangala',
    name: 'Reliance Digital - Koramangala',
    brand: 'Reliance Digital',
    city: 'Bengaluru',
    area: '80 Feet Road, 7th Block',
    address: '80 Feet Main Rd, 7th Block, Koramangala, Bengaluru, Karnataka 560095',
    phone: '+91 80 4124 8899',
    email: 'koramangala@reliancedigital.in',
    hours: '10:30 AM – 10:00 PM (Open Today)',
    rating: 4.5,
    reviewsCount: 1450,
    coordinates: {
      lat: 12.9352,
      lng: 77.6245
    },
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=800&q=80',
    amenities: ['Instant Store Pickup', 'ResQ Service Center', 'EMI Desk', 'Demo Lounge'],
    inventory: {
      'macbook-air-m3-13': { stock: 3, status: 'In Stock', price: 125990 },
      'dell-xps-13-9340': { stock: 1, status: 'Limited Stock', price: 148990 },
      'asus-rog-zephyrus-g14': { stock: 2, status: 'In Stock', price: 161990 },
      'lenovo-thinkpad-e14': { stock: 4, status: 'In Stock', price: 60990 },
      'hp-pavilion-15': { stock: 8, status: 'In Stock', price: 53990 },
      'iphone-16-pro': { stock: 2, status: 'Limited Stock', price: 126500 },
      'samsung-galaxy-s24-ultra': { stock: 5, status: 'In Stock', price: 121999 },
      'oneplus-12': { stock: 4, status: 'In Stock', price: 66499 },
      'google-pixel-9-pro': { stock: 1, status: 'Limited Stock', price: 103999 },
      'sony-wh-1000xm5': { stock: 6, status: 'In Stock', price: 27990 },
      'bose-quietcomfort-ultra': { stock: 2, status: 'Limited Stock', price: 31990 },
      'apple-airpods-pro-2': { stock: 9, status: 'In Stock', price: 21490 },
      'boat-rockerz-550': { stock: 20, status: 'In Stock', price: 1899 },
      'apple-watch-series-10': { stock: 4, status: 'In Stock', price: 47500 },
      'samsung-galaxy-watch-7': { stock: 6, status: 'In Stock', price: 27999 },
      'oneplus-watch-2': { stock: 3, status: 'In Stock', price: 22499 },
    }
  },
  {
    id: 'imagine-phoenix',
    name: 'Imagine Apple Premium Reseller - Phoenix Marketcity',
    brand: 'Apple Reseller',
    city: 'Bengaluru',
    area: 'Whitefield Main Road',
    address: 'Ground Floor, Phoenix Marketcity, Whitefield Main Rd, Mahadevapura, Bengaluru 560048',
    phone: '+91 80 6726 6200',
    email: 'phoenix@imagineonline.store',
    hours: '11:00 AM – 9:30 PM (Open Today)',
    rating: 4.8,
    reviewsCount: 2200,
    coordinates: {
      lat: 12.9960,
      lng: 77.6966
    },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    amenities: ['Official Apple Experience', 'Certified Apple Geniuses', 'Apple Trade-In', 'Official Accessories'],
    inventory: {
      'macbook-air-m3-13': { stock: 8, status: 'In Stock', price: 124900 },
      'iphone-16-pro': { stock: 6, status: 'In Stock', price: 124900 },
      'apple-airpods-pro-2': { stock: 18, status: 'In Stock', price: 20990 },
      'apple-watch-series-10': { stock: 7, status: 'In Stock', price: 46900 },
    }
  },
  {
    id: 'vijay-sales-mgroad',
    name: 'Vijay Sales - MG Road Flagship',
    brand: 'Vijay Sales',
    city: 'Bengaluru',
    area: 'MG Road Metro Station',
    address: 'Opp. Trinity Metro, Mahatma Gandhi Rd, Bengaluru, Karnataka 560001',
    phone: '+91 80 2558 1234',
    email: 'mgroad@vijaysales.com',
    hours: '10:00 AM – 9:00 PM (Open Today)',
    rating: 4.4,
    reviewsCount: 1100,
    coordinates: {
      lat: 12.9752,
      lng: 77.6094
    },
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    amenities: ['Same-Day Delivery', 'Bargain Match Guarantee', 'Extended Warranty'],
    inventory: {
      'dell-xps-13-9340': { stock: 3, status: 'In Stock', price: 147900 },
      'asus-rog-zephyrus-g14': { stock: 1, status: 'Limited Stock', price: 160990 },
      'lenovo-thinkpad-e14': { stock: 6, status: 'In Stock', price: 59990 },
      'hp-pavilion-15': { stock: 5, status: 'In Stock', price: 52990 },
      'samsung-galaxy-s24-ultra': { stock: 3, status: 'In Stock', price: 121500 },
      'sony-wh-1000xm5': { stock: 4, status: 'In Stock', price: 27500 },
      'bose-quietcomfort-ultra': { stock: 2, status: 'In Stock', price: 31800 },
      'boat-rockerz-550': { stock: 12, status: 'In Stock', price: 1750 },
    }
  },
  {
    id: 'poorvika-hsr',
    name: 'Poorvika Mobiles & Gadgets - HSR Layout',
    brand: 'Poorvika',
    city: 'Bengaluru',
    area: '27th Main Rd, Sector 1',
    address: 'No. 34, 27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
    phone: '+91 80 4321 5566',
    email: 'hsr@poorvika.com',
    hours: '9:30 AM – 10:00 PM (Open Today)',
    rating: 4.5,
    reviewsCount: 890,
    coordinates: {
      lat: 12.9121,
      lng: 77.6446
    },
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    amenities: ['Instant Mobile Screen Guard', 'Exchange Offers', 'Express 2-hr Delivery'],
    inventory: {
      'oneplus-12': { stock: 9, status: 'In Stock', price: 65499 },
      'oneplus-watch-2': { stock: 5, status: 'In Stock', price: 22200 },
      'boat-rockerz-550': { stock: 25, status: 'In Stock', price: 1799 },
      'samsung-galaxy-s24-ultra': { stock: 2, status: 'Limited Stock', price: 122000 },
    }
  },
  {
    id: 'samsung-jayanagar',
    name: 'Samsung Smart Plaza - Jayanagar 4th Block',
    brand: 'Samsung',
    city: 'Bengaluru',
    area: '11th Main, 4th Block',
    address: '11th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    phone: '+91 80 2663 8811',
    email: 'jayanagar@samsungplaza.in',
    hours: '10:00 AM – 9:00 PM (Open Today)',
    rating: 4.7,
    reviewsCount: 1680,
    coordinates: {
      lat: 12.9304,
      lng: 77.5838
    },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    amenities: ['Official Samsung Experience', 'Galaxy AI Interactive Demo', 'Smart Care Onsite Service'],
    inventory: {
      'samsung-galaxy-s24-ultra': { stock: 9, status: 'In Stock', price: 120999 },
      'samsung-galaxy-watch-7': { stock: 8, status: 'In Stock', price: 27499 },
    }
  }
];

// Reference customer baseline coordinates (Bengaluru tech corridor)
export const DEFAULT_CUSTOMER_COORDINATES = {
  lat: 12.9600,
  lng: 77.6400,
  city: 'Bengaluru',
  landmark: 'Domlur / Indiranagar Corridor'
};
