import { useLoadScript } from '@react-google-maps/api'
import { addDays } from 'date-fns'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { postRequest } from 'src/api-main-file/APIServices'
import Loader from 'src/components/common/Loader'

import TaxiBooking from 'src/components/TaxiBooking'

const getFormatedTaxiData = responseData => {
  const {
    _id,
    tripDate,
    pickup,
    drop,
    tripDays,
    route,
    vehicleType,
    amount,
    distance,
    killoFare,
    userName,
    isLocal,
    companyName,
  } = responseData

  const additionalStops = []
  route.map((info, index) => {
    if (index != 0 && index != route.length - 1) {
      const { place, city, state } = info
      additionalStops.push({ place, city, state })
    }
  })

  return {
    _id,
    vehicleType,
    departureReturnDate: [new Date(tripDate), addDays(new Date(tripDate), Number(tripDays))],
    from: pickup,
    isLocal,
    additionalStops,
    to: drop,
    tripDate,
    tripDays,
    route,
    amount,
    distance,
    killoFare,
    userName,
    companyName,
  }
}

const libraries = ['places']

const EditTaxiBooking = () => {
  const [taxiData, setTaxiData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const router = useRouter()

  useEffect(() => {
    fetchTaxidata()
  }, [])

  const fetchTaxidata = async () => {
    const filter = router.query.filter
    // console.log("filter is: ", router.query.filter)
    if (filter) {
      const { _id, adminId, partnerId } = JSON.parse(filter)
      setIsLoading(true)

      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
      // const BASE_URL = 'http://localhost:4000/api'
      const api_url = `${BASE_URL}/${adminId ? 'admin' : 'partner'}`

      const response = await postRequest(`${api_url}/fetch-taxi`, {
        id: _id,
        [adminId ? 'adminId' : 'partnerId']: adminId ? adminId : partnerId
      })
      setIsLoading(false)

      if (response.status) {
        const values = getFormatedTaxiData(response.data)
        setTaxiData({
          values: {
            vehicleType: values.vehicleType,
            departureReturnDate: [
              new Date(values.tripDate),
              addDays(new Date(values.tripDate), Number(values.tripDays))
            ],
            from: values.from,
            isLocal: values.isLocal,
            additionalStops: values.additionalStops,
            to: values.to
          },
          clientType: adminId ? 'admin' : 'partner',
          clientId: adminId ? adminId : partnerId,
          previewTaxi: {
            pickup: values.from,
            drop: values.to,
            days: Number(values.tripDays),
            returnDate: values.departureReturnDate[1],
            isLocal: values.isLocal,
            stops: values.route,
            vehicleType: values.vehicleType,
            distance: values.distance,
            amount: values.amount,
            killoFare: values.killoFare,
            tripDate: values.tripDate,
            userName: values.userName,
            id: _id
          }
        })
      } else {
        toast.error(response.error)
      }
    } else {
      router.push('/')
    }
  }

  return (
    <div>
      <Loader open={!isLoaded || isLoading} />
      {taxiData && (
        <TaxiBooking
          isEdit={true}
          defaultValues={taxiData.values}
          clientType={taxiData.clientType}
          clientId={taxiData.clientId}
          propPreviewTaxi={taxiData.previewTaxi}
        />
      )}
    </div>
  )
}

export default EditTaxiBooking
