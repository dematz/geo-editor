import { describe, it, expect } from 'vitest';
import {
  initHistory, applyCommand, undoHistory, redoHistory, canUndo, canRedo,
} from '../command.types';
import { addPoiCommand, removePoiCommand, updatePoiCommand } from '../poi.commands';
import { emptyCollection } from '../../poi.use-cases';

const baseHistory = () => initHistory(emptyCollection());

describe('History — applyCommand', () => {
  it('executes command and moves present to past', () => {
    const h1 = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    expect(h1.present.features).toHaveLength(1);
    expect(h1.past).toHaveLength(1);
    expect(h1.future).toHaveLength(0);
  });

  it('clears future on new command', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    h = undoHistory(h);
    h = applyCommand(h, addPoiCommand({ lng: -75, lat: 6.2 }, 'POI B', 'cafe'));
    expect(h.future).toHaveLength(0);
  });

  it('caps history at 50 steps', () => {
    let h = baseHistory();
    for (let i = 0; i < 55; i++) {
      h = applyCommand(h, addPoiCommand({ lng: -74 + i * 0.01, lat: 4.7 }, `POI ${i}`, 'park'));
    }
    expect(h.past.length).toBeLessThanOrEqual(50);
  });
});

describe('History — undo', () => {
  it('reverts to previous state', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    h = undoHistory(h);
    expect(h.present.features).toHaveLength(0);
    expect(h.future).toHaveLength(1);
  });

  it('does nothing when no past', () => {
    const h = baseHistory();
    expect(undoHistory(h)).toBe(h);
  });
});

describe('History — redo', () => {
  it('re-applies undone state', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    h = undoHistory(h);
    h = redoHistory(h);
    expect(h.present.features).toHaveLength(1);
    expect(h.future).toHaveLength(0);
  });

  it('does nothing when no future', () => {
    const h = baseHistory();
    expect(redoHistory(h)).toBe(h);
  });
});

describe('canUndo / canRedo', () => {
  it('canUndo is false on fresh history', () => {
    expect(canUndo(baseHistory())).toBe(false);
  });

  it('canUndo is true after a command', () => {
    const h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'A', 'park'));
    expect(canUndo(h)).toBe(true);
  });

  it('canRedo is true after undo', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'A', 'park'));
    h = undoHistory(h);
    expect(canRedo(h)).toBe(true);
  });
});

describe('removePoiCommand', () => {
  it('removes and restores on undo', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    const poi = h.present.features[0];
    h = applyCommand(h, removePoiCommand(poi));
    expect(h.present.features).toHaveLength(0);
    h = undoHistory(h);
    expect(h.present.features).toHaveLength(1);
  });
});

describe('updatePoiCommand', () => {
  it('updates and reverts on undo', () => {
    let h = applyCommand(baseHistory(), addPoiCommand({ lng: -74, lat: 4.7 }, 'POI A', 'park'));
    const poi = h.present.features[0];
    h = applyCommand(h, updatePoiCommand(poi.id!, { name: 'POI A' }, { name: 'POI A Updated' }));
    expect(h.present.features[0].properties.name).toBe('POI A Updated');
    h = undoHistory(h);
    expect(h.present.features[0].properties.name).toBe('POI A');
  });
});
