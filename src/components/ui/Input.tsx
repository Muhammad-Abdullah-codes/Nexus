import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startAdornment,
      endAdornment,
      fullWidth = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const widthClass = fullWidth ? "w-full" : "";

    // Professional border and ring styling
    const errorClass = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white";

    // Combined styling for a premium look
    const inputBaseClass = `
      block w-full rounded-lg border px-3 py-2.5 shadow-sm text-sm 
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      disabled:cursor-not-allowed disabled:opacity-50
      focus:outline-none focus:ring-4 transition-all duration-200
      ${errorClass}
    `;

    const paddingLeft = startAdornment ? "pl-10" : "pl-3";
    const paddingRight = endAdornment ? "pr-10" : "pr-3";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {startAdornment}
            </div>
          )}

          <input
            ref={ref}
            className={`${inputBaseClass} ${paddingLeft} ${paddingRight}`}
            {...props}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {endAdornment}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`mt-1.5 text-xs font-medium ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
