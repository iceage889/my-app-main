export type ZonePrice = {
  zone: string;
  city: string;
  rate: string;
};

export const zonePrices: ZonePrice[] = [
  { zone: "Zone 1", city: "Almere (all districts)", rate: "€65/hr" },
  { zone: "Zone 1", city: "Lelystad", rate: "€85/hr" },
  { zone: "Zone 1", city: "Zeewolde", rate: "€85/hr" },
  { zone: "Zone 2", city: "Diemen", rate: "€110/hr" },
  { zone: "Zone 2", city: "Weesp", rate: "€110/hr" },
  { zone: "Zone 2", city: "Muiden", rate: "€110/hr" },
  { zone: "Zone 2", city: "Amsterdam", rate: "€120/hr" },
  { zone: "Zone 3", city: "Hilversum", rate: "€110/hr" },
  { zone: "Zone 3", city: "Amersfoort", rate: "€120/hr" },
];

export type ExtraService = {
  service: string;
  rate: string;
};

export const extraServices: ExtraService[] = [
  { service: "Help loading/unloading van", rate: "+€40 flat" },
  { service: "Stairs per floor (no elevator)", rate: "+€20/floor" },
  { service: "Furniture disassembly/reassembly", rate: "+€30/hr" },
  { service: "Paid parking", rate: "Customer pays actual cost" },
];

/** Unique city names for the booking location dropdown. */
export const serviceCities: string[] = Array.from(
  new Set(zonePrices.map((z) => z.city.replace(" (all districts)", "")))
);
