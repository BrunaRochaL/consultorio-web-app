import React from 'react'
import { Card } from 'react-bootstrap'

import styles from './StatsCard.module.css'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  onClick?: () => void
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  onClick,
  className,
  trend,
  icon,
}) => {
  return (
    <Card
      className={`${styles.statsCard} ${onClick ? styles.clickable : ''} ${className || ''}`}
      onClick={onClick}
    >
      <Card.Body className={styles.statsCardBody}>
        <div className={styles.statsContent}>
          <div>
            <Card.Title className={styles.statsTitle}>{title}</Card.Title>
            <div className={styles.statsValue}>
              {value} {subtitle && <small>{subtitle}</small>}
            </div>
          </div>
          {icon && <div className={styles.statsIcon}>{icon}</div>}
        </div>
        {trend && (
          <div className={styles.statsTrend}>
            <small
              className={trend.isPositive ? styles.positive : styles.negative}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}% em relação ao dia anterior
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StatsCard
