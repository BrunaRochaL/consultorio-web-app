import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { toast } from 'react-toastify'

import AppointmentsTable from '@/components/Appointments/AppointmentsTable'
import AppointmentModal from '@/components/Scheduling/AppointmentModal/AppointmentModal'
import { FilterValues } from '@/components/common/AdvancedFilters/AdvancedFilters'

import { useGetDoctorsQuery } from '@/services/api'
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '@/services/api/appointments'

const Appointments: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [filters, setFilters] = useState<FilterValues>({
    date: new Date().toISOString().split('T')[0],
  })

  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useGetAppointmentsQuery({
      date: filters.date,
      doctorId: filters.doctorId ? Number(filters.doctorId) : undefined,
      search: filters.patientName,
      time: filters.time,
      cpf: filters.cpf,
      status: filters.status,
    })

  const { data: doctors = [], isLoading: isLoadingDoctors } =
    useGetDoctorsQuery()
  const [updateAppointment] = useUpdateAppointmentMutation()

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowEditModal(true)
  }

  const handleUpdateAppointment = async (data: any) => {
    try {
      const updateData = {
        id: selectedAppointment.id,
        status: data.status,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        doctorId: selectedAppointment.doctorId,
        timeSlotId: selectedAppointment.timeSlotId,
        personalData: {
          ...selectedAppointment.personalData,
          ...data.personalData,
        },
        address: {
          ...selectedAppointment.address,
          ...data.address,
        },
        payment: {
          ...selectedAppointment.payment,
          ...data.payment,
        },
      }

      await updateAppointment(updateData).unwrap()
      toast.success('Consulta atualizada com sucesso!')
      setShowEditModal(false)
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error)
      toast.error('Erro ao atualizar consulta. Tente novamente.')
    }
  }

  const handleFiltersChange = (newFilters: FilterValues) => {
    if (Object.keys(newFilters).length === 1 && newFilters.date) {
      setFilters({
        date: newFilters.date,
      })
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
        date: newFilters.date || prevFilters.date,
      }))
    }
  }

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
        onHide={() => {
          setShowEditModal(false)
          setSelectedAppointment(null)
        }}
        onSubmit={handleUpdateAppointment}
        appointment={selectedAppointment}
        isEditMode={true}
      />
    </Container>
  )
}

export default Appointments
