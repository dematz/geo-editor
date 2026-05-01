import type { IPoiRepository, PoiFeatureCollection } from '../domain';

export class LocalStoragePoiRepository implements IPoiRepository {
  private readonly STORAGE_KEY = 'poi_editor_state';

  async save(data: PoiFeatureCollection): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('[LocalStorageRepository] Failed to save:', err);
      throw new Error('Storage quota exceeded or unavailable');
    }
  }

  async getAll(): Promise<PoiFeatureCollection | null> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PoiFeatureCollection;
    } catch {
      console.warn('[LocalStorageRepository] Corrupt data — clearing storage');
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
