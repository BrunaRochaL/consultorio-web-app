import { useState } from 'react'
import { toast } from 'react-toastify'

import { FilterValues } from '@/components/common/AdvancedFilters/AdvancedFilters'

import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '@/services/api/appointments'

interface AppointmentData {
  id: number
  status: string
  date: string
  time: string
  doctorId: number
  timeSlotId: number
  personalData: Record<string, any>
  address: Record<string, any>
  payment: Record<string, any>
}

export const useAppointments = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null)
  const [filters, setFilters] = useState<FilterValues>({
    date: new Date().toISOString().split('T')[0],
  })

  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useGetAppointmentsQuery({
      date: filters.date as string,
      doctorId: filters.doctorId ? Number(filters.doctorId) : undefined,
      search: filters.patientName,
      time: filters.time,
      cpf: filters.cpf,
      status: filters.status,
    })

  const [updateAppointment] = useUpdateAppointmentMutation()

  const handleEdit = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment)
    setShowEditModal(true)
  }

  const handleUpdateAppointment = async (data: Partial<AppointmentData>) => {
    try {
      if (!selectedAppointment) return

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
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error)
      toast.error('Erro ao atualizar consulta. Tente novamente.')
    }
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setSelectedAppointment(null)
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

  return {
    appointments,
    isLoadingAppointments,
    showEditModal,
    selectedAppointment,
    handleEdit,
    handleUpdateAppointment,
    handleCloseModal,
    handleFiltersChange,
  }
}
