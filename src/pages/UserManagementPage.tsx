import React, { useState } from "react";
import {
    Shield,
    Users,
    Power,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "../features/userApi";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const roles = ["ADMIN", "MANAGER", "STAFF"];

const UserManagementPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const { data, isLoading } = useGetUsersQuery({ page, limit: 10 });
    const [updateRole] = useUpdateUserRoleMutation();
    const [updateStatus] = useUpdateUserStatusMutation();

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
        );
    }

    const users = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/home")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
            </div>

            {successMessage && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Users className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                    User Management
                </h1>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">

                <table className="w-full min-w-[700px] text-sm">

                    <thead className="bg-gray-50 border-b">
                        <tr className="text-left text-gray-600">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user: any) => (
                            <tr
                                key={user.id}
                                className="border-b last:border-none hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {user.email}
                                </td>

                                {/* Role */}
                                <td className="px-4 py-3">
                                    <select
                                        value={user.role}
                                        onChange={async (e) => {
                                            await updateRole({
                                                id: user.id,
                                                role: e.target.value,
                                            }).unwrap();

                                            setSuccessMessage("User role updated successfully");

                                            setTimeout(() => setSuccessMessage(null), 3000);
                                        }}
                                        className="border rounded-md px-2 py-1 text-sm"
                                    >

                                        {roles.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${user.status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={async () => {
                                            await updateStatus({
                                                id: user.id,
                                                status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                                            }).unwrap();

                                            setSuccessMessage(
                                                user.status === "ACTIVE"
                                                    ? "User account deactivated successfully"
                                                    : "User account activated successfully"
                                            );

                                            setTimeout(() => setSuccessMessage(null), 3000);
                                        }}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Power className="w-4 h-4" />
                                        {user.status === "ACTIVE"
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                        Page {meta.page} of {meta.totalPages}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 rounded border disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === meta.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 rounded border disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
