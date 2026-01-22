import React, { useState } from 'react';
import { Plus, Folder, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/invite.types';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,

} from '../features/projectApi';
import { Project } from '../types/project.types';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projectsData, isLoading } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const projects = projectsData?.data || [];

  const filteredProjects = projects.filter((project:any) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      await createProject({ name, description }).unwrap();
      e.currentTarget.reset();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      await updateProject({
        id: selectedProject.id,
        data: { name, description },
      }).unwrap();
      setShowEditModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id).unwrap();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-zinc-800">Projects</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-600">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project:any) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md p-6 border border-zinc-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-zinc-600 mb-4">
                  {project.description || 'No description'}
                </p>
                <div className="text-xs text-zinc-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-zinc-800 mb-4">
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-zinc-800 mb-4">
              Edit Project
            </h2>
            <form onSubmit={handleUpdateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedProject.name}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedProject.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProject(null);
                  }}
                  className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;