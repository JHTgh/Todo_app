import { Todo, TodoPriority } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdatePriority: (id: number, priority: TodoPriority) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdatePriority }: TodoItemProps) {
  return (
    <li className="todo-item">
      <div className="todo-main">
        <h3>{todo.title}</h3>
        <p>{todo.description}</p>
        <div className="todo-details">
          <div className="todo-priority">
            <label htmlFor={`priority-${todo.id}`}>Priority:</label>
            <select
              id={`priority-${todo.id}`}
              value={todo.priority}
              onChange={(e) => onUpdatePriority(todo.id, e.target.value as TodoPriority)}
              className="priority-select"
            >
              <option value={TodoPriority.LOW}>Low</option>
              <option value={TodoPriority.MEDIUM}>Medium</option>
              <option value={TodoPriority.HIGH}>High</option>
            </select>
          </div>
          <p>
            <strong>Status:</strong> {todo.status}
          </p>
          {todo.dueDate && (
            <p>
              <strong>Due:</strong> {todo.dueDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button type="button" onClick={() => onToggle(todo.id)}>
          Toggle
        </button>
        <button type="button" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}