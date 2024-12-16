import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'

import { formatDate, formatTime, isToday } from '@/utils/helpers'

import styles from './Calendar.module.css'

interface CalendarProps {
  onDateSelect: (date: Date) => void
  selectedDate: Date
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate))

  useEffect(() => {
    setCurrentDate(new Date(selectedDate))
  }, [selectedDate])

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: Date) => {
    onDateSelect(date)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getPrevMonthDays = (date: Date) => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0)
    return getDaysInMonth(prevMonth)
  }

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const prevMonthDays = getPrevMonthDays(currentDate)
    const days: JSX.Element[] = []

    // Dias do mês anterior
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = prevMonthDays - firstDayOfMonth + i + 1
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        day
      )
      days.push(
        <td
          key={`prev-${i}`}
          className={`${styles.calendarDay} ${styles.otherMonth}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </td>
      )
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      )
      const isToday =
        date.toDateString() === new Date().toDateString() ? styles.today : ''
      const isSelected =
        date.toDateString() === selectedDate.toDateString()
          ? styles.selected
          : ''

      days.push(
        <td
          key={day}
          className={`${styles.calendarDay} ${isToday} ${isSelected}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </td>
      )
    }

    // Dias do próximo mês
    const totalDays = days.length
    const remainingDays = 42 - totalDays // 6 semanas x 7 dias
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      )
      days.push(
        <td
          key={`next-${i}`}
          className={`${styles.calendarDay} ${styles.otherMonth}`}
          onClick={() => handleDateClick(date)}
        >
          {i}
        </td>
      )
    }

    const weeks: JSX.Element[] = []
    let week: JSX.Element[] = []

    days.forEach((day, index) => {
      week.push(day)
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        if (week.length < 7) {
          const remainingCells = 7 - week.length
          for (let i = 0; i < remainingCells; i++) {
            week.push(<td key={`empty-end-${i}`}></td>)
          }
        }
        weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>)
        week = []
      }
    })

    return weeks
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <Button variant="link" onClick={handlePrevMonth}>
          <i className="bi bi-chevron-left"></i>
        </Button>
        <h5 className="mb-0">
          {months[currentDate.getMonth()].toString().toUpperCase()}
        </h5>
        <Button variant="link" onClick={handleNextMonth}>
          <i className="bi bi-chevron-right"></i>
        </Button>
      </div>

      <Table bordered className={styles.calendar}>
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendarDays()}</tbody>
      </Table>
    </div>
  )
}

export default Calendar
