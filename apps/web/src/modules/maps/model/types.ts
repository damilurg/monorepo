export interface Coordinates {
  lat: number;
  lon: number;
}

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  label: string;
  createdAt: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface LocationDTO {
  displayName: string;
  coordinates: Coordinates;
  city: string | null;
  country: string | null;
}

export interface MapsPageDTO {
  center: Coordinates;
  zoom: number;
  locationName: string;
}
