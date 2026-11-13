/**
 * Verified barcodes for the static catalog supporting EAN-13, EAN-8, UPC-A, and UPC-E.
 * Check digits are valid so camera scans and image scans of printed barcodes match.
 */
export const PRODUCT_BARCODES = {
  'macbook-air-m3-13': '8901001000018', // EAN-13
  'dell-xps-13-9340': '8901001000025',
  'asus-rog-zephyrus-g14': '8901001000032',
  'lenovo-thinkpad-e14': '8901001000049',
  'hp-pavilion-15': '8901001000056',
  'iphone-16-pro': '8901001000063',
  'samsung-galaxy-s24-ultra': '8901001000070',
  'oneplus-12': '8901001000087',
  'google-pixel-9-pro': '8901001000094',
  'sony-wh-1000xm5': '01234565', // UPC-E (8 digits)
  'bose-quietcomfort-ultra': '8901001000117',
  'apple-airpods-pro-2': '012345678905', // UPC-A (12 digits)
  'boat-rockerz-550': '96385074', // EAN-8 (8 digits)
  'apple-watch-series-10': '8901001000148',
  'samsung-galaxy-watch-7': '8901001000155',
  'oneplus-watch-2': '8901001000162',
};

/**
 * Quick-test demo barcodes showcasing each supported symbology standard
 */
export const SAMPLE_BARCODES = [
  { format: 'EAN-13', code: '8901001000018', name: 'MacBook Air M3 13"' },
  { format: 'EAN-8', code: '96385074', name: 'boAt Rockerz 550' },
  { format: 'UPC-A', code: '012345678905', name: 'Apple AirPods Pro 2' },
  { format: 'UPC-E', code: '01234565', name: 'Sony WH-1000XM5' },
];

