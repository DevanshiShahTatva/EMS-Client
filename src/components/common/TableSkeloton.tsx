import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  striped?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
  striped = true,
}) => {
  const columnWidthPercent = 100 / columns;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className={striped && rowIndex % 2 === 1 ? 'bg-blue-50' : ''}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className={`p-4`}>
              <Skeleton className={`h-4`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
