export interface LngLat {
  readonly lng: number;
  readonly lat: number;
}

export interface PoiProperties {
  name:          string;
  category:      string;
  description?:  string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface PoiFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  properties: PoiProperties;
  id?: string | number;
}

export interface PoiFeatureCollection {
  type: 'FeatureCollection';
  features: PoiFeature[];
}
