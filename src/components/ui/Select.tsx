import { forwardRef, ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    fullWidth = false,
    className = '',
    id,
    children,
    ...props
  }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const widthClass = fullWidth ? 'w-full' : '';

    const selectClasses = `
      input-field text-sm sm:text-base w-full
      ${leftIcon ? 'pl-8 sm:pl-10' : ''}
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${widthClass}
      ${className}
    `.trim();

    return (
      <div className={`mb-4 ${widthClass}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            {...props}
          >
            {children}
          </select>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
