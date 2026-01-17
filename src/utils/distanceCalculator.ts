/**
 * Distance calculation utilities for ride matching
 * Uses Haversine formula to calculate distances between coordinates
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteMatchResult {
  isExactMatch: boolean;
  pickupDistance: number;
  dropDistance: number;
  matchScore: number;
  matchType: 'exact' | 'nearby_pickup' | 'nearby_drop' | 'route_overlap' | 'no_match';
  matchLabel: string;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1Rad = toRadians(coord1.lat);
  const lat2Rad = toRadians(coord2.lat);
  const deltaLatRad = toRadians(coord2.lat - coord1.lat);
  const deltaLngRad = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export function isPointNearRoute(
  point: Coordinates,
  routeStart: Coordinates,
  routeEnd: Coordinates,
  maxDistanceKm: number = 10
): boolean {
  const distanceFromStart = calculateDistance(point, routeStart);
  const distanceFromEnd = calculateDistance(point, routeEnd);
  
  return distanceFromStart <= maxDistanceKm || distanceFromEnd <= maxDistanceKm;
}

export function calculateRouteMatch(
  userPickup: Coordinates,
  userDrop: Coordinates,
  ridePickup: Coordinates,
  rideDrop: Coordinates,
  maxDistanceKm: number = 10
): RouteMatchResult {
  const pickupDistance = calculateDistance(userPickup, ridePickup);
  const dropDistance = calculateDistance(userDrop, rideDrop);

  const isExactMatch = pickupDistance <= 2 && dropDistance <= 2;
  
  if (isExactMatch) {
    return {
      isExactMatch: true,
      pickupDistance,
      dropDistance,
      matchScore: 100,
      matchType: 'exact',
      matchLabel: 'Exact match',
    };
  }

  const hasNearbyPickup = pickupDistance <= maxDistanceKm;
  const hasNearbyDrop = dropDistance <= maxDistanceKm;

  if (hasNearbyPickup && hasNearbyDrop) {
    const avgDistance = (pickupDistance + dropDistance) / 2;
    const matchScore = Math.max(0, 90 - (avgDistance * 5));
    
    return {
      isExactMatch: false,
      pickupDistance,
      dropDistance,
      matchScore,
      matchType: 'route_overlap',
      matchLabel: `Route nearby (≈${Math.round(avgDistance)}km)`,
    };
  } else if (hasNearbyPickup) {
    const matchScore = Math.max(0, 70 - (pickupDistance * 3));
    
    return {
      isExactMatch: false,
      pickupDistance,
      dropDistance,
      matchScore,
      matchType: 'nearby_pickup',
      matchLabel: `Nearby pickup (${Math.round(pickupDistance)}km away)`,
    };
  } else if (hasNearbyDrop) {
    const matchScore = Math.max(0, 60 - (dropDistance * 3));
    
    return {
      isExactMatch: false,
      pickupDistance,
      dropDistance,
      matchScore,
      matchType: 'nearby_drop',
      matchLabel: `Nearby drop-off (${Math.round(dropDistance)}km away)`,
    };
  }

  return {
    isExactMatch: false,
    pickupDistance,
    dropDistance,
    matchScore: 0,
    matchType: 'no_match',
    matchLabel: 'Too far',
  };
}

export function sortRidesByMatch<T extends { matchResult: RouteMatchResult }>(rides: T[]): T[] {
  return rides.sort((a, b) => {
    if (a.matchResult.matchScore !== b.matchResult.matchScore) {
      return b.matchResult.matchScore - a.matchResult.matchScore;
    }
    
    if (a.matchResult.pickupDistance !== b.matchResult.pickupDistance) {
      return a.matchResult.pickupDistance - b.matchResult.pickupDistance;
    }
    
    return a.matchResult.dropDistance - b.matchResult.dropDistance;
  });
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
