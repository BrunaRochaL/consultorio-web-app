import React from 'react'
import { Card, Placeholder } from 'react-bootstrap'

interface PlaceholderLineProps {
  width: number
  height?: number
  className?: string
}

interface PlaceholderCardProps {
  lines: PlaceholderLineProps[]
  className?: string
  fullHeight?: boolean
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  lines,
  className = '',
  fullHeight = false,
}) => {
  return (
    <Card
      className={className}
      style={fullHeight ? { height: '100%' } : undefined}
    >
      <Card.Body>
        <Placeholder animation="glow">
          {lines.map((line, index) => (
            <Placeholder
              key={index}
              xs={line.width}
              className={`${index !== lines.length - 1 ? 'mb-3' : ''} ${
                line.className || ''
              }`}
              style={{ height: line.height || '20px' }}
            />
          ))}
        </Placeholder>
      </Card.Body>
    </Card>
  )
}

export default PlaceholderCard
