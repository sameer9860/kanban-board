export interface Card {
  id: string
  title: string
  description?: string
  /** ISO string for a due date, if set */
  dueDate?: string
  /** Array of label names attached to the card */
  labels?: string[]
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
