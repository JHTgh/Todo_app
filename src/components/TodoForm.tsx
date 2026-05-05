import { useState, FormEvent } from 'react'
import { Todo, TodoPriority, TodoStatus } from '../types'

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING)
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM)
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    setTitle('')
    setDescription('')
    setStatus(TodoStatus.PENDING)
    setPriority(TodoPriority.MEDIUM)
    setDueDate('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TodoPriority)}
        >
          <option value={TodoPriority.LOW}>Low</option>
          <option value={TodoPriority.MEDIUM}>Medium</option>
          <option value={TodoPriority.HIGH}>High</option>
        </select>
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TodoStatus)}
        >
          <option value={TodoStatus.PENDING}>Pending</option>
          <option value={TodoStatus.IN_PROGRESS}>In progress</option>
          <option value={TodoStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <button type="submit">Add Todo</button>
    </form>
  )
}