/**
 * Geographic distance + nearest-neighbour ranking.
 * All purely client-side; no map API required.
 */

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; // earth radius km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aa = sinDLat * sinDLat + sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(aa));
}

export type GeoItem<T> = T & { lat: number; lng: number };

export function nearest<T>(
  from: { lat: number; lng: number },
  items: GeoItem<T>[],
  n = 5
): Array<GeoItem<T> & { distance_km: number }> {
  return items
    .map((it) => ({ ...it, distance_km: haversineKm(from, it) }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, n);
}

/**
 * Bangalore Urban pincode → approximate centroid lookup.
 *
 * Values are bounding-box centres derived from the BBMP pincode list. Accuracy
 * is good enough for "5 nearest providers" UX (we don't pretend to be GPS).
 * Source: India Postal Service publicly published lists; rebuilt manually.
 *
 * This is a minimal seed of pincodes that are common in central Bangalore.
 * For pincodes not in this table, we fall back to the city centroid.
 */
export const BANGALORE_PINCODE_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  "560001": { lat: 12.9764, lng: 77.6041 }, // Bangalore GPO / MG Road
  "560002": { lat: 12.9647, lng: 77.5759 }, // City Market
  "560003": { lat: 13.0096, lng: 77.5773 }, // Malleshwaram
  "560004": { lat: 12.9433, lng: 77.5723 }, // Basavanagudi
  "560005": { lat: 12.9929, lng: 77.6203 }, // Fraser Town
  "560006": { lat: 13.0114, lng: 77.5634 }, // Yashwantpur
  "560008": { lat: 12.9758, lng: 77.6412 }, // Ulsoor
  "560011": { lat: 12.9362, lng: 77.6049 }, // Jayanagar
  "560017": { lat: 12.9601, lng: 77.6493 }, // HAL / Kodihalli
  "560020": { lat: 12.9866, lng: 77.5705 }, // Seshadripuram
  "560022": { lat: 12.9926, lng: 77.5562 }, // Rajaji Nagar
  "560027": { lat: 12.9505, lng: 77.5907 }, // Shanti Nagar
  "560029": { lat: 12.9355, lng: 77.6029 }, // Bommanahalli adj. / Lakkasandra
  "560030": { lat: 12.9489, lng: 77.5928 }, // Wilson Garden
  "560034": { lat: 12.9279, lng: 77.6271 }, // Koramangala
  "560037": { lat: 12.9698, lng: 77.7499 }, // Marathahalli
  "560038": { lat: 12.9778, lng: 77.6325 }, // Indiranagar
  "560040": { lat: 12.9626, lng: 77.5363 }, // Vijayanagar
  "560043": { lat: 13.0212, lng: 77.6502 }, // HRBR / Kalyan Nagar
  "560047": { lat: 12.9434, lng: 77.6076 }, // Adugodi
  "560048": { lat: 13.0500, lng: 77.6510 }, // Whitefield boundary
  "560066": { lat: 12.9785, lng: 77.7400 }, // Whitefield
  "560068": { lat: 12.9051, lng: 77.6235 }, // HSR / Bommanahalli
  "560070": { lat: 12.9106, lng: 77.5557 }, // Banashankari II
  "560076": { lat: 12.8939, lng: 77.6022 }, // Bannerghatta
  "560078": { lat: 12.8956, lng: 77.5739 }, // J P Nagar 7
  "560085": { lat: 12.9248, lng: 77.5466 }, // Banashankari III
  "560092": { lat: 13.0428, lng: 77.5944 }, // Sahakara Nagar
  "560097": { lat: 13.0586, lng: 77.5680 }, // Jalahalli
  "560099": { lat: 12.8053, lng: 77.6918 }, // Bommasandra / Narayana Health City
  "560100": { lat: 12.8395, lng: 77.6655 }, // Electronic City
};

export const BANGALORE_CENTRE = { lat: 12.9716, lng: 77.5946 };

/**
 * Major Indian city centroids. Used when a 6-digit pincode resolves to a city
 * (via PINCODE_PREFIX_CITY) but we don't have the exact pincode in
 * BANGALORE_PINCODE_CENTROIDS or an equivalent city table.
 */
export const CITY_CENTROIDS: Record<string, { lat: number; lng: number; label: string }> = {
  bangalore: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  mumbai: { lat: 19.0760, lng: 72.8777, label: "Mumbai" },
  delhi: { lat: 28.6139, lng: 77.2090, label: "Delhi NCR" },
  chennai: { lat: 13.0827, lng: 80.2707, label: "Chennai" },
  hyderabad: { lat: 17.3850, lng: 78.4867, label: "Hyderabad" },
  kolkata: { lat: 22.5726, lng: 88.3639, label: "Kolkata" },
  pune: { lat: 18.5204, lng: 73.8567, label: "Pune" },
  ahmedabad: { lat: 23.0225, lng: 72.5714, label: "Ahmedabad" },
  jaipur: { lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  lucknow: { lat: 26.8467, lng: 80.9462, label: "Lucknow" },
  kanpur: { lat: 26.4499, lng: 80.3319, label: "Kanpur" },
  nagpur: { lat: 21.1458, lng: 79.0882, label: "Nagpur" },
  indore: { lat: 22.7196, lng: 75.8577, label: "Indore" },
  bhopal: { lat: 23.2599, lng: 77.4126, label: "Bhopal" },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, label: "Visakhapatnam" },
  surat: { lat: 21.1702, lng: 72.8311, label: "Surat" },
  vadodara: { lat: 22.3072, lng: 73.1812, label: "Vadodara" },
  patna: { lat: 25.5941, lng: 85.1376, label: "Patna" },
  kochi: { lat: 9.9312, lng: 76.2673, label: "Kochi" },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, label: "Thiruvananthapuram" },
  coimbatore: { lat: 11.0168, lng: 76.9558, label: "Coimbatore" },
  madurai: { lat: 9.9252, lng: 78.1198, label: "Madurai" },
  chandigarh: { lat: 30.7333, lng: 76.7794, label: "Chandigarh" },
  guwahati: { lat: 26.1445, lng: 91.7362, label: "Guwahati" },
  ranchi: { lat: 23.3441, lng: 85.3096, label: "Ranchi" },
  raipur: { lat: 21.2514, lng: 81.6296, label: "Raipur" },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, label: "Bhubaneswar" },
  mysore: { lat: 12.2958, lng: 76.6394, label: "Mysuru" },
  mangalore: { lat: 12.9141, lng: 74.8560, label: "Mangaluru" },
  goa: { lat: 15.2993, lng: 74.1240, label: "Goa" },
  dehradun: { lat: 30.3165, lng: 78.0322, label: "Dehradun" },
  srinagar: { lat: 34.0837, lng: 74.7973, label: "Srinagar" },
  amritsar: { lat: 31.6340, lng: 74.8723, label: "Amritsar" },
  ludhiana: { lat: 30.9010, lng: 75.8573, label: "Ludhiana" },
};

/**
 * Indian PIN-code prefix → city slug.
 *
 * India Post uses the first digit for the postal region and digits 1–3 for the
 * city/district. Major-metro prefixes are stable. This table covers the top 30
 * pincode "buckets" — anything else falls back to a region-level guess via
 * the first-digit table, and ultimately to the India centroid.
 */
export const PINCODE_PREFIX_CITY: Record<string, keyof typeof CITY_CENTROIDS> = {
  "110": "delhi", "111": "delhi", "112": "delhi",
  "201": "delhi", "121": "delhi", "122": "delhi",
  "400": "mumbai", "401": "mumbai", "402": "mumbai",
  "411": "pune", "412": "pune", "413": "pune",
  "440": "nagpur", "441": "nagpur",
  "500": "hyderabad", "501": "hyderabad", "502": "hyderabad",
  "530": "visakhapatnam",
  "560": "bangalore", "561": "bangalore", "562": "bangalore",
  "570": "mysore", "574": "mangalore", "575": "mangalore",
  "600": "chennai", "601": "chennai", "602": "chennai", "603": "chennai",
  "641": "coimbatore", "625": "madurai",
  "682": "kochi", "683": "kochi", "695": "thiruvananthapuram",
  "700": "kolkata", "711": "kolkata", "712": "kolkata", "713": "kolkata",
  "302": "jaipur", "303": "jaipur",
  "380": "ahmedabad", "382": "ahmedabad", "395": "surat", "390": "vadodara",
  "226": "lucknow", "208": "kanpur",
  "452": "indore", "462": "bhopal",
  "751": "bhubaneswar", "800": "patna",
  "160": "chandigarh", "143": "amritsar", "141": "ludhiana",
  "248": "dehradun", "190": "srinagar",
  "781": "guwahati", "834": "ranchi", "492": "raipur",
  "403": "goa",
};

const FIRST_DIGIT_REGION: Record<string, keyof typeof CITY_CENTROIDS> = {
  "1": "delhi", "2": "lucknow", "3": "jaipur", "4": "mumbai",
  "5": "hyderabad", "6": "chennai", "7": "kolkata", "8": "patna",
  "9": "delhi",
};

export const INDIA_CENTRE = { lat: 22.5937, lng: 78.9629 };

export function cityForPincode(pincode: string | null | undefined): {
  city: keyof typeof CITY_CENTROIDS | null;
  centre: { lat: number; lng: number };
} {
  if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
    return { city: null, centre: INDIA_CENTRE };
  }
  // Bangalore exact-pincode table takes precedence for nearest-neighbour quality
  if (BANGALORE_PINCODE_CENTROIDS[pincode]) {
    return { city: "bangalore", centre: BANGALORE_PINCODE_CENTROIDS[pincode] };
  }
  const prefix3 = pincode.slice(0, 3);
  if (PINCODE_PREFIX_CITY[prefix3]) {
    const city = PINCODE_PREFIX_CITY[prefix3];
    return { city, centre: CITY_CENTROIDS[city] };
  }
  const region = FIRST_DIGIT_REGION[pincode[0]];
  if (region) return { city: region, centre: CITY_CENTROIDS[region] };
  return { city: null, centre: INDIA_CENTRE };
}

export function centroidFor(pincode: string | null | undefined): { lat: number; lng: number } {
  return cityForPincode(pincode).centre;
}
