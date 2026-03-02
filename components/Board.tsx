"use client";

import React, { useContext } from "react";
import BoardContext from "../context/BoardContext";
import Column from "./Column";
import DarkModeToggle from "./DarkModeToggle";
import { Column as ColumnType, Card as CardType } from "../types/board";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

const Board: React.FC = () => {
  const { state, dispatch } = useContext(BoardContext);
  const [newTitle, setNewTitle] = React.useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    let sourceColumnId = "";
    let destColumnId = "";
    let destIndex = 0;

    for (const colId of state.columnOrder) {
      const col = state.columns[colId];
      const idx = col.cardIds.indexOf(activeId);
      if (idx !== -1) {
        sourceColumnId = colId;
        break;
      }
    }

    if (state.columnOrder.includes(overId)) {
      destColumnId = overId;
      destIndex = state.columns[destColumnId].cardIds.length;
    } else {
      for (const colId of state.columnOrder) {
        const col = state.columns[colId];
        const idx = col.cardIds.indexOf(overId);
        if (idx !== -1) {
          destColumnId = colId;
          destIndex = idx;
          break;
        }
      }
    }

    if (
      sourceColumnId &&
      destColumnId &&
      (sourceColumnId !== destColumnId ||
        state.columns[sourceColumnId].cardIds.indexOf(activeId) !== destIndex)
    ) {
      dispatch({
        type: "MOVE_CARD",
        payload: { sourceColumnId, destColumnId, cardId: activeId, destIndex },
      });
    }
  };

  const addColumn = () => {
    if (!newTitle.trim()) return;
    dispatch({ type: "ADD_COLUMN", payload: { title: newTitle } });
    setNewTitle("");
  };

  return (
    <>
      <DarkModeToggle />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 p-4 pb-8 overflow-x-auto min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          {state.columnOrder.map((colId) => {
            const column: ColumnType = state.columns[colId];
            const cards: CardType[] = column.cardIds.map((id) => state.cards[id]);
            return (
              <SortableContext
                key={colId}
                items={column.cardIds}
                strategy={undefined}
              >
                <Column
                  key={colId}
                  column={column}
                  cards={cards}
                />
              </SortableContext>
            );
          })}
          <div className="flex-shrink-0 w-72 p-3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 shadow-md">
              <h2 className="font-bold mb-3 text-gray-900 dark:text-white text-lg">
                + New Column
              </h2>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Column title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addColumn();
                }}
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-2 transition-colors duration-150 font-medium"
                onClick={addColumn}
              >
                Add column
              </button>
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
};

export default Board;
