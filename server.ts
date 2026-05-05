import express, { Request, Response } from 'express'
import cors from 'cors'
import { todoQueries, TodoRow, initDb } from './database.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Get all todos
app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const todos = await todoQueries.getAll()
    // Convert ISO strings to Date objects for consistency
    const formattedTodos = todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    }))
    res.json(formattedTodos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
})

// Get single todo
app.get('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const todo = await todoQueries.getById(Number(req.params.id))
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' })
  }
})

// Create todo
app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const todoData: Omit<TodoRow, 'id' | 'updatedAt'> = {
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
    }

    const id = await todoQueries.create(todoData)
    const todo = await todoQueries.getById(id)

    if (!todo) {
      return res.status(500).json({ error: 'Failed to create todo' })
    }

    res.status(201).json({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

// Update todo
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const todo = await todoQueries.getById(id)

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    const updates: Partial<Omit<TodoRow, 'id' | 'createdAt' | 'updatedAt'>> = {}

    if (req.body.title !== undefined) updates.title = req.body.title
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.status !== undefined) updates.status = req.body.status
    if (req.body.priority !== undefined) updates.priority = req.body.priority
    if (req.body.dueDate !== undefined) {
      updates.dueDate = req.body.dueDate ? new Date(req.body.dueDate).toISOString() : null
    }

    await todoQueries.update(id, updates)
    const updatedTodo = await todoQueries.getById(id)

    res.json({
      ...updatedTodo,
      createdAt: new Date(updatedTodo!.createdAt),
      dueDate: updatedTodo!.dueDate ? new Date(updatedTodo!.dueDate) : null,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

// Delete todo
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const todo = await todoQueries.getById(id)

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    await todoQueries.delete(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

// Initialize database before starting server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
