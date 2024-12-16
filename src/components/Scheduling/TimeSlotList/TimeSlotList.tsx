import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'

import timeSlotStyles from './TimeSlotList.module.css'
import {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '@/services/api/appointments'

import PatientListSkeleton from '../../Dashboard/PatientListSkeleton'
import ItemList from '../../common/ItemList/ItemList'
import ItemListRow from '../../common/ItemList/ItemListRow'
import AppointmentModal, {
  AppointmentFormData,
} from '../AppointmentModal/AppointmentModal'

interface TimeSlot {
  id: number
  time: string
  available: boolean
  patient?: {
    id: number
    name: string
    phone?: string
  }
}

interface TimeSlotListProps {
  slots: TimeSlot[]
  isLoading: boolean
  maxHeight?: number | string
  selectedDate: Date
  selectedDoctor?: {
    id: number
    name: string
    specialty: string
  } | null
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  slots,
  isLoading,
  maxHeight = 500,
  selectedDate,
  selectedDoctor,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<
    (AppointmentFormData & { id?: string }) | null
  >(null)
  const [appointmentToTransfer, setAppointmentToTransfer] = useState<
    (AppointmentFormData & { id: string }) | null
  >(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState<
    (AppointmentFormData & { id: string }) | null
  >(null)
  const [createAppointment] = useCreateAppointmentMutation()
  const [updateAppointment] = useUpdateAppointmentMutation()
  const [deleteAppointment] = useDeleteAppointmentMutation()

  console.log('Debug valores:', {
    selectedDoctor,
    selectedDate: selectedDate.toISOString().split('T')[0],
    doctorId: selectedDoctor?.id,
    hasDoctor: !!selectedDoctor,
  })

  const { data: appointments } = useGetAppointmentsQuery(
    {
      date: selectedDate.toISOString().split('T')[0],
      doctorId: selectedDoctor ? selectedDoctor.id : undefined,
    },
    {
      skip: !selectedDoctor?.id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  )

  console.log('Resultado da query:', {
    appointments,
    queryParams: {
      date: selectedDate.toISOString().split('T')[0],
      doctorId: selectedDoctor?.id,
    },
  })

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot)
      setAppointmentToEdit(null)
      setShowModal(true)
    }
  }

  const handleEditAppointment = (slot: TimeSlot) => {
    if (!appointments) return

    const appointment = appointments.find(
      (app) =>
        app.time === slot.time &&
        app.doctorId === selectedDoctor?.id &&
        app.status === 'AGENDADO'
    )

    if (appointment) {
      setSelectedSlot(slot)
      setAppointmentToEdit(appointment)
      setShowModal(true)
    }
  }

  const handleTransferAppointment = (slot: TimeSlot) => {
    if (!appointments) return

    const appointment = appointments.find(
      (app) =>
        app.time === slot.time &&
        app.doctorId === selectedDoctor?.id &&
        app.status === 'AGENDADO'
    )

    if (appointment && appointment.id) {
      setAppointmentToTransfer({
        ...appointment,
        id: appointment.id,
      })
      setShowTransferModal(true)
    }
  }

  const handleTransferConfirm = async (newSlot: TimeSlot) => {
    if (!appointmentToTransfer || !selectedDoctor) return

    try {
      const result = await updateAppointment({
        id: appointmentToTransfer.id,
        ...appointmentToTransfer,
        timeSlotId: newSlot.id,
        time: newSlot.time,
        doctorId: selectedDoctor.id,
        date: selectedDate.toISOString().split('T')[0],
      }).unwrap()

      if (result) {
        toast.success('Consulta transferida com sucesso!')
        setShowTransferModal(false)
        setAppointmentToTransfer(null)
      }
    } catch (error) {
      console.error('Erro ao transferir consulta:', error)
      toast.error('Erro ao transferir consulta. Tente novamente.')
    }
  }

  const handleDeleteAppointment = (slot: TimeSlot) => {
    if (!appointments) return

    const appointment = appointments.find(
      (app) =>
        app.time === slot.time &&
        app.doctorId === selectedDoctor?.id &&
        app.status === 'AGENDADO'
    )

    if (appointment && appointment.id) {
      setAppointmentToDelete({
        ...appointment,
        id: appointment.id,
      })
      setShowDeleteModal(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return

    try {
      await deleteAppointment(appointmentToDelete.id).unwrap()
      toast.success('Consulta cancelada com sucesso!')
      setShowDeleteModal(false)
      setAppointmentToDelete(null)
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error)
      toast.error('Erro ao cancelar consulta. Tente novamente.')
    }
  }

  const handleAppointmentSubmit = async (data: AppointmentFormData) => {
    if (!selectedDoctor || !selectedSlot) {
      toast.error('Selecione um médico e um horário para agendar.')
      return
    }

    try {
      const appointmentData = {
        ...data,
        timeSlotId: selectedSlot.id,
        doctorId: selectedDoctor.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedSlot.time,
      }

      let result
      if (appointmentToEdit?.id) {
        result = await updateAppointment({
          id: appointmentToEdit.id,
          ...appointmentData,
        }).unwrap()
      } else {
        result = await createAppointment(appointmentData).unwrap()
      }

      if (result) {
        toast.success(
          appointmentToEdit
            ? 'Consulta atualizada com sucesso!'
            : 'Consulta agendada com sucesso!'
        )
        setShowModal(false)
        setSelectedSlot(null)
        setAppointmentToEdit(null)
      }
    } catch (error) {
      console.error('Erro ao agendar consulta:', error)
      toast.error(
        appointmentToEdit
          ? 'Erro ao atualizar consulta. Tente novamente.'
          : 'Erro ao agendar consulta. Tente novamente.'
      )
    }
  }

  const availableSlots = slots.filter((slot) => slot.available)

  return (
    <>
      <ItemList
        isLoading={isLoading}
        loadingComponent={<PatientListSkeleton count={8} />}
        emptyMessage={
          !selectedDoctor
            ? 'Selecione um médico para ver os horários disponíveis'
            : 'Nenhum horário disponível para esta data'
        }
        maxHeight={700}
      >
        {slots.map((slot) => (
          <ItemListRow
            key={slot.id}
            title={slot.time}
            subtitle={slot.patient?.name}
            status={slot.available ? 'Disponível' : 'Ocupado'}
            onClick={() => handleSlotClick(slot)}
            clickable={slot.available}
            actions={
              !slot.available ? (
                <div className={timeSlotStyles.actionIcons}>
                  <i
                    className="bi bi-pencil-square"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAppointment(slot)
                    }}
                  />
                  <i
                    className="bi bi-arrow-left-right"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTransferAppointment(slot)
                    }}
                  />
                  <i
                    className="bi bi-trash"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAppointment(slot)
                    }}
                  />
                </div>
              ) : undefined
            }
            endIcon={
              slot.available ? <i className="bi bi-plus-lg"></i> : undefined
            }
            className={timeSlotStyles.timeSlot}
          />
        ))}
      </ItemList>

      <AppointmentModal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setAppointmentToEdit(null)
        }}
        onSubmit={handleAppointmentSubmit}
        appointment={appointmentToEdit || undefined}
      />

      <Modal
        show={showTransferModal}
        onHide={() => {
          setShowTransferModal(false)
          setAppointmentToTransfer(null)
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transferir Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecione o novo horário para a consulta:</p>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {!selectedDoctor ? (
              <p className="text-center text-muted">
                Selecione um médico para ver os horários disponíveis
              </p>
            ) : availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => handleTransferConfirm(slot)}
                >
                  {slot.time}
                </Button>
              ))
            ) : (
              <p className="text-center text-muted">
                Nenhum horário disponível para transferência nesta data.
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowTransferModal(false)
              setAppointmentToTransfer(null)
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setAppointmentToDelete(null)
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja cancelar esta consulta?</p>
          {appointmentToDelete && (
            <div>
              <p>
                <strong>Paciente:</strong>{' '}
                {appointmentToDelete.personalData.fullName}
              </p>
              <p>
                <strong>Data:</strong> {appointmentToDelete.date}
              </p>
              <p>
                <strong>Horário:</strong> {appointmentToDelete.time}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setAppointmentToDelete(null)
            }}
          >
            Não
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Sim, cancelar consulta
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TimeSlotList
