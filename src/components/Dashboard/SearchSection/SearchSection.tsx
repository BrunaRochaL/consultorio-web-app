import React from 'react'
import { Col, Row } from 'react-bootstrap'

import SearchInput from '../../common/SearchInput/SearchInput'

interface SearchSectionProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchSection: React.FC<SearchSectionProps> = ({
  value,
  onChange,
  placeholder = 'Busca',
}) => {
  return (
    <Row className="mb-4">
      <Col xs={12}>
        <SearchInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </Col>
    </Row>
  )
}

export default SearchSection
