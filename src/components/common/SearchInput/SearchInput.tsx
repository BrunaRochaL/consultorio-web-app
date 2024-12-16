import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Busca',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <InputGroup className={`${styles.searchGroup} ${className}`}>
      <Form.Control
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <InputGroup.Text className={styles.searchIcon}>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
    </InputGroup>
  )
}

export default SearchInput
