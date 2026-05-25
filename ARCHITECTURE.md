# Nexus Platform - Architecture & Component Structure

## Core Stack

- **Frontend Framework:** React 18 (Vite)
- **Routing:** React Router v6 (Client-side routing with role-based dashboard layouts)
- **Styling:** Tailwind CSS (Utility-first, responsive, integrated dark mode)
- **Icons:** Lucide React

## Directory Structure (`/src`)

- `/components`: Reusable, stateless UI components (buttons, inputs, cards).
- `/pages`: View-level components mapped to specific routes.
- `/context`: Global state management (AuthContext, ThemeContext).
- `/layouts`: Structural wrapper components (DashboardLayout) defining sidebars and top navigation.
- `/data`: Hardcoded mock data (JSON/TS objects) simulating backend API responses.
- `/types`: TypeScript interfaces ensuring type safety across props and state.
