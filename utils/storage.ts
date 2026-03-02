import { BoardState } from "../types/board";

const STORAGE_KEY = "kanban-board-state";

export function saveBoard(state: BoardState) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error("Failed to save board to localStorage", e);
  }
}

export function loadBoard(): BoardState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as BoardState;
  } catch (e) {
    console.error("Failed to load board from localStorage", e);
    return null;
  }
}
