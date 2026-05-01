import { describe, it, expect } from 'vitest';
import { loadCollectionCommand, updatePoiCommand } from '../poi.commands';
import { addPoiCommand, removePoiCommand } from '../poi.commands';
import { emptyCollection, createPoi, addPoi } from '../../poi.use-cases';
import { initHistory, applyCommand, undoHistory } from '../command.types';
import type { PoiFeatureCollection } from '../../../domain';

const coords  = { lng: -74.07, lat: 4.71 };
const empty   = (): PoiFeatureCollection => emptyCollection();
const history = () => initHistory(empty());

describe('loadCollectionCommand', () => {
  it('replaces collection on execute', () => {
    const prev = empty();
    const next: PoiFeatureCollection = {
      type: 'FeatureCollection',
      features: [createPoi(coords, 'A', 'park')],
    };
    const cmd    = loadCollectionCommand(prev, next);
    const result = cmd.execute(prev);
    expect(result.features).toHaveLength(1);
  });

  it('restores previous collection on undo', () => {
    const poi  = createPoi(coords, 'A', 'park');
    const prev = addPoi(empty(), poi);
    const next = empty();
    const cmd  = loadCollectionCommand(prev, next);
    const undone = cmd.undo(next);
    expect(undone.features).toHaveLength(1);
  });

  it('has a description', () => {
    const cmd = loadCollectionCommand(empty(), empty());
    expect(cmd.description).toBeTruthy();
  });
});

describe('updatePoiCommand', () => {
  it('updates poi and reverts on undo via history', () => {
    let h = applyCommand(history(), addPoiCommand(coords, 'Original', 'park'));
    const id = h.present.features[0].id!;

    h = applyCommand(h, updatePoiCommand(id, { name: 'Original' }, { name: 'Updated' }));
    expect(h.present.features[0].properties.name).toBe('Updated');

    h = undoHistory(h);
    expect(h.present.features[0].properties.name).toBe('Original');
  });

  it('updates only category if name unchanged', () => {
    let h = applyCommand(history(), addPoiCommand(coords, 'My POI', 'park'));
    const id = h.present.features[0].id!;
    h = applyCommand(h, updatePoiCommand(id, { category: 'park' }, { category: 'cafe' }));
    expect(h.present.features[0].properties.category).toBe('cafe');
  });
});

describe('removePoiCommand', () => {
  it('has correct description', () => {
    const testPoi = createPoi(coords, 'Test POI', 'park');
    const cmd = removePoiCommand(testPoi);
    expect(cmd.description).toContain('Test POI');
  });
});

describe('addPoiCommand', () => {
  it('has correct description', () => {
    const cmd = addPoiCommand(coords, 'New Place', 'cafe');
    expect(cmd.description).toContain('New Place');
  });
});
