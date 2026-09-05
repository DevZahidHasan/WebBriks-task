import { AppError, Board, BoardMember, BoardRole, Column, Task, TaskPriority, User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kanban_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error: AppError = {
          message: data?.message || response.statusText || 'An unexpected error occurred',
          code: data?.code || `HTTP_${response.status}`,
          status: response.status,
          details: data?.details,
        };
        throw error;
      }

      return data as T;
    } catch (err: unknown) {
      if ((err as AppError).status) {
        throw err;
      }
      const networkError: AppError = {
        message: 'Unable to connect to the backend server. Please check your network or backend status.',
        code: 'NETWORK_ERROR',
        status: 0,
      };
      throw networkError;
    }
  }

  // --- Auth APIs ---
  async register(data: { email: string; password: string; name: string }): Promise<{ accessToken: string; user: User }> {
    return this.request<{ accessToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<{ accessToken: string; user: User }> {
    return this.request<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // --- Boards APIs ---
  async getBoards(): Promise<Board[]> {
    return this.request<Board[]>('/boards');
  }

  async getBoard(id: string): Promise<Board> {
    return this.request<Board>(`/boards/${id}`);
  }

  async createBoard(data: { title: string; description?: string }): Promise<Board> {
    return this.request<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: { title?: string; description?: string }): Promise<Board> {
    return this.request<Board>(`/boards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<{ success: boolean; id: string }> {
    return this.request<{ success: boolean; id: string }>(`/boards/${id}`, {
      method: 'DELETE',
    });
  }

  async addBoardMember(boardId: string, data: { email: string; role: BoardRole }): Promise<BoardMember> {
    return this.request<BoardMember>(`/boards/${boardId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeBoardMember(boardId: string, userId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/boards/${boardId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // --- Columns APIs ---
  async createColumn(boardId: string, data: { title: string }): Promise<Column> {
    return this.request<Column>(`/boards/${boardId}/columns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateColumn(columnId: string, data: { title: string }): Promise<Column> {
    return this.request<Column>(`/columns/${columnId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteColumn(columnId: string): Promise<{ success: boolean; id: string }> {
    return this.request<{ success: boolean; id: string }>(`/columns/${columnId}`, {
      method: 'DELETE',
    });
  }

  // --- Tasks APIs ---
  async createTask(
    columnId: string,
    data: {
      title: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: string | null;
      assigneeId?: string | null;
    },
  ): Promise<Task> {
    return this.request<Task>(`/columns/${columnId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(
    taskId: string,
    data: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: string | null;
      assigneeId?: string | null;
    },
  ): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: string): Promise<{ success: boolean; id: string }> {
    return this.request<{ success: boolean; id: string }>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async moveTask(taskId: string, data: { targetColumnId: string; newPositionIndex: number }): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/move`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
