import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = 5; // e.g., 1 ... 4 5 [6] 7 8 ... 100

  if (totalPages <= maxPagesToShow + 2) { // +2 for first/last page
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always include first page
    pageNumbers.push(1);

    // Show ellipsis if current page is far from the start
    if (currentPage > maxPagesToShow - 1) {
      pageNumbers.push('...');
    }

    // Determine start and end for middle pages
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2));

    if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) { // Near start
        endPage = maxPagesToShow;
    } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) { // Near end
        startPage = totalPages - maxPagesToShow + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) { // Ensure not duplicating first/last
            pageNumbers.push(i);
        }
    }

    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - (maxPagesToShow - 2)) {
      pageNumbers.push('...');
    }

    // Always include last page
    pageNumbers.push(totalPages);
  }

  const uniquePageNumbers = Array.from(new Set(pageNumbers)); // Remove potential duplicates (e.g., if totalPages < maxPagesToShow)

  return (
    <div className="flex justify-center items-center space-x-4 my-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 bg-gray-700 text-blue-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 border border-blue-900"
      >
        Previous
      </button>
      {uniquePageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <button
              onClick={() => onPageChange(page)}
              className={`px-5 py-2 rounded-lg transition duration-200 border border-blue-900 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-md shadow-blue-500/30'
                  : 'bg-gray-800 text-blue-300 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ) : (
            <span className="px-2 py-2 text-gray-500">{page}</span>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2 bg-gray-700 text-blue-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 border border-blue-900"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;