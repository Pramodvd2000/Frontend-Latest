import { useRef, useState, useEffect } from 'react'
import Wizard from '@components/wizard'
import API_URL from '../../../../../config'

// ** Steps
import EditRateCodeDetails from './EditRateCodeDetails'
import EditRoomRates from './EditRoomRates'
import EditAccountMap from './EditAccountMap'
import EditExtrasMap from './EditExtrasMap'

const EditWizard = ({ rateCodeId, onComplete }) => {
  const [stepper, setStepper] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const wizardRef = useRef(null)

  useEffect(() => {
    const fetchRateCodeData = async () => {
      try {
        const response = await fetch(`${API_URL}/getRateCodeById?id=${rateCodeId}`)
        if (!response.ok) throw new Error('Failed to fetch rate code data')
        const result = await response.json()
        setInitialData(result.data)
      } catch (error) {
        console.error('Error fetching rate code data:', error)
      }
    }

    if (rateCodeId) {
      fetchRateCodeData()
    }
  }, [rateCodeId])

  const steps = [
    {
      id: 'rate-code-details',
      title: 'Rate Code Details',
      subtitle: 'Edit Rate Code Details',
      content: <EditRateCodeDetails 
        stepper={stepper} 
        rateCodeId={rateCodeId} 
        initialData={initialData}
        onComplete={onComplete}
      />
    },
    {
      id: 'room-rates',
      title: 'Edit Room Rates',
      subtitle: 'Modify Room Rates',
      content: <EditRoomRates 
        stepper={stepper} 
        rateCodeId={rateCodeId}
        initialData={initialData}
      />
    },
    {
      id: 'account-map',
      title: 'Map Account',
      subtitle: 'Modify Account/Company',
      content: <EditAccountMap 
        stepper={stepper} 
        rateCodeId={rateCodeId}
        initialData={initialData}
      />
    },
    {
      id: 'extras-map',
      title: 'Map Extras',
      subtitle: 'Modify Extras',
      content: <EditExtrasMap 
        stepper={stepper} 
        rateCodeId={rateCodeId}
        initialData={initialData}
      />
    }
  ]

  return (
    <div className="horizontal-wizard">
      <Wizard
        instance={setStepper}
        ref={wizardRef}
        steps={steps}
        options={{
          linear: false // Allow non-linear navigation between steps
        }}
      />
    </div>
  )
}

export default EditWizard