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
    };

interface BoardContextProps {
  state: BoardState;
  dispatch: Dispatch<Action>;
}

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

    default:
      return state;
  }
}

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContext;
