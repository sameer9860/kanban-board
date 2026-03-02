import React from "react";
import { Column as ColumnType, Card as CardType } from "../types/board";
import Card from "./Card";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

const Column: React.FC<ColumnProps> = ({ column, cards }) => {
  return (
    <div className="bg-gray-100 rounded p-2 w-64">
      <h2 className="font-bold mb-2">{column.title}</h2>
      {cards.map((c) => (
        <Card key={c.id} card={c} />
      ))}
    </div>
  );
};

export default Column;
