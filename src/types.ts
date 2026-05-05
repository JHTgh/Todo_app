export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TODO'; payload: { id: number; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_TODO'; payload: number };