import type { PoiFeatureCollection } from '../../domain';

export interface Command {
  readonly description: string;
  execute(state: PoiFeatureCollection): PoiFeatureCollection;
  undo(state: PoiFeatureCollection): PoiFeatureCollection;
}

export interface HistoryState {
  past:    PoiFeatureCollection[];
  present: PoiFeatureCollection;
  future:  PoiFeatureCollection[];
}

const MAX_HISTORY = 50;

export function initHistory(initial: PoiFeatureCollection): HistoryState {
  return { past: [], present: initial, future: [] };
}

export function applyCommand(history: HistoryState, command: Command): HistoryState {
  const newPresent = command.execute(history.present);
  return {
    past:    [...history.past.slice(-(MAX_HISTORY - 1)), history.present],
    present: newPresent,
    future:  [],
  };
}

export function undoHistory(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;
  const previous = history.past[history.past.length - 1];
  return {
    past:    history.past.slice(0, -1),
    present: previous,
    future:  [history.present, ...history.future],
  };
}

export function redoHistory(history: HistoryState): HistoryState {
  if (history.future.length === 0) return history;
  const next = history.future[0];
  return {
    past:    [...history.past, history.present],
    present: next,
    future:  history.future.slice(1),
  };

}

export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}

export function canRedo(history: HistoryState): boolean {
  return history.future.length > 0;
}
