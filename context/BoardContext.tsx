"use client";

import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { BoardState, Card, Column } from "../types/board";

// Action definitions
export type Action =
  | { type: "ADD_COLUMN"; payload: { title: string } }
  | { type: "ADD_CARD"; payload: { columnId: string; title: string } }
  | {
      type: "MOVE_CARD";
      payload: {
        sourceColumnId: string;
        destColumnId: string;
        cardId: string;
        destIndex: number;
      };
    }
  | { type: "EDIT_COLUMN_TITLE"; payload: { columnId: string; title: string } }
  | { type: "DELETE_CARD"; payload: { cardId: string } }
  | { type: "DELETE_COLUMN"; payload: { columnId: string } }
  | {
      type: "REORDER_COLUMNS";
      payload: { sourceIndex: number; destIndex: number };
    }
  | { type: "UPDATE_CARD"; payload: { cardId: string; updates: Partial<Card> } }
  | { type: "SET_INITIAL_STATE"; payload: BoardState };

interface BoardContextProps {
  state: BoardState;
  dispatch: Dispatch<Action>;
}

import { loadBoard, saveBoard, STORAGE_KEY } from "../utils/storage";

const initialState: BoardState = {
  cards: {},
  columns: {},
  columnOrder: [],
};

const BoardContext = createContext<BoardContextProps>({
  state: initialState,
  dispatch: () => null,
});

function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.payload;

    case "ADD_COLUMN": {
      const id = `column-${Date.now()}`;
      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: { id, title: action.payload.title, cardIds: [] },
        },
        columnOrder: [...state.columnOrder, id],
      };
    }

    case "ADD_CARD": {
      const { columnId, title } = action.payload;
      const cardId = `card-${Date.now()}`;
      const newCard: Card = { id: cardId, title };
      const column = state.columns[columnId];
      if (!column) return state;
      return {
        ...state,
        cards: { ...state.cards, [cardId]: newCard },
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            cardIds: [...column.cardIds, cardId],
          },
        },
      };
    }

    case "MOVE_CARD": {
      const { sourceColumnId, destColumnId, cardId, destIndex } =
        action.payload;
      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destColumnId];
      if (!sourceColumn || !destColumn) return state;

      // remove from source
      const newSourceIds = sourceColumn.cardIds.filter(id => id !== cardId);
      // insert into dest
      const newDestIds = [...destColumn.cardIds];
      newDestIds.splice(destIndex, 0, cardId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: { ...sourceColumn, cardIds: newSourceIds },
          [destColumnId]: { ...destColumn, cardIds: newDestIds },
        },
      };
    }

    case "EDIT_COLUMN_TITLE": {
      const { columnId, title } = action.payload;
      const column = state.columns[columnId];
      if (!column) return state;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: { ...column, title },
        },
      };
    }

    case "DELETE_CARD": {
      const { cardId } = action.payload;
      const newCards = { ...state.cards };
      delete newCards[cardId];
      const newColumns = Object.fromEntries(
        Object.entries(state.columns).map(([id, col]) => [
          id,
          { ...col, cardIds: col.cardIds.filter((c) => c !== cardId) },
        ])
      );
      return {
        ...state,
        cards: newCards,
        columns: newColumns,
      };
    }

    case "DELETE_COLUMN": {
      const { columnId } = action.payload;
      const newColumns = { ...state.columns };
      const column = newColumns[columnId];
      if (!column) return state;
      // remove associated cards
      const newCards = { ...state.cards };
      column.cardIds.forEach((cid) => delete newCards[cid]);
      delete newColumns[columnId];
      return {
        ...state,
        columns: newColumns,
        cards: newCards,
        columnOrder: state.columnOrder.filter((id) => id !== columnId),
      };
    }

    case "REORDER_COLUMNS": {
      const { sourceIndex, destIndex } = action.payload;
      const newOrder = [...state.columnOrder];
      const [moved] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(destIndex, 0, moved);
      return {
        ...state,
        columnOrder: newOrder,
      };
    }

    case "UPDATE_CARD": {
      const { cardId, updates } = action.payload;
      const card = state.cards[cardId];
      if (!card) return state;
      return {
        ...state,
        cards: { ...state.cards, [cardId]: { ...card, ...updates } },
      };
    }

    default:
      return state;
  }
}

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const saved = loadBoard();
    if (saved) {
      dispatch({ type: "SET_INITIAL_STATE", payload: saved });
    }
    setIsLoaded(true);
  }, []);

  // sync with other tabs/windows via storage event
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed: BoardState = JSON.parse(e.newValue);
          dispatch({ type: "SET_INITIAL_STATE", payload: parsed });
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      saveBoard(state);
    }
  }, [state, isLoaded]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContext;
