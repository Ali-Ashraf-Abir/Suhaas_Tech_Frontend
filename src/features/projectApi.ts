import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../services/baseQuery';
import { CreateProjectRequest, ProjectResponse, ProjectsResponse, UpdateProjectRequest } from '../types/project.types';


export const projectAPI = createApi({
  reducerPath: 'projectAPI',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    createProject: builder.mutation<ProjectResponse, CreateProjectRequest>({
      query: (projectData) => ({
        url: '/project',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Projects'],
    }),
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => '/project',
      providesTags: ['Projects'],
    }),
    getProjectById: builder.query<ProjectResponse, string>({
      query: (id) => `/project/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Projects', id }],
    }),
    updateProject: builder.mutation<
      ProjectResponse,
      { id: string; data: UpdateProjectRequest }
    >({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Projects', id },
        'Projects',
      ],
    }),
    deleteProject: builder.mutation<ProjectResponse, string>({
      query: (id) => ({
        url: `/project/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectAPI;