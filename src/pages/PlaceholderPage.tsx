import React from "react";
import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pageName =
    location.pathname.split("/").pop()?.replace("-", " ") || "Page";

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in text-center">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} className="text-blue-500 dark:text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-2">
        {pageName} Module
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        This feature is currently under development and is scheduled for the
        next sprint. Navigation routing is successfully established.
      </p>
    </div>
  );
};
