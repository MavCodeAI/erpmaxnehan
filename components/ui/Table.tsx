import React from 'react';

// Fix: Export the Column interface to be used in other components.
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends { id: string | number },>(
  { columns, data }: TableProps<T>
) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs sm:text-sm font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col, index) => (
                <th key={index} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {data.map((item) => (
              <tr key={item.id} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((col, index) => (
                  <td key={index} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : String(item[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile card view for small screens */}
      <div className="md:hidden">
        {data.map((item) => (
          <div key={item.id} className="border-b dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            {columns.map((col, index) => (
              <div key={index} className="flex justify-between py-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {col.header}:
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 text-right">
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : String(item[col.accessor])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;