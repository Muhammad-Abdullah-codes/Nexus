import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Moon, Sun } from "lucide-react";
import { TourGuide } from "../guide/TourGuide";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    // FIXED: Restored to min-h-screen so the document can scroll naturally.
    // Removed overflow-hidden so the browser's main scrollbar takes over.
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <TourGuide />

      <Navbar />

      {/* Main Flex Wrapper - Notice no overflow properties here! */}
      <div className="flex-1 flex">
        <Sidebar />

        {/* Removed overflow-y-auto. This main tag will now stretch naturally. */}
        <main className="flex-1 p-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-300 dark:border-gray-700"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
