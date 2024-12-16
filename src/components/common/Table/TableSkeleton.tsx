import React from 'react'
import { Table as BTable } from 'react-bootstrap'

import styles from './TableSkeleton.module.css'

interface TableSkeletonProps {
  columns: number
  rows?: number
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <BTable hover>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index}>
              <div className={styles.skeletonHeader} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <div className={styles.skeletonCell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </BTable>
  )
}

export default TableSkeleton
