import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "gray";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  rounded = false,
  className = "",
}) => {
  const variantClasses = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    secondary:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    accent:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    success:
      "bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    warning:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    error: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  const roundedClass = rounded ? "rounded-full" : "rounded";

  return (
    <span
      className={`inline-flex items-center font-medium transition-colors ${roundedClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};
