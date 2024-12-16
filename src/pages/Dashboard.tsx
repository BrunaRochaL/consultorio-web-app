import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import { StatsSection } from '@/components/Dashboard/StatsSection/StatsSection'

import { useGetDashboardDataQuery, useGetRemindersQuery } from '@/services/api'

import { AppointmentsTable } from '../components/Dashboard/AppointmentsTable/AppointmentsTable'
import CalendarSection from '../components/Dashboard/CalendarSection/CalendarSection'
import PatientsList from '../components/Dashboard/PatientsList/PatientsList'
import SearchSection from '../components/Dashboard/SearchSection/SearchSection'
import styles from '../styles/Typography.module.css'

type DashboardPatient = {
  id: number
  name: string
  avatar: string
  appointmentTime: string
  isCompleted: boolean
}

const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isChangingDate, setIsChangingDate] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get('date')
    return dateParam ? new Date(dateParam) : new Date()
  })

  const {
    data: dayData,
    isLoading,
    error,
  } = useGetDashboardDataQuery(selectedDate)

  const { data: reminders, isLoading: isLoadingReminders } =
    useGetRemindersQuery()

  const handleDateSelect = (date: Date) => {
    setIsChangingDate(true)
    setSelectedDate(date)
    setSearchParams({ date: date.toISOString().split('T')[0] })
  }

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsChangingDate(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [dayData, isLoading])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    console.log('Buscando por:', value)
  }

  const handleStatsClick = {
    patients: () => console.log('Navegando para lista de pacientes'),
    appointments: () => console.log('Navegando para agenda'),
    revenue: () => console.log('Navegando para relatório financeiro'),
  }

  if (error) {
    return <div>Erro ao carregar dados</div>
  }

  const stats = dayData?.stats || {
    patients: 0,
    appointments: 0,
    revenue: 0,
    compareToPrevious: {
      patients: 0,
      appointments: 0,
      revenue: 0,
    },
  }

  return (
    <Row>
      <Col xs={12} lg={8}>
        <SearchSection
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Busca"
        />
        <h5 className={styles.sectionTitle}>Dashboard</h5>
        <StatsSection
          dailyPatients={stats.patients}
          dailyAppointments={stats.appointments}
          dailyRevenue={stats.revenue}
          onCardClick={handleStatsClick}
          compareToPrevious={stats.compareToPrevious}
          loading={isLoading || isChangingDate}
        />

        <AppointmentsTable
          data={reminders || []}
          isLoading={isLoadingReminders || isChangingDate}
        />
      </Col>

      <Col xs={12} lg={4}>
        <CalendarSection
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <PatientsList
          patients={dayData?.patients as DashboardPatient[]}
          isLoading={isLoading || isChangingDate}
        />
      </Col>
    </Row>
  )
}

export default Dashboard
