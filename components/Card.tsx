import React from "react";
import { Card as CardType } from "../types/board";

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="bg-white shadow rounded p-2 mb-2">
      {card.title}
    </div>
  );
};

export default Card;
