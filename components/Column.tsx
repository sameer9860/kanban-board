"use client";

import React from "react";
import { Column as ColumnType, Card as CardType } from "../types/board";
import Card from "./Card";
import BoardContext from "../context/BoardContext";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

const Column: React.FC<ColumnProps> = ({ column, cards }) => {
  const { dispatch } = React.useContext(BoardContext);
  const [newCardTitle, setNewCardTitle] = React.useState("");

  const { setNodeRef: setDroppableRef } = useDroppable({ id: column.id });

  const addCard = () => {
    if (!newCardTitle.trim()) return;
    dispatch({
      type: "ADD_CARD",
      payload: { columnId: column.id, title: newCardTitle },
    });
    setNewCardTitle("");
  };

  return (
    <div
      ref={setDroppableRef}
      className="bg-gray-100 rounded p-2 w-64 min-h-[100px]"
    >
      <h2 className="font-bold mb-2">{column.title}</h2>
      {cards.map((c) => (
        <Card key={c.id} card={c} />
      ))}
      <div className="mt-2">
        <input
          className="w-full border rounded p-1 mb-1"
          placeholder="New card"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCard();
          }}
        />
        <button
          className="w-full bg-green-500 text-white rounded p-1"
          onClick={addCard}
        >
          Add card
        </button>
      </div>
    </div>
  );
};

export default Column;
