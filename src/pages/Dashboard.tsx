import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import { StatsSection } from '@/components/Dashboard/StatsSection/StatsSection'

import { useAppointmentsStats } from '@/hooks/useAppointmentsStats'

import { formatDayOfWeek } from '@/utils/helpers'

import { useGetRemindersQuery } from '@/services/api'
import { useGetAppointmentsQuery } from '@/services/api/appointments'
import { Appointment } from '@/services/api/appointments'

import { AppointmentsTable } from '../components/Dashboard/AppointmentsTable/AppointmentsTable'
import CalendarSection from '../components/Dashboard/CalendarSection/CalendarSection'
import PatientsList from '../components/Dashboard/PatientsList/PatientsList'
import SearchSection from '../components/Dashboard/SearchSection/SearchSection'
import styles from '../styles/Typography.module.css'

const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isChangingDate, setIsChangingDate] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get('date')
    return dateParam ? new Date(dateParam) : new Date()
  })

  const previousDate = new Date(selectedDate)
  previousDate.setDate(previousDate.getDate() - 1)

  const {
    data: appointments,
    isLoading,
    error,
  } = useGetAppointmentsQuery(selectedDate)

  const { data: previousAppointments } = useGetAppointmentsQuery(previousDate)

  const { data: reminders, isLoading: isLoadingReminders } =
    useGetRemindersQuery()

  const stats = useAppointmentsStats(appointments, previousAppointments)

  const [weeklyAppointments, setWeeklyAppointments] = useState<
    Array<{
      date: string
      appointments: number
    }>
  >([])

  useEffect(() => {
    if (!appointments) return

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate)
      date.setDate(date.getDate() - i)
      const formattedDate = date.toISOString().split('T')[0]

      const appointmentsForDay = appointments.filter(
        (apt) => apt.date === formattedDate
      ).length

      return {
        date: formatDayOfWeek(formattedDate),
        appointments: appointmentsForDay,
      }
    }).reverse()

    setWeeklyAppointments(last7Days)
  }, [appointments, selectedDate])

  const formatPatientsList = () => {
    if (!appointments) return []

    return appointments.map((apt: Appointment) => ({
      id: Number(apt.id),
      name: apt.personalData.fullName,
      avatar: '/images/default-avatar.png',
      appointmentTime: apt.time,
      isCompleted: apt.status,
    }))
  }

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
  }, [appointments, isLoading])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleStatsClick = {
    patients: () => console.log('Navegando para lista de pacientes'),
    appointments: () => console.log('Navegando para agenda'),
    revenue: () => console.log('Navegando para relatório financeiro'),
  }

  if (error) {
    return <div>Erro ao carregar dados</div>
  }

  return (
    <Row>
      <Col xs={12} md={6} sm={12} xl={8}>
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
          weeklyAppointments={weeklyAppointments}
          onCardClick={handleStatsClick}
          compareToPrevious={stats.compareToPrevious}
          loading={isLoading || isChangingDate}
        />

        <AppointmentsTable
          data={reminders || []}
          isLoading={isLoadingReminders || isChangingDate}
        />
      </Col>

      <Col xs={12} md={6} sm={12} xl={4}>
        <CalendarSection
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <PatientsList
          patients={formatPatientsList()}
          isLoading={isLoading || isChangingDate}
        />
      </Col>
    </Row>
  )
}

export default Dashboard
