import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Go up one level if running from dist folder
const rootDir = __dirname.includes('dist') ? path.join(__dirname, '..') : __dirname
const dbPath = path.join(rootDir, 'todos.db')

// Create and initialize database
let db: sqlite3.Database

const getDb = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err)
      } else {
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            reject(err)
          } else {
            // Create tables
            db.exec(
              `
              CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                priority TEXT NOT NULL DEFAULT 'medium',
                dueDate TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
              )
            `,
              (err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(db)
                }
              }
            )
          }
        })
      }
    })
  })
}

export interface TodoRow {
  id: number
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export const todoQueries = {
  // Get all todos
  getAll: async (): Promise<TodoRow[]> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM todos ORDER BY createdAt DESC', (err, rows) => {
        if (err) reject(err)
        else resolve((rows || []) as TodoRow[])
      })
    })
  },

  // Get single todo
  getById: async (id: number): Promise<TodoRow | undefined> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row as TodoRow | undefined)
      })
    })
  },

  // Create todo
  create: async (todo: Omit<TodoRow, 'id' | 'updatedAt'>): Promise<number> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString()
      db.run(
        'INSERT INTO todos (title, description, status, priority, dueDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          todo.title,
          todo.description,
          todo.status,
          todo.priority,
          todo.dueDate,
          todo.createdAt,
          now,
        ],
        function (err) {
          if (err) reject(err)
          else resolve(this.lastID as number)
        }
      )
    })
  },

  // Update todo
  update: async (
    id: number,
    updates: Partial<Omit<TodoRow, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates)
      const values = Object.values(updates)
      const now = new Date().toISOString()

      const setClause = fields.map((field) => `${field} = ?`).join(', ')
      db.run(
        `UPDATE todos SET ${setClause}, updatedAt = ? WHERE id = ?`,
        [...values, now, id],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })
  },

  // Delete todo
  delete: async (id: number): Promise<void> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  // Delete all
  deleteAll: async (): Promise<void> => {
    const db = await getDb()
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM todos', (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },
}

export const initDb = async () => {
  await getDb()
}
