import React from 'react'
import { Card } from 'react-bootstrap'

import Calendar from '../../Calendar/Calendar'

interface CalendarSectionProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
      </Card.Body>
    </Card>
  )
}

export default CalendarSection
