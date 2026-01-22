export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  MANAGER = 'MANAGER'
}

export interface InviteRequest {
  email: string;
  role: UserRole;
}

export interface InviteResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: UserRole;
    token: string;
    expiresAt: string;
  };
}

export interface VerifyInviteResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    role: UserRole;
  };
}

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}