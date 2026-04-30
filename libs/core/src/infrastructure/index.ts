export { LocalStoragePoiRepository } from './local-storage.repository';

import type { IPoiRepository } from '../domain';
import { LocalStoragePoiRepository } from './local-storage.repository';

export function createPoiRepository(): IPoiRepository {
  return new LocalStoragePoiRepository();
}
