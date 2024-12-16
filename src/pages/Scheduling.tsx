import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import { useGetDoctorsQuery } from '@/services/api'

import CalendarSection from '../components/Dashboard/CalendarSection/CalendarSection'
import DoctorList from '../components/Scheduling/DoctorList/DoctorList'

const Scheduling: React.FC = () => {
  const { data: doctors, isLoading } = useGetDoctorsQuery()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <h2>Médicos Disponíveis</h2>
          <DoctorList doctors={doctors || []} isLoading={isLoading} />
          <div className="mt-4">
            <CalendarSection
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Scheduling
