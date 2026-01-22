import React, { useState } from 'react';
import {
    Mail,
    Shield,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { UserRole } from '../types/invite.types';
import { useCreateInviteMutation } from '../features/inviteApi';
import { Select } from '../components/common/select';


interface InviteFormData {
    email: string;
    role: UserRole | '';
}
type InviteFormErrors = {
    email?: string;
    role?: string;
};

const InviteUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [createInvite, { isLoading, isError, isSuccess, error }] =
        useCreateInviteMutation();
    const [inviteLink, setInviteLink] = useState<string>("");
    const [formData, setFormData] = useState<InviteFormData>({
        email: '',
        role: '',
    });
    const [validationErrors, setValidationErrors] =
        useState<InviteFormErrors>({});
    const [copied, setCopied] = useState(false);

    const roleOptions = [
        { value: UserRole.STAFF, label: 'STAFF' },
        { value: UserRole.MANAGER, label: 'MANAGER' },
        { value: UserRole.ADMIN, label: 'Admin' },
    ];

    const validateForm = (): boolean => {
        const errors: InviteFormErrors = {};

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.role) {
            errors.role = "Role is required";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await createInvite({
                email: formData.email,
                role: formData.role as UserRole,
            }).unwrap();

            // adjust if your API response structure is different
            const token = response?.data?.token;

            if (token) {
                const frontendUrl = window.location.origin;
                setInviteLink(`${frontendUrl}/register/${token}`);
            }

            setTimeout(() => {
                setFormData({ email: '', role: '' });
            }, 2000);
        } catch (err) {
            console.error("Failed to send invite:", err);
        }
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (validationErrors[name as keyof InviteFormData]) {
            setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const getErrorMessage = () => {
        if (error && 'data' in error) {
            return (
                (error.data as any)?.message ||
                'Failed to send invite. Please try again.'
            );
        }
        return 'An unexpected error occurred';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Send className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Invite User</h1>
                        <p className="text-gray-600 mt-2">
                            Send an invitation to join your organization
                        </p>
                    </div>

                    {isError && (
                        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{getErrorMessage()}</p>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">
                                    Invitation sent successfully!
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    An email has been sent to {formData.email} with the
                                    invitation link.
                                </p>
                            </div>
                        </div>
                    )}
                    {isSuccess && inviteLink && (
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm font-medium text-blue-900 mb-2">
                                Invite Link
                            </p>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={inviteLink}
                                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(inviteLink);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1500);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <p className="text-xs text-blue-700 mt-2">
                                Share this link manually if the user does not receive the email.
                            </p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${validationErrors.email
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-sm text-red-600 ml-1">
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Role Select */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Role
                            </label>
                            <Select
                                icon={Shield}
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                options={roleOptions}
                                placeholder="Select a role"
                                error={validationErrors.role}
                            />
                            <p className="text-xs text-gray-500 mt-2 ml-1">
                                Choose the appropriate role for this user
                            </p>
                        </div>

                        {/* Role Descriptions */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Role Permissions
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium text-blue-600">Admin:</span>
                                    <span>Full system access including user management</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium text-green-600">
                                        Moderator:
                                    </span>
                                    <span>Can manage content and basic user actions</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium text-purple-600">User:</span>
                                    <span>Standard access to platform features</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isSuccess}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Invitation...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Important Information</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Invitation links expire after 24 hours</li>
                                    <li>Only one active invitation per email address</li>
                                    <li>The user will receive an email with registration link</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteUserPage;