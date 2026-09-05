export type BoardRole = 'OWNER' | 'MEMBER' | 'VIEWER';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  priority: TaskPriority;
  dueDate?: string | null;
  columnId: string;
  assigneeId?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  id: string;
  role: BoardRole;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  role?: BoardRole;
  columns?: Column[];
  members?: BoardMember[];
  _count?: {
    columns: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AppError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown> | string[];
}
