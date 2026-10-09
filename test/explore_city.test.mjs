import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Test Haversine Distance Formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

test('getDistanceKm correctly calculates distance between known coordinates', () => {
  // Ferry Building (37.7955, -122.3937) to Cable Car Museum (37.7948, -122.4117)
  const dist = getDistanceKm(37.7955, -122.3937, 37.7948, -122.4117);
  assert.ok(dist >= 1.5 && dist <= 1.8, `Expected approx 1.6km, got ${dist}km`);
  
  // Distance to self should be 0
  assert.equal(getDistanceKm(37.7749, -122.4194, 37.7749, -122.4194), 0);
});

// 2. Test Duplicate Detection Algorithm
function findPotentialDuplicates(lat, lng, category, allReports) {
  return allReports.filter(rep => {
    if (rep.category !== category) return false;
    const distanceKm = getDistanceKm(lat, lng, rep.lat, rep.lng);
    return distanceKm <= 0.2; // 200 meters
  });
}

test('findPotentialDuplicates correctly identifies reports within 200m of the same category', () => {
  const mockReports = [
    {
      id: 'r1',
      title: 'Pothole on Embarcadero',
      category: 'pothole',
      lat: 37.7946,
      lng: -122.3929,
    },
    {
      id: 'r2',
      title: 'Broken Light in Mission',
      category: 'street_light',
      lat: 37.7599,
      lng: -122.4215,
    }
  ];

  // A new pothole report 50 meters away from r1
  const nearbyPothole = findPotentialDuplicates(37.7947, -122.3930, 'pothole', mockReports);
  assert.equal(nearbyPothole.length, 1);
  assert.equal(nearbyPothole[0].id, 'r1');

  // A new streetlight report near r1 (different category)
  const nearbyDifferentCat = findPotentialDuplicates(37.7947, -122.3930, 'street_light', mockReports);
  assert.equal(nearbyDifferentCat.length, 0);

  // A pothole report far away in Mission
  const distantPothole = findPotentialDuplicates(37.7599, -122.4215, 'pothole', mockReports);
  assert.equal(distantPothole.length, 0);
});

// 3. Test Confidence Score & Voting Formula
function computeConfidenceScore(baseScore, upvotes, verifications) {
  const calculated = baseScore + (upvotes * 4) + (verifications * 8);
  return Math.min(99, Math.max(20, calculated));
}

test('computeConfidenceScore calculates correctly and respects boundaries', () => {
  const initial = computeConfidenceScore(50, 0, 0);
  assert.equal(initial, 50);

  const boosted = computeConfidenceScore(50, 5, 2); // 50 + 20 + 16 = 86
  assert.equal(boosted, 86);

  const clampedMax = computeConfidenceScore(50, 20, 10); // 50 + 80 + 80 = 210 -> max 99
  assert.equal(clampedMax, 99);

  const clampedMin = computeConfidenceScore(10, -5, -2); // 10 - 20 - 16 = -26 -> min 20
  assert.equal(clampedMin, 20);
});

// 4. Test User Reputation & Badge Progression
function getBadgeForReputation(reputation) {
  if (reputation >= 200) return 'Civic Architect';
  if (reputation >= 100) return 'Urban Legend';
  if (reputation >= 50) return 'City Scout';
  if (reputation >= 25) return 'Pathfinder';
  return 'Rookie Explorer';
}

test('getBadgeForReputation assigns correct tier progression', () => {
  assert.equal(getBadgeForReputation(10), 'Rookie Explorer');
  assert.equal(getBadgeForReputation(35), 'Pathfinder');
  assert.equal(getBadgeForReputation(60), 'City Scout');
  assert.equal(getBadgeForReputation(120), 'Urban Legend');
  assert.equal(getBadgeForReputation(250), 'Civic Architect');
});
