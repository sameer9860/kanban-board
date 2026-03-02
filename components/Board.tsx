import React, { useContext } from "react";
import BoardContext from "../context/BoardContext";
import Column from "./Column";
import { Column as ColumnType, Card as CardType } from "../types/board";

const Board: React.FC = () => {
  const { state, dispatch } = useContext(BoardContext);
  const [newTitle, setNewTitle] = React.useState("");

  const addColumn = () => {
    if (!newTitle.trim()) return;
    dispatch({ type: "ADD_COLUMN", payload: { title: newTitle } });
    setNewTitle("");
  };

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {state.columnOrder.map((colId) => {
        const column: ColumnType = state.columns[colId];
        const cards: CardType[] = column.cardIds.map((id) => state.cards[id]);
        return <Column key={colId} column={column} cards={cards} />;
      })}
      <div className="flex-shrink-0 w-64 p-2">
        <input
          className="w-full border rounded p-1 mb-2"
          placeholder="New column"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addColumn();
          }}
        />
        <button
          className="w-full bg-blue-500 text-white rounded p-1"
          onClick={addColumn}
        >
          Add column
        </button>
      </div>
    </div>
  );
};

export default Board;
