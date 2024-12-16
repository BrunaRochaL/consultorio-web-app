import React, { ReactNode } from 'react'

import styles from './ItemList.module.css'

interface ItemListProps {
  isLoading?: boolean
  loadingComponent?: ReactNode
  emptyMessage?: string
  emptyState?: ReactNode
  className?: string
  maxHeight?: number | string
  children: ReactNode
}

const ItemList: React.FC<ItemListProps> = ({
  isLoading = false,
  loadingComponent,
  emptyMessage = 'Nenhum item encontrado',
  emptyState,
  className = '',
  maxHeight = 500,
  children,
}) => {
  return (
    <div className={`${styles.list} ${className}`} style={{ maxHeight }}>
      {isLoading
        ? loadingComponent
        : React.Children.count(children) > 0
          ? children
          : emptyState || (
              <div className={styles.emptyState}>{emptyMessage}</div>
            )}
    </div>
  )
}

export default ItemList
