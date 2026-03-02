"use client";

import React from "react";
import { Card as CardType } from "../types/board";
import {
  useSortable,
  defaultAnimateLayoutChanges,
  AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext } from "react";
import BoardContext from "../context/BoardContext";

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const { dispatch } = useContext(BoardContext);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (onClick) onClick();
      }}
      className="bg-white dark:bg-gray-700 shadow hover:shadow-lg rounded p-3 mb-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 ease-out"
    >
        <div className="flex justify-between items-start">
        <p className="text-gray-900 dark:text-white font-medium">{card.title}</p>
        <button
          className="text-red-500 hover:text-red-700 ml-2 text-sm"
          aria-label="Delete card"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "DELETE_CARD", payload: { cardId: card.id } });
          }}
        >
          &times;
        </button>
      </div>
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {card.description}
        </p>
      )}
      {card.dueDate && (
        <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
          Due: {new Date(card.dueDate).toLocaleDateString()}
        </p>
      )}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {card.labels.map((l) => (
            <span
              key={l}
              className="text-xs bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100 px-1 rounded"
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
