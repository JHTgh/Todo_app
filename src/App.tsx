import { useEffect, useReducer, useState } from 'react'
import { Todo, TodoStatus, TodoPriority } from './types'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import FilterBar from './components/FilterBar'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

type TodoAction =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: { id: number; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_TODO'; payload: number }

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload
    case 'ADD_TODO':
      return [action.payload, ...state]
    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, ...action.payload.updates } : todo
      )
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload)
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? {
              ...todo,
              status:
                todo.status === TodoStatus.COMPLETED
                  ? TodoStatus.PENDING
                  : TodoStatus.COMPLETED,
            }
          : todo
      )
    default:
      return state
  }
}

const priorityOrder: Record<TodoPriority, number> = {
  [TodoPriority.HIGH]: 1,
  [TodoPriority.MEDIUM]: 2,
  [TodoPriority.LOW]: 3,
}

function getFilteredAndSortedTodos(
  todos: Todo[],
  statusFilter: TodoStatus | 'all',
  priorityFilter: TodoPriority | 'all',
  sortBy: 'createdAt' | 'dueDate' | 'priority'
): Todo[] {
  // Filter
  let filtered = todos.filter((todo) => {
    const statusMatch = statusFilter === 'all' || todo.status === statusFilter
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  // Sort
  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.getTime() - b.dueDate.getTime()
      case 'priority':
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      default:
        return 0
    }
  })
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, [])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = useState<TodoPriority | 'all'>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt')

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/todos`)
      const data = await response.json()
      // Convert ISO strings to Date objects
      const parsedTodos = data.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      }))
      dispatch({ type: 'SET_TODOS', payload: parsedTodos })
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...todo,
          dueDate: todo.dueDate?.toISOString() || null,
        }),
      })
      const newTodo = await response.json()
      const parsedTodo = {
        ...newTodo,
        createdAt: new Date(newTodo.createdAt),
        dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : null,
      }
      dispatch({ type: 'ADD_TODO', payload: parsedTodo })
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const newStatus =
      todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED

    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      dispatch({ type: 'TOGGLE_TODO', payload: id })
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
      dispatch({ type: 'DELETE_TODO', payload: id })
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleUpdatePriority = async (id: number, priority: TodoPriority) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })
      dispatch({ type: 'UPDATE_TODO', payload: { id, updates: { priority } } })
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }

  const filteredAndSortedTodos = getFilteredAndSortedTodos(
    todos,
    selectedStatus,
    selectedPriority,
    sortBy
  )

  if (loading) {
    return (
      <div className="todo-app">
        <h1>Advanced Todo App</h1>
        <p style={{ textAlign: 'center', color: '#999' }}>Loading todos...</p>
      </div>
    )
  }

  return (
    <div className="todo-app">
      <h1>Todo app</h1>

      <TodoForm onSubmit={handleAddTodo} />

      <FilterBar
        selectedStatus={selectedStatus}
        selectedPriority={selectedPriority}
        sortBy={sortBy}
        onStatusChange={setSelectedStatus}
        onPriorityChange={setSelectedPriority}
        onSortChange={setSortBy}
      />

      <TodoList
        todos={filteredAndSortedTodos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onUpdatePriority={handleUpdatePriority}
      />
    </div>
  )
}

export default App