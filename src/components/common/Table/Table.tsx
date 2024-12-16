import React from 'react'
import { Table as BTable, Form, Pagination } from 'react-bootstrap'

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
  totalItems?: number
  itemsPerPage?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

const Table = <T extends { id?: string | number }>({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'Nenhum dado encontrado',
  skeletonRows = 5,
  totalItems = data.length,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onItemsPerPageChange,
}: TableProps<T>) => {
  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={skeletonRows} />
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div>
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

      <div className={styles.paginationWrapper}>
        <div className={styles.itemsPerPageWrapper}>
          <span>Itens por página:</span>
          <Form.Select
            className={styles.itemsPerPageSelect}
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Form.Select>
          <span className={styles.totalItems}>
            Total: {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className={styles.paginationControls}>
          <Pagination className="mb-0">
            <Pagination.First />
            <Pagination.Prev />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={false}>
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default Table
