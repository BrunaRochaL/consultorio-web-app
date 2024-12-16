import React from 'react'
import { Card } from 'react-bootstrap'

import styles from './StatsCard.module.css'

import { BarChart } from '../Chart/BarChart'

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
  chartData?: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  onClick,
  className,
  icon,
  chartData,
}) => {
  return (
    <Card
      className={`${styles.statsCard} ${onClick ? styles.clickable : ''} ${className || ''}`}
      onClick={onClick}
    >
      <Card.Body className={styles.statsCardBody}>
        <div className={styles.statsContent}>
          <div>
            {!chartData && (
              <>
                <Card.Title className={styles.statsTitle}>{title}</Card.Title>
                <div className={styles.statsValue}>
                  {value} {subtitle && <small>{subtitle}</small>}
                </div>
              </>
            )}
          </div>
          {icon && <div className={styles.statsIcon}>{icon}</div>}
        </div>
        {chartData && (
          <div style={{ height: '100%' }}>
            <BarChart data={chartData} />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StatsCard
