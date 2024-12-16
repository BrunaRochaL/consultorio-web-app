import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import { useGetDoctorsQuery } from '@/services/api'
import {
  useGetAppointmentsQuery,
  useGetTimeSlotsQuery,
} from '@/services/api/appointments'

import CalendarSection from '../components/Dashboard/CalendarSection/CalendarSection'
import DoctorList from '../components/Scheduling/DoctorList/DoctorList'
import TimeSlotList from '../components/Scheduling/TimeSlotList/TimeSlotList'

interface SelectedDoctor {
  id: number
  name: string
  specialty: string
}

const Scheduling: React.FC = () => {
  const { data: doctors, isLoading: isLoadingDoctors } = useGetDoctorsQuery()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor | null>(
    null
  )

  const { data: appointments, isLoading: isLoadingAppointments } =
    useGetAppointmentsQuery(
      {
        date: selectedDate.toISOString().split('T')[0],
        doctorId: selectedDoctor?.id,
      },
      {
        skip: !selectedDoctor,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    )

  const { data: timeSlots, isLoading: isLoadingTimeSlots } =
    useGetTimeSlotsQuery(
      {
        date: selectedDate.toISOString().split('T')[0],
        doctorId: selectedDoctor?.id || 0,
      },
      {
        skip: !selectedDoctor,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      }
    )

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleDoctorSelect = (doctor: SelectedDoctor) => {
    setSelectedDoctor(doctor)
  }

  // Combina os timeSlots com os appointments para marcar os horários ocupados
  const updatedTimeSlots = React.useMemo(() => {
    if (!timeSlots || !appointments) return timeSlots

    return timeSlots.map((slot) => {
      const appointment = appointments.find(
        (app) =>
          app.time === slot.time &&
          app.doctorId === selectedDoctor?.id &&
          app.status === 'AGENDADO'
      )

      if (appointment) {
        return {
          ...slot,
          available: false,
          patient: {
            id: 0,
            name: appointment.personalData.fullName,
            phone: appointment.personalData.phone,
          },
        }
      }

      return slot
    })
  }, [timeSlots, appointments, selectedDoctor?.id])

  return (
    <Row>
      <Col xs={12} md={6} sm={12} xl={4}>
        <h4>Médicos</h4>
        <DoctorList
          doctors={doctors || []}
          isLoading={isLoadingDoctors}
          onDoctorSelect={handleDoctorSelect}
        />
        <div className="mt-4">
          <CalendarSection
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      </Col>
      <Col xs={12} md={6} sm={12} xl={8}>
        <h4>Horários Disponíveis</h4>
        {selectedDoctor && (
          <div className="mb-3">
            <h5>{selectedDoctor.name}</h5>
            <p className="text-muted">{selectedDoctor.specialty}</p>
          </div>
        )}
        <TimeSlotList
          slots={updatedTimeSlots || []}
          isLoading={isLoadingTimeSlots || isLoadingAppointments}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          maxHeight={900}
        />
      </Col>
    </Row>
  )
}

export default Scheduling
