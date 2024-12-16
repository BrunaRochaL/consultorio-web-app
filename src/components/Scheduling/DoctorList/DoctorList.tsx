import React from 'react'

import { capitalizeWords } from '@/utils/helpers'

import PatientListSkeleton from '../../Dashboard/PatientListSkeleton'
import ItemList from '../../common/ItemList/ItemList'
import ItemListRow from '../../common/ItemList/ItemListRow'

interface Doctor {
  id: number
  name: string
  avatar: string
  specialty: string
  available: boolean
}

interface DoctorListProps {
  doctors: Doctor[]
  isLoading: boolean
  maxHeight?: number | string
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  isLoading,
  maxHeight = 300,
}) => {
  return (
    <ItemList
      isLoading={isLoading}
      loadingComponent={<PatientListSkeleton count={5} />}
      emptyMessage="Nenhum médico disponível"
      maxHeight={maxHeight}
    >
      {doctors?.map((doctor) => (
        <ItemListRow
          key={doctor.id}
          avatar={doctor.avatar}
          title={capitalizeWords(doctor.name)}
          subtitle={doctor.specialty}
          status={doctor.available ? 'Disponível' : 'Indisponível'}
        />
      ))}
    </ItemList>
  )
}

export default DoctorList
