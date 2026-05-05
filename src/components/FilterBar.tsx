import { TodoStatus, TodoPriority } from '../types'

interface FilterBarProps {
  selectedStatus: TodoStatus | 'all'
  selectedPriority: TodoPriority | 'all'
  sortBy: 'createdAt' | 'dueDate' | 'priority'
  onStatusChange: (status: TodoStatus | 'all') => void
  onPriorityChange: (priority: TodoPriority | 'all') => void
  onSortChange: (sort: 'createdAt' | 'dueDate' | 'priority') => void
}

export default function FilterBar({
  selectedStatus,
  selectedPriority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as TodoStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value={TodoStatus.PENDING}>Pending</option>
          <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
          <option value={TodoStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as TodoPriority | 'all')}
        >
          <option value="all">All Priorities</option>
          <option value={TodoPriority.LOW}>Low</option>
          <option value={TodoPriority.MEDIUM}>Medium</option>
          <option value={TodoPriority.HIGH}>High</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort By</label>
        <select id="sort-by" value={sortBy} onChange={(e) => onSortChange(e.target.value as any)}>
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  )
}
