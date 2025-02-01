import { useLoadScript } from '@react-google-maps/api'
import { addDays } from 'date-fns'
import React from 'react'
import Loader from 'src/components/common/Loader'

import TaxiBooking from 'src/components/TaxiBooking'

const libraries = ['places']

const AddTaxiBooking = () => {
  const clientType = ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
    ? localStorage.getItem('clientType')
    : 'admin'

  const clientId = localStorage.getItem('clientId') || ''

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  })

  return (
    <div>
      <Loader open={!isLoaded} />
      {isLoaded && (
        <TaxiBooking
          isEdit={false}
          defaultValues={{
            vehicleType: '',
            departureReturnDate: [new Date(), addDays(new Date(), 45)],
            from: {
              place: '',
              city: '',
              state: '',
              country: ''
            },
            isLocal: false,
            additionalStops: [],
            to: {
              place: '',
              city: '',
              state: '',
              country: ''
            }
          }}
          clientType={clientType}
          clientId={clientId}
        />
      )}
    </div>
  )
}

export default AddTaxiBooking
