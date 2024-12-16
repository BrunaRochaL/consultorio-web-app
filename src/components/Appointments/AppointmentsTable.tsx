import React from 'react'
import { Button } from 'react-bootstrap'

import { FilterValues } from '@/components/common/AdvancedFilters/AdvancedFilters'
import AdvancedFilters from '@/components/common/AdvancedFilters/AdvancedFilters'
import SearchInput from '@/components/common/SearchInput/SearchInput'
import Table from '@/components/common/Table/Table'

import { useAppointmentsTable } from '@/hooks/useAppointmentsTable'

import styles from './AppointmentsTable.module.css'

export interface Doctor {
  id: number
  name: string
  specialty: string
}

export interface AppointmentData {
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

export interface AppointmentTableData {
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
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showFiltersModal,
    setShowFiltersModal,
    searchTerm,
    handleSearch,
    handleApplyFilters,
    paginatedData,
  } = useAppointmentsTable({
    onFiltersChange,
    doctors,
    appointments,
  })

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
        data={paginatedData.currentItems}
        isLoading={isLoading}
        totalItems={paginatedData.totalItems}
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
