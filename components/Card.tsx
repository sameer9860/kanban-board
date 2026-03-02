"use client";

import React from "react";
import { Card as CardType } from "../types/board";
import {
  useSortable,
  defaultAnimateLayoutChanges,
  AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
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
      className="bg-white dark:bg-gray-700 shadow hover:shadow-lg rounded p-3 mb-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 ease-out"
    >
      <p className="text-gray-900 dark:text-white font-medium">{card.title}</p>
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {card.description}
        </p>
      )}
    </div>
  );
};

export default Card;
