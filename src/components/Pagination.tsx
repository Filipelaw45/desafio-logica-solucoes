'use client';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    const maxVisibleMobile = 3;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const max = isMobile ? maxVisibleMobile : maxVisible;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage === 1) {
          pages.push(1, 2, '...');
        } else if (currentPage === totalPages) {
          pages.push('...', totalPages - 1, totalPages);
        } else {
          pages.push('...', currentPage, '...');
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
    }

    return pages;
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-8 px-4'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
      >
        Anterior
      </button>

      <div className='flex gap-1 flex-wrap justify-center'>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === 'number' ? onPageChange(page) : null)}
            disabled={page === '...'}
            className={`min-w-10 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              page === currentPage
                ? 'bg-secondary-500 text-white'
                : page === '...'
                ? 'cursor-default text-gray-400'
                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
      >
        Próxima
      </button>
    </div>
  );
}
