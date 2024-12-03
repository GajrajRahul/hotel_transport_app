import { Fragment, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

import { useForm } from 'react-hook-form'
import addDays from 'date-fns/addDays'
import toast from 'react-hot-toast'
// import { useJsApiLoader } from '@react-google-maps/api'

import StepperCustomDot from '../common/StepperCustomDot'

import StepperWrapper from 'src/@core/styles/mui/stepper'
import AmountDisplayDialog from './dialog/AmountDisplayDialog'
import TravelInfoStep from './quotation_steps/TravelInfoStep'
import HotelInfoStep from './quotation_steps/HotelInfoStep'
import TransportInfoStep from './quotation_steps/TransportInfoStep'
import { getDayNightCount } from 'src/utils/function'

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

const defaultTravelValues = {
  name: '',
  dates: [new Date(), addDays(new Date(), 45)],
  'days-nights': '45 Days & 44 Nights'
}

const defaultHotelValues = {
  cities: []
}

let defaultHotelInfoValues = {
  checkInCheckOut: [new Date(), addDays(new Date(), 45)],
  breakfast: true,
  lunch: true,
  dinner: true,
  rooms: '',
  child: '',
  daysNights: '45 Days & 44 Nights',
  extraBed: '',
  hotel: null
}

const defaultTransportValues = {
  vehicleType: '',
  depatureReturnDate: [new Date(), addDays(new Date(), 45)],
  from: null,
  additionalStops: [],
  to: null
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

const QuotationSteps = ({ hotelRate, transportRate, roomsList }) => {
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //   // libraries: ['places']
  // })

  const loaded = useRef(false)

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

  const {
    reset: travelReset,
    setValue: setTravelValue,
    getValues: getTravelValues,
    watch: travelWatch,
    control: travelControl,
    handleSubmit: handleTravelSubmit,
    formState: { errors: travelErrors }
  } = useForm({
    defaultValues: defaultTravelValues
  })

  const {
    reset: hotelReset,
    watch: hotelWatch,
    setValue: setHotelValue,
    getValues: getHotelValues,
    control: hotelControl,
    handleSubmit: handleHotelSubmit,
    formState: { errors: hotelErrors }
  } = useForm({
    defaultValues: defaultHotelValues
  })

  const {
    reset: transportReset,
    setValue: setTransportValue,
    getValues: getTransportValues,
    control: transportControl,
    handleSubmit: handleTransportSubmit,
    formState: { errors: transportErrors }
  } = useForm({
    defaultValues: defaultTransportValues
  })

  const travelDates = travelWatch('dates')
  const cities = hotelWatch('cities')

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    transportReset({
      vehicleType: '',
      depatureReturnDate: [new Date(), addDays(new Date(), 45)],
      from: '',
      additionalStops: [],
      to: ''
    })
    travelReset({
      name: '',
      dates: [new Date(), addDays(new Date(), 45)],
      'days-nights': '45 Days & 44 Nights'
    })
    hotelReset({ cities: [] })
  }

  const onSubmit = data => {
    if (activeStep == 0) {
      const { dates } = data
      const dayNightCount = getDayNightCount(dates) + 1
      defaultHotelInfoValues = {
        ...defaultHotelInfoValues,
        checkInCheckOut: dates,
        daysNights: `${dayNightCount} ${dayNightCount < 2 ? 'Day' : 'Days'} & ${dayNightCount - 1} ${
          dayNightCount < 3 ? 'Night' : 'Nights'
        }`
      }
      setTransportValue('depatureReturnDate', dates)
    }

    if (activeStep != steps.length - 1) {
      if (data.cities) {
        const isHotelEmpty = data.cities.find(c => c.info.length == 0)
        if (isHotelEmpty) {
          toast.error('Add atleast 1 Hotel in all selected cities')
          return
        }

        if (data.cities.length == 1) {
          const citySelected = data.cities[0].label
            ? data.cities[0].label
                .split('_')
                .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                .join(' ')
            : ''
          setTransportValue('to', { description: citySelected })
          setTransportValue('from', { description: citySelected })
        }
      }
      setActiveStep(activeStep + 1)
    } else {
      const { from, to, additionalStops, depatureReturnDate } = data
      const date1 = new Date(depatureReturnDate[0])
      const date2 = new Date(depatureReturnDate[1])

      const diffInMs = date2 - date1

      const totalDays = diffInMs / (1000 * 60 * 60 * 24)

      const directionsService = new window.google.maps.DirectionsService()

      let waypoints =
        additionalStops.length > 0
          ? additionalStops.map((item, index) => {
              return { location: item.description, stopover: true }
            })
          : []

      let distanceObj = {
        origin: from.description,
        destination: to.description,
        travelMode: window.google.maps.TravelMode.DRIVING
      }

      if (to.description != from.description) {
        waypoints = [...waypoints, { location: to.description, stopover: true }]
        distanceObj = { ...distanceObj, destination: from.description }
      }

      directionsService.route(
        waypoints.length > 0
          ? {
              ...distanceObj,
              waypoints
            }
          : distanceObj,
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
            const totalDistance = (totalDist / 1000).toFixed(2)
            const totalTransportAmount = getTransportFare({
              ...data,
              totalDistance,
              totalDays: totalDays + 1,
              additionalStops
            })
            const totalHotelAmount = getHotelFare()
            setCalculatedAmount({
              transport: Number(totalTransportAmount),
              hotel: Number(totalHotelAmount),
              total: Number(totalTransportAmount) + Number(totalHotelAmount)
            })
            setIsAmountDialogOpen(true)
          } else {
            toast.error(`error fetching distance: ${result?.status}`)
          }
        }
      )
    }
  }

  const getHotelFare = () => {
    let hotelAmount = 0
    cities.map(city => {
      const { label, info } = city
      info.map(currHotel => {
        const { breakfast, lunch, dinner, rooms, child, extraBed, hotel, checkInCheckOut } = currHotel
        const { type, name } = hotel
        const totalDayNight = Number(getDayNightCount(checkInCheckOut))
        const hotelInfo =
          hotelRate[
            label
              ? label
                  .split(' ')
                  .map(c => c.toLowerCase())
                  .join('_')
              : ''
          ][type][name]

        Object.keys(hotel).map(data => {
          if (roomsList.includes(data)) {
            hotelAmount += Number(hotel[data]) * Number(hotelInfo[data]) * totalDayNight
            // console.log(hotelAmount);
          }
        })

        let totalPersons = 0;
        if (extraBed) {
          hotelAmount += Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight
          totalPersons += Number(extraBed);
        }
  
        if (breakfast) {
          // hotelAmount += Number(hotelInfo['breakfast']) * (Number(adult) + Number(child)) * totalDayNight
          hotelAmount += Number(hotelInfo['breakfast']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight
          // console.log("breakfast: ", Number(hotelInfo['breakfast']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight);
        }
        if (lunch) {
          // hotelAmount += Number(hotelInfo['lunch']) * (Number(adult) + Number(child)) * totalDayNight
          hotelAmount += Number(hotelInfo['lunch']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight
          // console.log("lunch: ", Number(hotelInfo['lunch']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight);
        }
        if (dinner) {
          // hotelAmount += Number(hotelInfo['dinner']) * (Number(adult) + Number(child)) * totalDayNight
          hotelAmount += Number(hotelInfo['dinner']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight
          // console.log("dinner: ", Number(hotelInfo['dinner']) * (Number(rooms)*2 + Number(child) + totalPersons) * totalDayNight);
        }
      })
    })
    return hotelAmount
  }

  const getTransportFare = data => {
    const { totalDays, totalDistance, vehicleType, additionalStops } = data
    const vehicleRates = transportRate[vehicleType]

    if (cities.length == 1) {
      let totalAmount = Number(vehicleRates['city_local_fare'] * Number(totalDays))
      if (additionalStops.length > 0) {
        const remainingAmount =
          totalDistance * Number(vehicleRates['amount_per_km']) +
          Number(vehicleRates['toll_charges_per_day']) +
          Number(vehicleRates['driver_charges_per_day']) +
          Number(vehicleRates['parking_charges_per_day']) +
          Number(vehicleRates['service_cleaning_charge_one_time'])
        totalAmount += remainingAmount
      }
      return totalAmount
    } else {
      const distanceAmount =
        Number(totalDays) * Number(vehicleRates['minimum_km_charge']) * Number(vehicleRates['amount_per_km'])

      const distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])

      const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
      const driverAmount = Number(vehicleRates['driver_charges_per_day']) * Number(totalDays)
      const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
      const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])

      const totalAmount =
        (distanceAmount > distanceAmount2 ? distanceAmount : distanceAmount2) +
        Number(tollAmount) +
        Number(driverAmount) +
        Number(parkingCharges) +
        Number(cleaningAmount)

      return totalAmount
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleTravelSubmit(onSubmit)}>
            <TravelInfoStep
              setTransportValue={setTransportValue}
              setTravelValue={setTravelValue}
              travelControl={travelControl}
              travelErrors={travelErrors}
              travelDates={travelDates}
            />
          </form>
        )
      case 1:
        return (
          <HotelInfoStep
            defaultHotelInfoValues={defaultHotelInfoValues}
            handleHotelSubmit={handleHotelSubmit}
            setHotelValue={setHotelValue}
            hotelControl={hotelControl}
            hotelErrors={hotelErrors}
            travelDates={travelDates}
            handleBack={handleBack}
            hotelRate={hotelRate}
            roomsList={roomsList}
            onSubmit={onSubmit}
            cities={cities}
          />
        )
      case 2:
        return (
          <form key={2} onSubmit={handleTransportSubmit(onSubmit)}>
            <TransportInfoStep
              transportControl={transportControl}
              transportErrors={transportErrors}
              transportRate={transportRate}
              handleBack={handleBack}
              cities={cities}
            />
          </form>
        )
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
            <Button size='large' variant='contained' onClick={handleReset}>
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
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if ((travelErrors.name || travelErrors.dates || travelErrors['days-nights']) && activeStep === 0) {
                  labelProps.error = true
                } else if (hotelErrors.cities && activeStep === 1) {
                  labelProps.error = true
                } else if (
                  (transportErrors.vehicleType ||
                    transportErrors.depatureReturnDate ||
                    transportErrors.from ||
                    transportErrors.to) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
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

export default QuotationSteps
