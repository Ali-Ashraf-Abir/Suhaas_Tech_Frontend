export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}
