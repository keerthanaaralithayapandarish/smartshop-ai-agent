/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lat1 === null ||
    lon1 === undefined || lon1 === null ||
    lat2 === undefined || lat2 === null ||
    lon2 === undefined || lon2 === null
  ) {
    return null;
  }

  const p1 = Number(lat1);
  const l1 = Number(lon1);
  const p2 = Number(lat2);
  const l2 = Number(lon2);

  if (isNaN(p1) || isNaN(l1) || isNaN(p2) || isNaN(l2)) {
    return null;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((p2 - p1) * Math.PI) / 180;
  const dLon = ((l2 - l1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1 * Math.PI) / 180) *
      Math.cos((p2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Format distance in a human-readable string
 * @param {number|null} distanceKm Distance in kilometers
 * @returns {string} Formatted distance (e.g. "2.3 km away" or "650 m away")
 */
export function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return 'Distance unavailable';
  }

  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }

  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Generate a Google Maps directions URL
 * @param {number} destLat Destination latitude
 * @param {number} destLng Destination longitude
 * @param {number} [originLat] Optional origin latitude
 * @param {number} [originLng] Optional origin longitude
 * @returns {string} URL to open Google Maps navigation
 */
export function getGoogleMapsDirectionsUrl(destLat, destLng, originLat, originLng) {
  if (!destLat || !destLng) {
    return 'https://maps.google.com';
  }

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
  if (originLat && originLng) {
    url += `&origin=${originLat},${originLng}`;
  }
  return url;
}

/**
 * Get current browser geolocation as a Promise
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
