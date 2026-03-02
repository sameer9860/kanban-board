"use client";

import React from "react";
import { Column as ColumnType, Card as CardType } from "../types/board";
import Card from "./Card";
import BoardContext from "../context/BoardContext";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

const Column: React.FC<ColumnProps> = ({ column, cards, onCardClick }) => {
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
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-72 min-h-96 shadow-md transition-all duration-200 hover:shadow-lg"
    >
      <h2 className="font-bold mb-3 text-gray-900 dark:text-white text-lg">
        {column.title}
      </h2>
      <div className="space-y-2">
        {cards.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-4 text-sm">
            No cards yet
          </p>
        ) : (
          cards.map((c) => (
            <Card
              key={c.id}
              card={c}
              onCardClick={onCardClick}
            />
          ))
        )}
      </div>
      <div className="mt-3 space-y-2">
        <input
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="+ New card"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCard();
          }}
        />
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded p-2 transition-colors duration-150 font-medium"
          onClick={addCard}
        >
          Add card
        </button>
      </div>
    </div>
  );
};

export default Column;
