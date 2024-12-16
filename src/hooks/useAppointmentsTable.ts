import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'

import {
  AppointmentData,
  Doctor,
} from '@/components/Appointments/AppointmentsTable'
import { FilterValues } from '@/components/common/AdvancedFilters/AdvancedFilters'

interface UseAppointmentsTableProps {
  onFiltersChange: (filters: FilterValues) => void
  doctors: Doctor[]
  appointments: AppointmentData[]
}

export const useAppointmentsTable = ({
  onFiltersChange,
  doctors,
  appointments,
}: UseAppointmentsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    debouncedSearch(value)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    onFiltersChange({
      date: new Date().toISOString().split('T')[0],
    })
    setCurrentPage(1)
    setShowFiltersModal(false)
  }

  const handleApplyFilters = (filters: FilterValues) => {
    const updatedFilters = {
      ...filters,
      date: filters.date || new Date().toISOString().split('T')[0],
    }

    if (!filters.patientName) {
      setSearchTerm('')
    }

    onFiltersChange(updatedFilters)
    setCurrentPage(1)
    setShowFiltersModal(false)
  }

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onFiltersChange({
        patientName: term,
        date: new Date().toISOString().split('T')[0],
      })
    }, 500),
    [onFiltersChange]
  )

  const formattedAppointments = appointments.map((appointment) => {
    const doctor = doctors.find((d) => d.id === appointment.doctorId)
    const [year, month, day] = appointment.date.split('-')
    const formattedDate = `${day}/${month}/${year}`

    return {
      id: appointment.id,
      patientName: appointment.personalData.fullName,
      date: formattedDate,
      time: appointment.time,
      status: appointment.status,
      doctor: doctor ? `${doctor.name}` : `Dr. ${appointment.doctorId}`,
      specialty: doctor?.specialty || 'Especialidade',
      phone: appointment.personalData.phone,
      originalData: appointment,
    }
  })

  const paginatedData = {
    currentItems: formattedAppointments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
    totalItems: formattedAppointments.length,
  }

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showFiltersModal,
    setShowFiltersModal,
    searchTerm,
    handleSearch,
    handleClearFilters,
    handleApplyFilters,
    paginatedData,
    formattedAppointments,
  }
}
