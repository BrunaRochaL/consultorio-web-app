import React, { ReactNode } from 'react'

import styles from './ItemList.module.css'

interface ItemListRowProps {
  avatar?: string
  title: string
  subtitle?: string
  status?: ReactNode
  actions?: ReactNode
  onClick?: () => void
  className?: string
  leftContent?: ReactNode
  rightContent?: ReactNode
  clickable?: boolean
  endIcon?: ReactNode
}

const ItemListRow: React.FC<ItemListRowProps> = ({
  avatar,
  title,
  subtitle,
  status,
  actions,
  onClick,
  className = '',
  leftContent,
  rightContent,
  clickable,
  endIcon,
}) => {
  return (
    <div
      className={`${styles.item} ${clickable ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {leftContent ||
        (avatar && (
          <div className={styles.avatar}>
            <img src={avatar} alt="" />
          </div>
        ))}

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <span className={styles.title}>{title}</span>
          {status && <span className={styles.status}>{status}</span>}
        </div>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>

      {rightContent ||
        (actions && <div className={styles.actions}>{actions}</div>) ||
        (endIcon && <div className={styles.endIcon}>{endIcon}</div>)}
    </div>
  )
}

export default ItemListRow
