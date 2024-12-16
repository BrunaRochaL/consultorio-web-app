import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Bar } from 'react-chartjs-2'

import styles from './StatsCard.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
  trend,
  icon,
  chartData,
}) => {
  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Pacientes',
        data: [12, 19, 3, 5, 2, 3, 7], // Exemplo de dados
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          callback: function (value: any) {
            if (Math.floor(value) === value) {
              return value
            }
          },
        },
      },
    },
  }

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
            <Bar data={chartData} options={options} />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StatsCard
