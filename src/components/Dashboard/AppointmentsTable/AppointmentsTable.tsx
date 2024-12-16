import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'

import styles from '../../../styles/Typography.module.css'
import Table from '../../common/Table/Table'

interface Reminder {
  id: number
  title: string
  name: string
  type: 'paciente' | 'médico' | 'hospital'
  date: string
  description: string
}

interface AppointmentsTableProps {
  data: Reminder[]
  isLoading: boolean
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  data,
  isLoading,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  )
  const [reminderToDelete, setReminderToDelete] = useState<number | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>(data)

  React.useEffect(() => {
    setReminders(data)
  }, [data])

  const handleView = (reminder: Reminder) => {
    setSelectedReminder(reminder)
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setReminderToDelete(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    try {
      if (reminderToDelete) {
        setReminders((prevReminders) =>
          prevReminders.filter((reminder) => reminder.id !== reminderToDelete)
        )
        toast.success('Aviso excluído com sucesso!')
      }
      setShowDeleteModal(false)
      setReminderToDelete(null)
    } catch (error) {
      console.error('Erro ao excluir aviso:', error)
      toast.error('Erro ao excluir aviso. Tente novamente.')
    }
  }

  const columns = [
    {
      key: 'date',
      label: 'Data',
      width: '100px',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'title',
      label: 'Título',
    },
    {
      key: 'name',
      label: 'Nome',
      width: '200px',
    },
    {
      key: 'type',
      label: 'Tipo',
      width: '100px',
      render: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '100px',
      render: (_: unknown, row: Reminder) => (
        <div className="d-flex justify-content-around">
          <Button size="sm" variant="primary" onClick={() => handleView(row)}>
            <i className="bi bi-eye"></i>
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteClick(row.id)}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-4">
      <h5 className={`${styles.sectionTitle}`}>Avisos/Lembretes</h5>
      <Table
        columns={columns}
        data={reminders}
        height={400}
        isLoading={isLoading}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedReminder?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Nome:</strong> {selectedReminder?.name}
          </p>
          <p>
            <strong>Tipo:</strong>{' '}
            {selectedReminder?.type.charAt(0).toUpperCase() +
              selectedReminder?.type.slice(1)}
          </p>
          <p>
            <strong>Data:</strong>{' '}
            {selectedReminder?.date &&
              new Date(selectedReminder.date).toLocaleDateString('pt-BR')}
          </p>
          <p>
            <strong>Descrição:</strong>
          </p>
          <p>{selectedReminder?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este aviso?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
