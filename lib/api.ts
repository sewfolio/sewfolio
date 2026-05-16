import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants';

const TOKEN_KEY = 'sewfolio_token';

// ── Token helpers ─────────────────────────────────────────────────────────────
export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ── Base fetch ────────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const message = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message ?? 'Something went wrong';
    throw new Error(message);
  }

  return json.data as T;
}

// ── Multipart fetch (for file uploads) ───────────────────────────────────────
async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Upload failed');
  return json.data as T;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  difficulty?: string;
  estimatedTime?: string;
  status: ProjectStatus;
  coverImageUrl?: string;
  sourceType: SourceType;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { steps: number; materials: number; media: number };
  steps?: Step[];
  materials?: Material[];
  media?: Media[];
}

export type ProjectStatus = 'SAVED' | 'PLANNED' | 'IN_PROGRESS' | 'FINISHED' | 'ARCHIVED';
export type SourceType = 'TIKTOK' | 'YOUTUBE' | 'INSTAGRAM' | 'PINTEREST' | 'PDF' | 'IMAGE' | 'MANUAL' | 'OTHER';
export type MaterialType = 'FABRIC' | 'ZIPPER' | 'INTERFACING' | 'THREAD' | 'HARDWARE' | 'ELASTIC' | 'BUTTON' | 'TRIM' | 'OTHER';

export interface Step {
  id: string;
  projectId: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  videoTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  projectId: string;
  type: MaterialType;
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  projectId?: string;
  userId: string;
  type: string;
  url: string;
  filename: string;
  mimeType: string;
  extractedText?: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserStats {
  totalProjects: number;
  byStatus: Record<ProjectStatus, number>;
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (data: { email: string; name: string; password: string }) =>
    apiFetch<{ user: User; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiFetch<User>('/auth/me'),
};

// ── Users API ─────────────────────────────────────────────────────────────────
export const usersApi = {
  getStats: () => apiFetch<UserStats>('/users/me/stats'),

  update: (data: { name?: string; email?: string }) =>
    apiFetch<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Projects API ──────────────────────────────────────────────────────────────
export const projectsApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiFetch<PaginatedResult<Project>>(`/projects${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => apiFetch<Project>(`/projects/${id}`),

  create: (data: Partial<Project>) =>
    apiFetch<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Project>) =>
    apiFetch<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: ProjectStatus) =>
    apiFetch<Project>(`/projects/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),
};

// ── Steps API ─────────────────────────────────────────────────────────────────
export const stepsApi = {
  list: (projectId: string) => apiFetch<Step[]>(`/projects/${projectId}/steps`),

  create: (projectId: string, data: Partial<Step>) =>
    apiFetch<Step>(`/projects/${projectId}/steps`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectId: string, stepId: string, data: Partial<Step>) =>
    apiFetch<Step>(`/projects/${projectId}/steps/${stepId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, stepId: string) =>
    apiFetch<{ message: string }>(`/projects/${projectId}/steps/${stepId}`, {
      method: 'DELETE',
    }),
};

// ── Materials API ─────────────────────────────────────────────────────────────
export const materialsApi = {
  list: (projectId: string) => apiFetch<Material[]>(`/projects/${projectId}/materials`),

  create: (projectId: string, data: Partial<Material>) =>
    apiFetch<Material>(`/projects/${projectId}/materials`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectId: string, materialId: string, data: Partial<Material>) =>
    apiFetch<Material>(`/projects/${projectId}/materials/${materialId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, materialId: string) =>
    apiFetch<{ message: string }>(`/projects/${projectId}/materials/${materialId}`, {
      method: 'DELETE',
    }),
};

// ── Media API ─────────────────────────────────────────────────────────────────
export const mediaApi = {
  upload: (file: { uri: string; name: string; type: string }, projectId?: string) => {
    const formData = new FormData();
    formData.append('file', { uri: file.uri, name: file.name, type: file.type } as any);
    if (projectId) formData.append('projectId', projectId);
    return apiUpload<Media>('/media/upload', formData);
  },

  list: (projectId?: string) =>
    apiFetch<Media[]>(`/media${projectId ? `?projectId=${projectId}` : ''}`),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/media/${id}`, { method: 'DELETE' }),
};
