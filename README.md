# Admin Management Frontend

A modern, responsive admin dashboard built with React, TypeScript, and Tailwind CSS for managing users, projects, and invitations with role-based access control.

## Features

- 🔐 **Authentication & Authorization** - Secure login with JWT tokens and role-based access
- 👥 **User Management** - View, update roles, and manage user status
- 📊 **Project Management** - Full CRUD operations for projects
- 📧 **Invitation System** - Send and manage user invitations
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔄 **Real-time Updates** - RTK Query for efficient data fetching and caching
- 🌓 **Responsive Design** - Mobile-first approach that works on all devices
- ⚡ **Fast Performance** - Optimized with React 19 and Redux Toolkit

## Tech Stack

- **Framework**: React 19.2.3
- **Language**: TypeScript 4.9.5
- **State Management**: Redux Toolkit 2.11.2 with RTK Query
- **Routing**: React Router DOM 7.12.0
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.562.0
- **Build Tool**: React Scripts 5.0.1
- **Testing**: Jest & React Testing Library

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the frontend directory
cd admin-management

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

## Running the Application

```bash
# Development mode (starts on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Redux slices and API endpoints
│   ├── authApi.ts     # Authentication API
│   ├── inviteApi.ts   # Invitation API
│   ├── projectApi.ts  # Project API
│   └── userApi.ts     # User management API
├── hooks/              # Custom React hooks
│   └── useAuth.ts     # Authentication hook
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── ProjectsPage.tsx
│   ├── UsersPage.tsx
│   └── InvitesPage.tsx
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## Available Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/login` | LoginPage | Public | User login |
| `/register` | RegisterPage | Public | User registration (invite-only) |
| `/` | Dashboard | Protected | Main dashboard |
| `/projects` | ProjectsPage | Protected | Project management |
| `/users` | UsersPage | Admin | User management |
| `/invites` | InvitesPage | Admin | Invitation management |

## Features Overview

### Authentication
- JWT-based authentication with refresh tokens
- Automatic token refresh on expiration
- Protected routes with role-based access
- Secure logout with token cleanup

### User Roles
- **ADMIN**: Full access to all features
- **USER**: Limited access to projects and profile

### Project Management
- Create new projects
- View all projects with search functionality
- Update project details (Admin only)
- Delete projects (Admin only)
- Responsive grid layout

### User Management (Admin Only)
- View all users with pagination
- Update user roles
- Change user status (active/inactive)
- Search and filter users

### Invitation System (Admin Only)
- Send email invitations to new users
- Verify invitation tokens
- View all pending invitations
- Automatic invite cleanup on registration

## Key Components

### Authentication Hook
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### RTK Query Hooks
```typescript
// Projects
const { data, isLoading } = useGetProjectsQuery();
const [createProject] = useCreateProjectMutation();

// Users
const { data } = useGetUsersQuery({ page: 1, limit: 10 });
const [updateUserRole] = useUpdateUserRoleMutation();
```

## State Management

The application uses Redux Toolkit with RTK Query for state management:

- **Global State**: User authentication, app-wide settings
- **API Cache**: Automatic caching and invalidation
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Centralized error management

## Styling

Built with Tailwind CSS utility classes:

- **Color Palette**: Indigo primary, zinc neutral colors
- **Responsive Design**: Mobile-first breakpoints
- **Components**: Custom styled cards, buttons, modals
- **Animations**: Smooth transitions and hover effects

### Customizing Tailwind

Edit `tailwind.config.js` to customize:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Customize your primary color
      },
    },
  },
}
```

## API Integration

All API calls are handled through RTK Query endpoints:

```typescript
// Example: Creating a project
const [createProject] = useCreateProjectMutation();

await createProject({ 
  name: 'New Project', 
  description: 'Description' 
}).unwrap();
```

### API Response Format
All APIs return data in this format:
```typescript
{
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

## Error Handling

Errors are handled at multiple levels:

1. **API Level**: RTK Query error responses
2. **Component Level**: Try-catch blocks with user feedback
3. **Global Level**: Error boundaries for critical failures

```typescript
try {
  await createProject(data).unwrap();
  // Success handling
} catch (error) {
  console.error('Failed to create project:', error);
  // Error handling
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage

# Run specific test file
npm test -- LoginPage.test.tsx
```

### Testing Best Practices
- Write tests for critical user flows
- Test component rendering and interactions
- Mock API calls with RTK Query
- Use React Testing Library queries

## Building for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain:
# - Minified JavaScript bundles
# - Optimized CSS
# - Static assets
# - index.html
```

### Deployment
The build folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **RTK Query Cache**: Efficient data fetching and caching
- **Image Optimization**: Properly sized and compressed assets

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues & Solutions

### Backend Connection Error
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```
**Solution**: Ensure backend is running on the correct port (default: 5000)

### Form Reset Error
```
Cannot read properties of null (reading 'reset')
```
**Solution**: Reset form before closing modal or remove reset call

### CORS Issues
**Solution**: Ensure backend has proper CORS configuration for frontend URL

## Development Workflow

1. Start backend server (`npm run dev` in backend directory)
2. Start frontend (`npm start` in frontend directory)
3. Access application at `http://localhost:3000`
4. Login with credentials or register via invite
5. Make changes and see hot-reload updates

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Write meaningful component and variable names
- Add comments for complex logic

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Email: support@yourapp.com
- Documentation: [Link to docs]

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI Icons by [Lucide](https://lucide.dev/)
- State management by [Redux Toolkit](https://redux-toolkit.js.org/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)