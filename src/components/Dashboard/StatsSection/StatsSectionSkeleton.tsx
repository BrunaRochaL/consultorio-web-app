import React from 'react'
import { Col, Row } from 'react-bootstrap'

import PlaceholderCard from '@/components/common/PlaceholderCard/PlaceholderCard'

const StatsSectionSkeleton: React.FC = () => {
  return (
    <Row>
      <Col xs={12} md={8} className="mb-4">
        <PlaceholderCard
          fullHeight
          lines={[{ width: 8 }, { width: 12, height: 24 }, { width: 10 }]}
        />
      </Col>
      <Col xs={12} md={4}>
        <Row>
          <Col xs={12} className="mb-4">
            <PlaceholderCard lines={[{ width: 6 }, { width: 8 }]} />
          </Col>
          <Col xs={12}>
            <PlaceholderCard lines={[{ width: 6 }, { width: 8 }]} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default StatsSectionSkeleton
