import debounce from 'lodash/debounce'
import React, { useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'

import { FilterValues } from '@/components/common/AdvancedFilters/AdvancedFilters'
import AdvancedFilters from '@/components/common/AdvancedFilters/AdvancedFilters'
import SearchInput from '@/components/common/SearchInput/SearchInput'
import Table from '@/components/common/Table/Table'

import styles from './AppointmentsTable.module.css'
import { Doctor } from '@/types/doctor'

interface AppointmentTableData {
  id: string
  patientName: string
  date: string
  time: string
  status: string
  doctor: string
  specialty: string
  phone: string
  originalData: AppointmentData
}

interface AppointmentData {
  id: string
  date: string
  time: string
  status: string
  doctorId: number
  personalData: {
    fullName: string
    phone: string
  }
}

interface AppointmentsTableProps {
  appointments: AppointmentData[]
  doctors: Doctor[]
  isLoading: boolean
  onEdit: (appointment: AppointmentData) => void
  onFiltersChange: (filters: FilterValues) => void
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  doctors,
  isLoading,
  onEdit,
  onFiltersChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    debouncedSearch(value)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
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
      setDebouncedSearchTerm('')
    }

    onFiltersChange(updatedFilters)
    setCurrentPage(1)
    setShowFiltersModal(false)
  }

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term)
      onFiltersChange((prevFilters) => ({
        ...prevFilters,
        patientName: term,
      }))
    }, 500),
    [onFiltersChange]
  )

  const formattedAppointments: AppointmentTableData[] = appointments.map(
    (appointment) => {
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
    }
  )

  const columns = [
    { key: 'patientName', label: 'Paciente', width: '20%' },
    { key: 'date', label: 'Data', width: '12%' },
    { key: 'time', label: 'Horário', width: '10%' },
    { key: 'doctor', label: 'Médico', width: '15%' },
    { key: 'specialty', label: 'Especialidade', width: '13%' },
    { key: 'phone', label: 'Telefone', width: '13%' },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value: string) => {
        const statusColors = {
          AGENDADO: 'text-primary',
          CANCELADO: 'text-danger',
          CONCLUIDO: 'text-success',
        }
        return (
          <span className={statusColors[value as keyof typeof statusColors]}>
            {value}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '7%',
      render: (_: string, row: AppointmentTableData) => (
        <div className="d-flex justify-content-center gap-2">
          <i
            className="bi bi-pencil-square text-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => onEdit(row.originalData)}
          />
        </div>
      ),
    },
  ]

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = formattedAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  return (
    <>
      <div className={`d-flex gap-3 mb-4 ${styles.searchContainer}`}>
        <div className="flex-grow-1">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Busca rápida por nome do paciente"
          />
        </div>
        <Button
          variant="outline-primary"
          onClick={() => setShowFiltersModal(true)}
          className="d-flex align-items-center"
        >
          <i className="bi bi-funnel me-2"></i>
          Filtros Avançados
        </Button>
      </div>

      <Table
        columns={columns}
        data={currentItems}
        isLoading={isLoading}
        totalItems={formattedAppointments.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <AdvancedFilters
        show={showFiltersModal}
        onHide={() => setShowFiltersModal(false)}
        onApplyFilters={handleApplyFilters}
        doctors={doctors}
      />
    </>
  )
}

export default AppointmentsTable
