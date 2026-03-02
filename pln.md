Perfect 🔥 let’s build your Kanban Board (Trello-style) step by step like a real developer.

Inspired by Trello
Using Next.js + TypeScript.

🚀 PHASE 1 — Project Setup (Day 1)
1️⃣ Create Project

Create Next.js app with TypeScript

Enable "strict": true in tsconfig.json

Setup basic folder structure:

/components
/hooks
/types
/context
/utils
🧠 PHASE 2 — Design the Data Model (VERY IMPORTANT)

Before writing UI, design your types.

2️⃣ Create Core Types (Day 1–2)

Inside /types/board.ts:

export interface Card {
  id: string
  title: string
  description?: string
}

export interface Column {
  id: string
  title: string
  cardIds: string[]
}

export interface BoardState {
  cards: Record<string, Card>
  columns: Record<string, Column>
  columnOrder: string[]
}

🔥 This structure is called normalized state.
This is how real apps manage complex UI.

⚙️ PHASE 3 — State Management (Day 2–3)
3️⃣ Create useReducer

Inside /context/BoardContext.tsx:

Define action types:

type Action =
  | { type: "ADD_COLUMN"; payload: { title: string } }
  | { type: "ADD_CARD"; payload: { columnId: string; title: string } }
  | { type: "MOVE_CARD"; payload: {...} }

Create reducer function:

function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    ...
  }
}

Wrap app with BoardProvider.

💡 This step proves your TypeScript strength.

🎨 PHASE 4 — Basic UI (Day 3–4)
4️⃣ Create Components

Board.tsx

Column.tsx

Card.tsx

Pass typed props:

interface ColumnProps {
  column: Column
  cards: Card[]
}

Render:

Columns horizontally

Cards inside columns

No drag & drop yet — keep it simple.

➕ PHASE 5 — Add Features (Day 5–6)
5️⃣ Add Column

Input field

Dispatch ADD_COLUMN

6️⃣ Add Card

Input inside column

Dispatch ADD_CARD

Make sure:

All event types are properly typed

No any used ❌

💾 PHASE 6 — Local Storage Persistence (Day 6)

Create a typed utility:

function saveBoard(state: BoardState) { ... }
function loadBoard(): BoardState | null { ... }

Use useEffect to persist state.

Now your board survives refresh 🔥

🧲 PHASE 7 — Drag & Drop (Day 7–8)

Install drag library (like dnd-kit).

Implement:

Drag cards within same column

Move cards between columns

Add new reducer action:

MOVE_CARD

This is the hardest part — but most impressive.

🌙 PHASE 8 — Polish (Day 9)

Add:

Dark mode

Smooth animations

Empty state UI

Card modal for editing description

🚀 PHASE 9 — Advanced (Optional)

Edit column title

Delete card

Delete column

Reorder columns

Add due dates

Add labels

Real-time sync