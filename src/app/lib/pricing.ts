export type ZonePrice = {
  zone: string;
  city: string;
  rate: string;
};

export const zonePrices: ZonePrice[] = [
  { zone: "Zone 1 — Flevoland", city: "Almere (all districts)", rate: "€65/hr" },
  { zone: "Zone 1 — Flevoland", city: "Lelystad", rate: "€85/hr" },
  { zone: "Zone 1 — Flevoland", city: "Zeewolde", rate: "€85/hr" },
  { zone: "Zone 2 — Noord-Holland", city: "Diemen", rate: "€110/hr" },
  { zone: "Zone 2 — Noord-Holland", city: "Weesp", rate: "€110/hr" },
  { zone: "Zone 2 — Noord-Holland", city: "Muiden", rate: "€110/hr" },
  { zone: "Zone 2 — Noord-Holland", city: "Amsterdam", rate: "€120/hr" },
  { zone: "Zone 3 — Utrecht", city: "Hilversum", rate: "€110/hr" },
  { zone: "Zone 3 — Utrecht", city: "Amersfoort", rate: "€120/hr" },
];

/** Distance surcharge, charged one way from pickup to destination. */
export const distanceRate = {
  coverage: "Per km from pickup to destination",
  rate: "€0.35/km (one way)",
};

export type ExtraService = {
  service: string;
  rate: string;
};

export const extraServices: ExtraService[] = [
  { service: "Loading & unloading help", rate: "+€40 flat" },
  { service: "Stairs per floor (no elevator)", rate: "+€20/floor" },
  { service: "Furniture disassembly/reassembly", rate: "+€30/hr" },
  { service: "Paid parking", rate: "Customer pays actual cost" },
];

export type AirportRoute = {
  route: string;
  rate: string;
};

/** Airport & transfer service — luggage transport, courtesy ride included. */
export const airportRoutes: AirportRoute[] = [
  { route: "Almere ↔ Schiphol", rate: "€60 flat" },
  { route: "Almere ↔ Amsterdam", rate: "€80 flat" },
  { route: "Almere ↔ Lelystad", rate: "€40 flat" },
  { route: "Almere ↔ Utrecht", rate: "€90 flat" },
  { route: "Almere ↔ Amersfoort", rate: "€85 flat" },
  { route: "Amsterdam → Schiphol (luggage)", rate: "€150 flat" },
];

/** Unique city names for the booking location dropdown. */
export const serviceCities: string[] = Array.from(
  new Set(zonePrices.map((z) => z.city.replace(" (all districts)", "")))
);

/** Numeric hourly rate (EUR, ex BTW) per served city — hourly rate follows the destination zone. */
export const cityHourlyRates: Record<string, number> = {
  almere: 65,
  lelystad: 85,
  zeewolde: 85,
  diemen: 110,
  weesp: 110,
  muiden: 110,
  amsterdam: 120,
  hilversum: 110,
  amersfoort: 120,
};

export const DISTANCE_RATE_PER_KM = 0.35;

export function hourlyRateFor(city: string | null | undefined): number | null {
  if (!city) return null;
  return cityHourlyRates[city.toLowerCase()] ?? null;
}
