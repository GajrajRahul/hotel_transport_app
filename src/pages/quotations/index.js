import { Fragment, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import StepLabel from '@mui/material/StepLabel'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import addDays from 'date-fns/addDays'
import toast from 'react-hot-toast'
import axios from 'axios'
// import { useJsApiLoader } from '@react-google-maps/api'

import StepperWrapper from 'src/@core/styles/mui/stepper'

import { getDayNightCount } from 'src/utils/function'
import AmountDisplayDialog from 'src/components/quotation/dialog/AmountDisplayDialog'
import TravelInfoStep from 'src/components/quotation/quotation_steps/TravelInfoStep'
import HotelInfoStep from 'src/components/quotation/quotation_steps/HotelInfoStep'
import TransportInfoStep from 'src/components/quotation/quotation_steps/TransportInfoStep'
import StepperCustomDot from 'src/components/common/StepperCustomDot'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const steps = [
  {
    title: 'Travel Info',
    subtitle: 'Enter your Travel Details'
  },
  {
    title: 'Select Hotel',
    subtitle: 'Hotel Information'
  },
  {
    title: 'Select Transport',
    subtitle: 'Transport Details'
  }
]

let defaultHotelInfoValues = {
  checkInCheckOut: [new Date(), addDays(new Date(), 45)],
  breakfast: true,
  lunch: true,
  dinner: true,
  rooms: '',
  child: '0',
  daysNights: '45 Days & 44 Nights',
  extraBed: '',
  hotel: null,
  persons: '',
  adult: '0'
}

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const transformHotelData = data => {
  const headers = data[0]
  const result = {}

  const matchingColumnIndices = headers
    .map((header, index) => (header?.startsWith('room_type_') && header?.endsWith('_tag') ? index : -1))
    .filter(index => index !== -1)

  const filtered = data.slice(1).map(row => matchingColumnIndices.map(colIndex => row[colIndex] || ''))

  let roomsList = []
  filtered.map(data =>
    data.map(item => {
      if (item.length > 0 && !roomsList.includes(item)) roomsList.push(item)
    })
  )

  data.slice(1).forEach(row => {
    if (row.length > 0) {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))

      const cityKey = `${
        rowData.city
          ? rowData.city
              .split(' ')
              .map(c => c.toLowerCase())
              .join('_')
          : rowData.city
      }`

      const hotelTypeKey = `${rowData.type_of_hotel}`

      const hotelNameKey = `${rowData.hotel_name}`

      if (!result[cityKey]) result[cityKey] = {}
      if (!result[cityKey][hotelTypeKey]) result[cityKey][hotelTypeKey] = {}
      if (!result[cityKey][hotelTypeKey][hotelNameKey]) {
        result[cityKey][hotelTypeKey][hotelNameKey] = {}
      }

      result[cityKey][hotelTypeKey][hotelNameKey] = {
        ...result[cityKey][hotelTypeKey][hotelNameKey],
        breakfast: rowData.breakfast || '',
        lunch: rowData.lunch || '',
        dinner: rowData.dinner || '',
        extrabed: rowData.extrabed || '',
        [`${rowData.room_type_1_tag}`]: rowData.room_type_1 || '',
        [`${rowData.room_type_2_tag}`]: rowData.room_type_2 || '',
        [`${rowData.room_type_3_tag}`]: rowData.room_type_3 || '',
        [`${rowData.room_type_4_tag}`]: rowData.room_type_4 || '',
        minPrice: rowData.room_type_1
          ? rowData.room_type_1
          : rowData.room_type_2
          ? rowData.room_type_2
          : rowData.room_type_3
          ? rowData.room_type_3
          : rowData.room_type_4
          ? rowData.room_type_4
          : '',
        maxPrice: rowData.room_type_4
          ? rowData.room_type_4
          : rowData.room_type_3
          ? rowData.room_type_3
          : rowData.room_type_2
          ? rowData.room_type_2
          : rowData.room_type_1
          ? rowData.room_type_1
          : ''
      }
    }
  })

  return { roomsList, hotelsRate: result }
}

const transformTransportData = data => {
  const headers = data[0]
  const result = {}

  data.slice(1).forEach(row => {
    if (row.length > 0) {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))

      const carName = `${rowData.car_name}`

      if (!result[carName]) result[carName] = {}
      headers.map(item => {
        if (item != 'car_name') {
          result[carName] = { ...result[carName], [item]: rowData[item] }
        }
      })
    }
  })

  return result
}

const Quotations = ({ hotel_response, rooms_list, transport_response }) => {
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState(null)
  const [quotationNameError, setQuotationNameError] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //   // libraries: ['places']
  // })

  const loaded = useRef(false)
  const router = useRouter()

  const {
    reset,
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { quotationName: localStorage.getItem('quotationName') ?? '' }
  })

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // const getHotelFare = () => {
  //   let hotelAmount = 0
  //   cities.map(city => {
  //     const { label, info } = city
  //     info.map(currHotel => {
  //       const { breakfast, lunch, dinner, rooms, extraBed, hotel, checkInCheckOut } = currHotel
  //       const { type, name } = hotel
  //       const totalDayNight = Number(getDayNightCount(checkInCheckOut))
  //       const hotelInfo =
  //         hotelRate[
  //           label
  //             ? label
  //                 .split(' ')
  //                 .map(c => c.toLowerCase())
  //                 .join('_')
  //             : ''
  //         ][type][name]

  //       Object.keys(hotel).map(data => {
  //         if (roomsList.includes(data)) {
  //           hotelAmount += Number(hotel[data]) * Number(hotelInfo[data]) * totalDayNight
  //         }
  //       })

  //       if (breakfast) {
  //         hotelAmount += Number(hotelInfo['breakfast']) * (Number(adult) + Number(child)) * totalDayNight
  //       }
  //       if (lunch) {
  //         hotelAmount += Number(hotelInfo['lunch']) * (Number(adult) + Number(child)) * totalDayNight
  //       }
  //       if (dinner) {
  //         hotelAmount += Number(hotelInfo['dinner']) * (Number(adult) + Number(child)) * totalDayNight
  //       }
  //       if (extraBed) {
  //         hotelAmount += Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight
  //       }
  //     })
  //   })
  //   return hotelAmount
  // }

  // const getTransportFare = data => {
  //   const { totalDays, totalDistance, vehicleType, additionalStops } = data
  //   const vehicleRates = transportRate[vehicleType]

  //   if (cities.length == 1) {
  //     let totalAmount = Number(vehicleRates['city_local_fare'] * Number(totalDays))
  //     // console.log('totalAmount: ', totalAmount)
  //     if (additionalStops.length > 0) {
  //       const remainingAmount =
  //         totalDistance * Number(vehicleRates['amount_per_km']) +
  //         Number(vehicleRates['toll_charges_per_day']) +
  //         Number(vehicleRates['driver_charges_per_day']) +
  //         Number(vehicleRates['parking_charges_per_day']) +
  //         Number(vehicleRates['service_cleaning_charge_one_time'])
  //       // console.log('remainingAmount: ', remainingAmount)
  //       totalAmount += remainingAmount
  //     }
  //     return totalAmount
  //   } else {
  //     const distanceAmount =
  //       Number(totalDays) * Number(vehicleRates['minimum_km_charge']) * Number(vehicleRates['amount_per_km'])
  //     // console.log('distanceAmount: ', distanceAmount)

  //     const distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])
  //     // console.log('distanceAmount2: ', distanceAmount2)

  //     const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
  //     // console.log('tollAmount: ', tollAmount)
  //     const driverAmount = Number(vehicleRates['driver_charges_per_day']) * Number(totalDays)
  //     // console.log('driverAmount: ', driverAmount)
  //     const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
  //     // console.log('parkingCharges: ', parkingCharges)
  //     const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])
  //     // console.log('cleaningAmount: ', cleaningAmount)

  //     const totalAmount =
  //       (distanceAmount > distanceAmount2 ? distanceAmount : distanceAmount2) +
  //       Number(tollAmount) +
  //       Number(driverAmount) +
  //       Number(parkingCharges) +
  //       Number(cleaningAmount)

  //     return totalAmount
  //   }
  // }

  const onSubmit = data => {
    if (activeStep == 0) {
      const quotation_name = getValues('quotationName')
      if (quotation_name.length == 0) {
        setQuotationNameError('This field is required')
        return
      } else {
        localStorage.setItem('quotationName', quotation_name)
        setQuotationNameError('')
      }
    }
    if (activeStep != steps.length - 1) {
      // const dayNightCount = getDayNightCount(dates) + 1
      // defaultHotelInfoValues = {
      //   ...defaultHotelInfoValues,
      //   checkInCheckOut: dates,
      //   daysNights: `${dayNightCount} ${dayNightCount < 2 ? 'Day' : 'Days'} & ${dayNightCount - 1} ${
      //     dayNightCount < 3 ? 'Night' : 'Nights'
      //   }`
      // }
      // setTransportValue('depatureReturnDate', dates)
      setActiveStep(activeStep + 1)
    } else {
      localStorage.setItem('transport', JSON.stringify(data))
      // router.push('/quotations/preview')
      window.open("/quotations/preview", "_blank");
      return
      // const { from, to, additionalStops, departureReturnDate } = data
      // const date1 = new Date(departureReturnDate[0])
      // const date2 = new Date(departureReturnDate[1])

      // const diffInMs = date2 - date1

      // const totalDays = diffInMs / (1000 * 60 * 60 * 24)

      // const directionsService = new window.google.maps.DirectionsService()

      // let waypoints =
      //   additionalStops.length > 0
      //     ? additionalStops.map((item, index) => {
      //         return { location: item.description, stopover: true }
      //       })
      //     : []

      // let distanceObj = {
      //   origin: from.description,
      //   destination: to.description,
      //   travelMode: window.google.maps.TravelMode.DRIVING
      // }

      // if (to.description != from.description) {
      //   waypoints = [...waypoints, { location: to.description, stopover: true }]
      //   distanceObj = { ...distanceObj, destination: from.description }
      // }

      // directionsService.route(
      //   waypoints.length > 0
      //     ? {
      //         ...distanceObj,
      //         waypoints
      //       }
      //     : distanceObj,
      //   (result, status) => {
      //     if (status === window.google.maps.DirectionsStatus.OK) {
      //       const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
      //       const totalDistance = (totalDist / 1000).toFixed(2)
      //       const totalTransportAmount = 0
      //       // const totalTransportAmount = getTransportFare({
      //       //   ...data,
      //       //   totalDistance,
      //       //   totalDays: totalDays + 1,
      //       //   additionalStops
      //       // })
      //       // const totalHotelAmount = getHotelFare()
      //       setCalculatedAmount({
      //         transport: Number(totalTransportAmount)
      //         // hotel: Number(totalHotelAmount),
      //         // total: Number(totalTransportAmount) + Number(totalHotelAmount)
      //       })
      //       setIsAmountDialogOpen(true)
      //     } else {
      //       toast.error(`error fetching distance: ${result?.status}`)
      //     }
      //   }
      // )
    }

    // if (activeStep != steps.length - 1) {
    //   if (data.cities) {
    //     const isHotelEmpty = data.cities.find(c => c.info.length == 0)
    //     if (isHotelEmpty) {
    //       toast.error('Add atleast 1 Hotel in all selected cities')
    //       return
    //     }

    //     if (data.cities.length == 1) {
    //       const citySelected = data.cities[0].label
    //         ? data.cities[0].label
    //             .split('_')
    //             .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
    //             .join(' ')
    //         : ''
    //       setTransportValue('to', { description: citySelected })
    //       setTransportValue('from', { description: citySelected })
    //     }
    //   }
    //   setActiveStep(activeStep + 1)
    // } else {
    //   const { from, to, additionalStops, depatureReturnDate } = data
    //   const date1 = new Date(depatureReturnDate[0])
    //   const date2 = new Date(depatureReturnDate[1])

    //   const diffInMs = date2 - date1

    //   const totalDays = diffInMs / (1000 * 60 * 60 * 24)

    //   const directionsService = new window.google.maps.DirectionsService()

    //   let waypoints =
    //     additionalStops.length > 0
    //       ? additionalStops.map((item, index) => {
    //           return { location: item.description, stopover: true }
    //         })
    //       : []

    //   let distanceObj = {
    //     origin: from.description,
    //     destination: to.description,
    //     travelMode: window.google.maps.TravelMode.DRIVING
    //   }

    //   if (to.description != from.description) {
    //     waypoints = [...waypoints, { location: to.description, stopover: true }]
    //     distanceObj = { ...distanceObj, destination: from.description }
    //   }

    //   directionsService.route(
    //     waypoints.length > 0
    //       ? {
    //           ...distanceObj,
    //           waypoints
    //         }
    //       : distanceObj,
    //     (result, status) => {
    //       if (status === window.google.maps.DirectionsStatus.OK) {
    //         const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
    //         const totalDistance = (totalDist / 1000).toFixed(2)
    //         const totalTransportAmount = getTransportFare({
    //           ...data,
    //           totalDistance,
    //           totalDays: totalDays + 1,
    //           additionalStops
    //         })
    //         const totalHotelAmount = getHotelFare()
    //         setCalculatedAmount({
    //           transport: Number(totalTransportAmount),
    //           hotel: Number(totalHotelAmount),
    //           total: Number(totalTransportAmount) + Number(totalHotelAmount)
    //         })
    //         setIsAmountDialogOpen(true)
    //       } else {
    //         toast.error(`error fetching distance: ${result?.status}`)
    //       }
    //     }
    //   )
    // }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <TravelInfoStep onSubmit={onSubmit} />
      case 1:
        return (
          <HotelInfoStep
            hotelRate={hotel_response}
            roomsList={rooms_list}
            handleBack={handleBack}
            onSubmit={onSubmit}
          />
        )
      case 2:
        return <TransportInfoStep transportRate={transport_response} handleBack={handleBack} onSubmit={onSubmit} />
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained'>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      {activeStep == 0 && (
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ m: 7 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='stepper-linear-quotation-name'>Quotation Name</InputLabel>
              <Controller
                name='quotationName'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    value={value}
                    error={Boolean(quotationNameError)}
                    label='Quotation Name'
                    id='stepper-linear-quotation-name'
                    onChange={onChange}
                  />
                )}
              />
              {quotationNameError.length > 0 && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-persons'>
                  {quotationNameError}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      )}
      {activeStep == 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 5,
            pb: 3,
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant='h4'>Design Your Customized Travel Experience</Typography>
          <Divider sx={{ width: '100px' }} />
          <Typography>
            Craft a travel package uniquely tailored to your preferences. Specify destinations, activities, and
            accommodations to create an itinerary that aligns perfectly with your vision. Elevate your journey with a
            personalized touch, designed exclusively for you.
          </Typography>
        </Box>
      )}
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography sx={{ color: '#3A3541DE !important' }} className='step-number'>{`0${
                        index + 1
                      }`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent sx={{ height: '100%' }}>{renderContent()}</CardContent>
      <AmountDisplayDialog
        open={isAmountDialogOpen}
        handleClose={() => setIsAmountDialogOpen(false)}
        amounts={calculatedAmount}
      />
    </Card>
  )
}

export async function getServerSideProps() {
  const HOTEL_SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const HOTEL_URL = `https://sheets.googleapis.com/v4/spreadsheets/${HOTEL_SHEET_ID}/values/Sheet1?key=${API_KEY}`

  const TRANSPORT_SHEET_ID = process.env.NEXT_PUBLIC_TRANSPORT_SHEET_ID
  // const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const TRANSPORT_URL = `https://sheets.googleapis.com/v4/spreadsheets/${TRANSPORT_SHEET_ID}/values/Sheet1?key=${API_KEY}`

  let hotel_response = null
  let rooms_list = []
  let transport_response = null

  try {
    const response = await axios.get(HOTEL_URL)
    const finalData = transformHotelData(response.data.values ?? [])
    hotel_response = finalData.hotelsRate
    rooms_list = finalData.roomsList
    // setHotelData(finalData.hotelsRate)
    // setRoomsList(finalData.roomsList)
  } catch (error) {
    toast.error('Failed fetching transport data')
    console.error('Error fetching data:', error)
  }

  try {
    const response = await axios.get(TRANSPORT_URL)
    const finalData = transformTransportData(response.data.values ?? [])
    transport_response = finalData
    // setTransportRate(finalData)
  } catch (error) {
    toast.error('Failed fetching transport data')
    console.error('Error fetching data:', error)
  }

  return {
    props: {
      hotel_response,
      rooms_list,
      transport_response
    }
  }
}

export default Quotations
