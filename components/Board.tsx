import React, { useContext } from "react";
import BoardContext from "../context/BoardContext";
import Column from "./Column";
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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {state.columnOrder.map((colId) => {
          const column: ColumnType = state.columns[colId];
          const cards: CardType[] = column.cardIds.map((id) => state.cards[id]);
          return (
            <SortableContext
              key={colId}
              items={column.cardIds}
              strategy={undefined}
            >
              <Column key={colId} column={column} cards={cards} />
            </SortableContext>
          );
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
    </DndContext>
  );
};

export default Board;
