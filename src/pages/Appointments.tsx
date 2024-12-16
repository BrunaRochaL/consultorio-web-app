import React from 'react'
import { Container } from 'react-bootstrap'

import AppointmentsTable from '@/components/Appointments/AppointmentsTable'
import AppointmentModal from '@/components/Scheduling/AppointmentModal/AppointmentModal'

import { useAppointments } from '@/hooks/useAppointments'

import { useGetDoctorsQuery } from '@/services/api'

const Appointments: React.FC = () => {
  const {
    appointments,
    isLoadingAppointments,
    showEditModal,
    selectedAppointment,
    handleEdit,
    handleUpdateAppointment,
    handleCloseModal,
    handleFiltersChange,
  } = useAppointments()

  const { data: doctors = [], isLoading: isLoadingDoctors } =
    useGetDoctorsQuery()

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Agendamentos</h2>

      <AppointmentsTable
        appointments={appointments}
        doctors={doctors}
        isLoading={isLoadingAppointments || isLoadingDoctors}
        onEdit={handleEdit}
        onFiltersChange={handleFiltersChange}
      />

      <AppointmentModal
        show={showEditModal}
        onHide={handleCloseModal}
        onSubmit={handleUpdateAppointment}
        appointment={selectedAppointment}
        isEditMode={true}
      />
    </Container>
  )
}

export default Appointments
