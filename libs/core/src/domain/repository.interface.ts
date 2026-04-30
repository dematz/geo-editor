import type { PoiFeatureCollection } from './geojson.types';

export interface IPoiRepository {
  save(data: PoiFeatureCollection): Promise<void>;
  getAll(): Promise<PoiFeatureCollection | null>;
  clear(): Promise<void>;
}
