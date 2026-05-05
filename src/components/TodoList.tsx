import { Todo, TodoPriority } from '../types'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdatePriority: (id: number, priority: TodoPriority) => void
}

export default function TodoList({ todos, onToggle, onDelete, onUpdatePriority }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos yet. Add one above.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </ul>
  )
}