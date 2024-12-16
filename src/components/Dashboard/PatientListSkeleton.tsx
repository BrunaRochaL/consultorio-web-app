import React from 'react'
import { Placeholder } from 'react-bootstrap'

import styles from './PatientListSkeleton.module.css'

interface PatientListSkeletonProps {
  count?: number
}

const PatientListSkeleton: React.FC<PatientListSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${styles.patientItem}`}>
          <div className={styles.patientAvatar}>
            <Placeholder animation="glow">
              <Placeholder xs={12} className={styles.patientAvatar} />
            </Placeholder>
          </div>
          <div className="d-flex mt-2">
            <div
              className={`${styles.patientInfo} ${styles.patientInfoContainer}`}
            >
              <Placeholder animation="glow">
                <Placeholder xs={4} style={{ marginBottom: '4px' }} /> <br />
                <Placeholder xs={3} style={{ fontSize: '0.9em' }} />
              </Placeholder>
            </div>
            <div className={styles.statusContainer}>
              <Placeholder animation="glow">
                <Placeholder xs={3} className={styles.statusPlaceholder} />
              </Placeholder>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default PatientListSkeleton
