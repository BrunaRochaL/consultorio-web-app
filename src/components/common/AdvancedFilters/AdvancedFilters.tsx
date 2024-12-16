import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import InputMask from 'react-input-mask'

interface AdvancedFiltersProps {
  show: boolean
  onHide: () => void
  onApplyFilters: (filters: FilterValues) => void
  doctors: Doctor[]
}

export interface FilterValues {
  date?: string
  time?: string
  doctorId?: string
  patientName?: string
  cpf?: string
  status?: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  show,
  onHide,
  onApplyFilters,
  doctors,
}) => {
  const [filters, setFilters] = useState<FilterValues>({})

  useEffect(() => {
    if (!show) {
      setFilters({})
    }
  }, [show])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedDate = filters.date
      ? formatDateToAPI(filters.date)
      : undefined
    const formattedFilters = {
      ...filters,
      date: formattedDate,
    }

    if (
      formattedDate ||
      filters.time ||
      filters.doctorId ||
      filters.patientName ||
      filters.cpf ||
      filters.status
    ) {
      onApplyFilters(formattedFilters)
      onHide()
    } else {
      handleClear()
    }
  }

  const handleClear = () => {
    setFilters({})

    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    onApplyFilters({
      date: `${year}-${month}-${day}`,
    })
    onHide()
  }

  const formatDateToAPI = (date: string) => {
    const cleanDate = date.replace(/[^0-9]/g, '')
    if (cleanDate.length !== 8) return undefined

    const day = cleanDate.substring(0, 2)
    const month = cleanDate.substring(2, 4)
    const year = cleanDate.substring(4, 8)

    const dateObj = new Date(Number(year), Number(month) - 1, Number(day))
    if (
      dateObj.getFullYear() !== Number(year) ||
      dateObj.getMonth() !== Number(month) - 1 ||
      dateObj.getDate() !== Number(day)
    ) {
      return undefined
    }

    return `${year}-${month}-${day}`
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Filtros Avançados</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.status || ''}
              onChange={(e) => {
                const newStatus =
                  (e.target.value as FilterValues['status']) || undefined
                console.log('Status selecionado:', newStatus)
                setFilters((prev) => ({
                  ...prev,
                  status: newStatus,
                }))
              }}
            >
              <option value="">Todos</option>
              <option value="AGENDADO">Agendado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="CONCLUIDO">Concluído</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <InputMask
              mask="99/99/9999"
              value={filters.date || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, date: e.target.value }))
              }
              placeholder="DD/MM/AAAA"
            >
              {(inputProps: { onChange: any; value: string }) => (
                <Form.Control {...inputProps} />
              )}
            </InputMask>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Horário (HH:MM)</Form.Label>
            <InputMask
              mask="99:99"
              maskPlaceholder="00:00"
              value={filters.time || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, time: e.target.value }))
              }
            >
              {(inputProps: { onChange: any; value: string }) => (
                <Form.Control {...inputProps} />
              )}
            </InputMask>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Médico</Form.Label>
            <Form.Select
              value={filters.doctorId || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, doctorId: e.target.value }))
              }
            >
              <option value="">Selecione um médico</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome do Paciente</Form.Label>
            <Form.Control
              type="text"
              value={filters.patientName || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, patientName: e.target.value }))
              }
              placeholder="Digite o nome do paciente"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CPF</Form.Label>
            <InputMask
              mask="999.999.999-99"
              value={filters.cpf || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, cpf: e.target.value }))
              }
            >
              {(inputProps: { onChange: any; value: string }) => (
                <Form.Control {...inputProps} placeholder="Digite o CPF" />
              )}
            </InputMask>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClear}>
            Limpar Filtros
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Aplicar Filtros
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AdvancedFilters
