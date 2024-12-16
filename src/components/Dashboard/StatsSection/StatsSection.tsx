import React from 'react'
import { Col, Row } from 'react-bootstrap'

import StatsCard from '@/components/common/StatsCard/StatsCard'

import { formatCurrency } from '@/utils/helpers'

import StatsSectionSkeleton from './StatsSectionSkeleton'

import styles from '../../../pages/Dashboard.module.css'

interface StatsSectionProps {
  dailyPatients: number
  dailyAppointments: number
  dailyRevenue: number
  weeklyAppointments: Array<{ date: string; appointments: number }>
  onCardClick?: {
    patients?: () => void
    appointments?: () => void
    revenue?: () => void
  }
  loading?: boolean
  compareToPrevious?: {
    patients?: number
    appointments?: number
    revenue?: number
  }
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  dailyPatients,
  dailyAppointments,
  dailyRevenue,
  weeklyAppointments,
  onCardClick,
  loading,
  compareToPrevious,
}) => {
  if (loading) {
    return <StatsSectionSkeleton />
  }

  return (
    <Row>
      <Col xs={12} md={6} className={styles.statsCol}>
        <StatsCard
          title="Pacientes Atendidos Hoje"
          value={dailyPatients}
          subtitle="pacientes"
          onClick={onCardClick?.patients}
          trend={undefined}
          icon={<i className="fas fa-users" />}
          chartData={{
            labels: weeklyAppointments.map((item) => item.date),
            datasets: [
              {
                label: 'Agendamentos',
                data: [15, 22, 18, 25, 20, 12, 16],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          }}
        />
      </Col>
      <Col xs={12} md={6}>
        <Row className="g-4">
          <Col xs={12}>
            <StatsCard
              title="Agendamentos do Dia"
              value={dailyAppointments}
              subtitle="consultas"
              onClick={onCardClick?.appointments}
              trend={
                compareToPrevious?.appointments
                  ? {
                      value: compareToPrevious.appointments,
                      isPositive: compareToPrevious.appointments > 0,
                    }
                  : undefined
              }
              icon={<i className="fas fa-calendar-check" />}
            />
          </Col>
          <Col xs={12}>
            <StatsCard
              title="Faturamento do Dia"
              value={formatCurrency(dailyRevenue)}
              onClick={onCardClick?.revenue}
              trend={
                compareToPrevious?.revenue
                  ? {
                      value: compareToPrevious.revenue,
                      isPositive: compareToPrevious.revenue > 0,
                    }
                  : undefined
              }
              icon={<i className="fas fa-chart-line" />}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
