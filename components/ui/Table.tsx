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
            <tr className="text-sm font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {data.map((item) => (
              <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 text-base">
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
    </div>
  );
};

export default Table;