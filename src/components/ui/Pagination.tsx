'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  disabled?: boolean;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  disabled = false,
  maxVisiblePages = 5,
  showFirstLast = false,
  className = ''
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isDisabled = disabled || loading;

  // Calculate visible page range
  const getVisiblePages = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageClick = (page: number) => {
    if (!isDisabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const buttonBaseClass = "px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium";
  const buttonActiveClass = "bg-green-500 text-white";
  const buttonInactiveClass = "bg-gray-800 text-gray-300 hover:bg-gray-700";
  const buttonDisabledClass = "opacity-50 cursor-not-allowed";
  const buttonLoadingClass = "opacity-75";

  const getButtonClass = (isActive: boolean, isClickable: boolean = true) => {
    let classes = buttonBaseClass;
    
    if (isActive) {
      classes += ` ${buttonActiveClass}`;
      if (loading) classes += ` ${buttonLoadingClass}`;
    } else {
      classes += ` ${buttonInactiveClass}`;
    }
    
    if (!isClickable || isDisabled) {
      classes += ` ${buttonDisabledClass}`;
    }
    
    return classes;
  };

  const navButtonClass = `px-4 py-2 bg-gray-800 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm font-medium ${
    isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
  }`;

  return (
    <div className={`flex justify-center items-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || isDisabled}
        className={navButtonClass}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span>Previous</span>
      </button>

      {/* First Page + Ellipsis */}
      {showFirstLast && showLeftEllipsis && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            disabled={isDisabled}
            className={getButtonClass(false)}
            aria-label="Go to page 1"
          >
            1
          </button>
          <span className="px-2 text-gray-400">...</span>
        </>
      )}

      {/* Visible Page Numbers */}
      <div className="flex space-x-1">
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={isDisabled}
            className={getButtonClass(page === currentPage)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Last Page + Ellipsis */}
      {showFirstLast && showRightEllipsis && (
        <>
          <span className="px-2 text-gray-400">...</span>
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={isDisabled}
            className={getButtonClass(false)}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || isDisabled}
        className={navButtonClass}
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

// Compact variant for smaller spaces
export function CompactPagination(props: Omit<PaginationProps, 'maxVisiblePages' | 'showFirstLast'>) {
  return (
    <Pagination
      {...props}
      maxVisiblePages={3}
      showFirstLast={false}
      className={`text-xs ${props.className || ''}`}
    />
  );
}

// Loading state wrapper
export function PaginationWithLoading({
  loading,
  ...props
}: PaginationProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2 animate-pulse">
        <div className="h-10 w-20 bg-gray-700 rounded-lg"></div>
        <div className="flex space-x-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-10 w-10 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        <div className="h-10 w-20 bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return <Pagination {...props} loading={loading} />;
}

export default Pagination;
