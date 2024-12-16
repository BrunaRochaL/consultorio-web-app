import React from 'react'
import { Table as BTable } from 'react-bootstrap'

import styles from './Table.module.css'
import TableSkeleton from './TableSkeleton'

interface Column {
  key: string
  label: string
  width?: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column[]
  data: T[]
  height?: string | number
  isLoading?: boolean
  emptyMessage?: string
  skeletonRows?: number
}

const Table = <T extends { id?: string | number }>({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'Nenhum dado encontrado',
  skeletonRows = 5,
}: TableProps<T>) => {
  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={skeletonRows} />
  }

  return (
    <div className={styles.tableWrapper}>
      <BTable hover className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data?.length ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyMessage}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key as keyof T], row)
                      : row[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </BTable>
    </div>
  )
}

export default Table
