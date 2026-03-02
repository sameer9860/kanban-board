"use client";

import React from "react";
import { Card as CardType } from "../types/board";
import BoardContext from "../context/BoardContext";

interface CardModalProps {
  card: CardType | null;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const { state, dispatch } = React.useContext(BoardContext);
  const [description, setDescription] = React.useState(card?.description || "");
  const [dueDate, setDueDate] = React.useState(card?.dueDate || "");
  const [labelsStr, setLabelsStr] = React.useState(card?.labels?.join(", ") || "");

  React.useEffect(() => {
    setDescription(card?.description || "");
    setDueDate(card?.dueDate || "");
    setLabelsStr(card?.labels?.join(", ") || "");
  }, [card]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full shadow-lg transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {card.title}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Labels (comma separated)
          </label>
          <input
            className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            value={labelsStr}
            onChange={(e) => setLabelsStr(e.target.value)}
            placeholder="bug, feature, urgent"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            onClick={() => {
              if (card) {
                dispatch({
                  type: "UPDATE_CARD",
                  payload: {
                    cardId: card.id,
                    updates: {
                      description,
                      dueDate: dueDate || undefined,
                      labels: labelsStr
                        ? labelsStr
                            .split(",")
                            .map((l) => l.trim())
                            .filter((l) => l)
                        : undefined,
                    },
                  },
                });
              }
              onClose();
            }}
          >
            Save
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
