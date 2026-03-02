import React, { useContext } from "react";
import BoardContext from "../context/BoardContext";
import Column from "./Column";
import { Column as ColumnType, Card as CardType } from "../types/board";

const Board: React.FC = () => {
  const { state } = useContext(BoardContext);

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {state.columnOrder.map((colId) => {
        const column: ColumnType = state.columns[colId];
        const cards: CardType[] = column.cardIds.map((id) => state.cards[id]);
        return <Column key={colId} column={column} cards={cards} />;
      })}
    </div>
  );
};

export default Board;
