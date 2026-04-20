// src/components/Input.tsx
import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Génère un ID unique automatique si aucun n'est fourni, crucial pour l'accessibilité
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col w-full mb-4">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 text-sm font-semibold text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Conteneur de l'Input (relatif pour positionner les icônes) */}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`
              w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-1
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
              }
              ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Messages d'erreur ou d'aide contextuelle */}
        {error ? (
          <p className="mt-1.5 text-sm text-red-600 animate-pulse">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;