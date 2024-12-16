import React from 'react'

import { capitalizeWords } from '@/utils/helpers'

import ItemList from '../../common/ItemList/ItemList'
import ItemListRow from '../../common/ItemList/ItemListRow'
import PatientListSkeleton from '../PatientListSkeleton'

interface Patient {
  id: number
  name: string
  avatar: string
  appointmentTime: string
  isCompleted: boolean
  phone?: string
  lastVisit?: string
}

interface PatientsListProps {
  patients: Patient[]
  isLoading: boolean
}

const PatientsList: React.FC<PatientsListProps> = ({ patients, isLoading }) => {
  return (
    <ItemList
      isLoading={isLoading}
      loadingComponent={<PatientListSkeleton count={5} />}
      emptyMessage="Nenhum paciente agendado para hoje"
    >
      {patients?.map((patient) => (
        <ItemListRow
          key={patient.id}
          avatar={patient.avatar}
          title={capitalizeWords(patient.name)}
          subtitle={patient.appointmentTime}
          status={patient.isCompleted ? 'Atendido' : 'Aguardando'}
        />
      ))}
    </ItemList>
  )
}

export default PatientsList
