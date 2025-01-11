import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { addDays, format } from 'date-fns'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { useLoadScript } from '@react-google-maps/api'

import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { useTheme } from '@mui/material'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon'

import CustomInput from 'src/components/common/CustomInput'
// import LocationAutocomplete from 'src/components/quotation/quotation_steps/LocationAutocomplete'

import { ArrowHead, Dot, HighPrice, DefaultLocationIcon, RouteMapFilled, CancelTimeIcon } from 'src/utils/icons'
import LocationAutocomplete from 'src/components/common/LocationAutocomplete'
import { getDayNightCount } from 'src/utils/function'
import Loader from 'src/components/common/Loader'
import { postRequest } from 'src/api-main-file/APIServices'
import { useAuth } from 'src/hooks/useAuth'

const libraries = ['places']

const getTransportFare = (data, cities, transportSheetData) => {
  const { totalDays, totalDistance, vehicleType, additionalStops, from, to } = data
  const vehicleRates = transportSheetData[vehicleType]
  // console.log('cities: ', cities)

  if (from.place == to.place) {
    let totalAmount = Number(vehicleRates['city_local_fare'] * Number(totalDays))
    // console.log(additionalStops)
    // console.log('totalAmount: ', totalAmount)
    if (additionalStops.length > 0) {
      totalAmount = Number(vehicleRates['city_local_fare'] * (Number(totalDays) - 1))
      const tempTotalDistance = totalDistance < 280 ? 280 : totalDistance
      // console.log('tempTotalDistance: ', tempTotalDistance)

      const remainingAmount =
        tempTotalDistance * Number(vehicleRates['amount_per_km']) +
        Number(vehicleRates['toll_charges_per_day']) +
        Number(vehicleRates['driver_charges_per_day']) +
        Number(vehicleRates['parking_charges_per_day']) +
        Number(vehicleRates['service_cleaning_charge_one_time'])

      totalAmount += remainingAmount

      // console.log(
      //   "tempTotalDistance * Number(vehicleRates['amount_per_km']): ",
      //   tempTotalDistance * Number(vehicleRates['amount_per_km'])
      // )
      // console.log('per_km: ', Number(vehicleRates['amount_per_km']))
      // console.log('toll_day: ', Number(vehicleRates['toll_charges_per_day']))
      // console.log('driver_day: ', Number(vehicleRates['driver_charges_per_day']))
      // console.log('parking_km: ', Number(vehicleRates['parking_charges_per_day']))
      // console.log('cleaning: ', Number(vehicleRates['service_cleaning_charge_one_time']))
      // console.log('totalAmount: ', totalAmount)
    }
    return totalAmount
  } else {
    const distanceAmount =
      Number(totalDays) * Number(vehicleRates['minimum_km_charge']) * Number(vehicleRates['amount_per_km'])
    // console.log('distanceAmount: ', distanceAmount)

    let distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])
    // console.log('distanceAmount2: ', distanceAmount2)

    // if (totalDistance >= 1500) {
    //   distanceAmount2 = distanceAmount2 * 1.32
    // }

    const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
    // console.log('tollAmount: ', tollAmount)
    const driverAmount = Number(vehicleRates['driver_charges_per_day']) * Number(totalDays)
    // console.log('driverAmount: ', driverAmount)
    const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
    // console.log('parkingCharges: ', parkingCharges)
    const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])
    // console.log('cleaningAmount: ', cleaningAmount)

    const totalAmount =
      (distanceAmount > distanceAmount2 ? distanceAmount : Math.floor(distanceAmount2)) +
      Number(tollAmount) +
      Number(driverAmount) +
      Number(parkingCharges) +
      Number(cleaningAmount)

    // console.log('grandTotal: ', totalAmount)
    return totalAmount
  }
}

const getTotalAmount = async (transportData, transportSheetData) => {
  const { from, to, additionalStops, departureReturnDate } = transportData
  const origin = from.place
  const destination = to.place

  const date1 = new Date(departureReturnDate[0])
  const date2 = new Date(departureReturnDate[1])

  const diffInMs = date2 - date1
  const totalDays = diffInMs / (1000 * 60 * 60 * 24)

  const directionsService = new window.google.maps.DirectionsService()

  let waypoints =
    additionalStops.length > 0 ? additionalStops.map(item => ({ location: item.place, stopover: true })) : []

  let distanceObj = {
    origin,
    destination,
    travelMode: window.google.maps.TravelMode.DRIVING
  }

  if (origin !== destination) {
    // waypoints = [...waypoints, { location: origin, stopover: true }]
    distanceObj = { ...distanceObj, destination }
  }

  // Wrap the directionsService.route call in a Promise
  const getRoute = () =>
    new Promise((resolve, reject) => {
      directionsService.route(
        waypoints.length > 0
          ? {
              origin,
              waypoints: [...waypoints, { location: destination, stopover: true }],
              destination: origin,
              travelMode: window.google.maps.TravelMode.DRIVING
            }
          : distanceObj,
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            resolve(result)
          } else {
            reject(new Error(`Error fetching distance: ${status}`))
          }
        }
      )
    })

  try {
    const result = await getRoute()

    const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
    // console.log('result.routes[0].legs: ', result.routes[0].legs)
    const totalDistance = (totalDist / 1000).toFixed(2)
    // console.log('totalDistance: ', totalDistance)

    const totalTransportAmount =
      getTransportFare(
        {
          ...transportData,
          totalDistance,
          totalDays: totalDays + 1,
          additionalStops
        },
        waypoints,
        transportSheetData
      ) ?? 0

    return {
      distance: Math.floor(Number(totalDistance)),
      amount: Math.floor(Number(totalTransportAmount)),
      status: true
    }
  } catch (error) {
    console.error(error.message)
    toast.error(error.message)
    return { distance: 0, amount: 0, status: false }
  }
}

const BookTaxi = () => {
  const transportSheetData = useSelector(state => state.transportRateData)
  const [previewTaxi, setPreviewTaxi] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const router = useRouter()
  const { user } = useAuth()

  const {
    reset,
    setValue,
    getValues,
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
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
    }
  })

  const isLocal = watch('isLocal')

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'additionalStops'
  })
  const theme = useTheme()

  const handleWhatsApp = () => {
    const { pickup, drop, days, stops, vehicleType, distance, amount, tripDate, returnDate } = previewTaxi
    const link = document.createElement('a')

    const message =
      `Hi Team Adventure Richa Holidays,%0A%0A` +
      `I have some questions about the road trip mentioned below.%0A%0A` +
      `Pick-up Location: ${pickup?.place || ''}%0A%0A` +
      `Trip Date: ${format(new Date(tripDate), 'dd MMM yyyy')}%0A%0A` +
      `Drop-off Location: ${drop?.place || ''}%0A%0A` +
      `Return Date: ${format(new Date(returnDate), 'dd MMM yyyy')}%0A%0A` +
      `Route: ${stops.map(stop => stop.city).join(', ')}%0A%0A` +
      `Car Type: ${vehicleType}%0A%0A` +
      `Trip Duration: ${days} Days%0A%0A` +
      `Total Amount: ${amount}`

    // link.href = `https://wa.me/${data.whatsapp}/?text=${message}`
    link.href = `https://wa.me/9664478073/?text=${message}`

    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setPreviewTaxi(null)
  }

  const handleBookTaxi = async sendToWhatsapp => {
    setIsLoading(true)

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    // const BASE_URL = 'http://localhost:4000/api'
    const clientType = ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
      ? localStorage.getItem('clientType')
      : 'admin'
    const api_url = `${BASE_URL}/${clientType}`

    const { pickup, drop, days, stops, vehicleType, amount, distance, killoFare, tripDate, isLocal } = previewTaxi

    const dataToSend = {
      pickup,
      drop,
      tripDays: days,
      route: stops,
      vehicleType,
      amount,
      distance,
      killoFare,
      isLocal,
      tripDate,
      companyName: user.companyName,
      userName: user.name
    }

    const response = await postRequest(`${api_url}/create-taxi`, dataToSend)
    setIsLoading(false)

    if (response.status) {
      if (sendToWhatsapp) {
        handleWhatsApp()
      } else {
        setPreviewTaxi(null)
      }
      router.push('/quotations-history')
      toast.success('Sccess')
    } else {
      toast.error(response.error)
    }
  }

  const onSubmit = async data => {
    let stops = [data.from]
    data.additionalStops.map(stop => {
      stops.push(stop)
    })
    stops.push(data.to)

    const amountData = await getTotalAmount(data, transportSheetData)
    // console.log('amountData: ', amountData)
    if (amountData.status) {
      setPreviewTaxi({
        pickup: data.from,
        drop: data.to,
        days: getDayNightCount(data.departureReturnDate) + 1,
        tripDate: data.departureReturnDate[0],
        returnDate: data.departureReturnDate[1],
        isLocal: data.isLocal,
        stops,
        vehicleType: data.vehicleType,
        distance: amountData.distance,
        amount: amountData.amount,
        killoFare: transportSheetData[data.vehicleType].amount_per_km
      })
    } else {
      // setPreviewTaxi({
      //   pickup: { from: '', city: '', state: '' },
      //   drop: { from: '', city: '', state: '' },
      //   days: getDayNightCount(data.departureReturnDate) + 1,
      //   stops,
      //   vehicleType: data.vehicleType,
      //   distance: 0,
      //   amount: 0,
      //   killoFare: 0
      // })
    }
  }

  const onCancel = () => {
    router.push('/')
  }

  // if (!isLoaded) return <div>Loading...</div>

  return (
    <DatePickerWrapper>
      <Loader open={!isLoaded || isLoading} />
      <Typography className='main-title' variant='h3'>
        {' '}
        Why Book Taxi From US ?
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={3} sm={6}>
          <Card
            sx={{
              backgroundColor: '#ffffff'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <Box sx={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src='/images/calendar.png' alt='icon' width={'50px'} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6'>Flexible Booking</Typography>
                  <Typography variant='caption'>Book now or schedule ahead</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Card
            sx={{
              backgroundColor: '#ffffff'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <Box sx={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src='/images/best-price.png' alt='icon' width={'50px'} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6'>Affordable Pricing</Typography>
                  <Typography variant='caption'>Transparent fares, no surprises</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Card
            sx={{
              backgroundColor: '#ffffff'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <Box sx={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src='/images/security.png' alt='icon' width={'50px'} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6'>Safe and Secure</Typography>
                  <Typography variant='caption'>Verified drivers, safe rides.</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Card
            sx={{
              backgroundColor: '#ffffff'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <Box sx={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src='/images/customer-service.png' alt='icon' width={'50px'} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6'>24/7 Availability</Typography>
                  <Typography variant='caption'>Rides anytime, anywhere.</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ backgroundColor: '#ffffff' }}>
            <CardContent>
              <Grid component='form' onSubmit={handleSubmit(onSubmit)} container spacing={5}>
                <Grid item xs={12}>
                  {transportSheetData && (
                    <FormControl fullWidth>
                      <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.vehicleType)}>
                        Select type of vehicle
                      </InputLabel>
                      <Controller
                        name='vehicleType'
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={value}
                            label='Select type of vehicle'
                            startAdornment={
                              <InputAdornment position='start'>
                                <Icon icon='mdi:car-outline' color={theme.palette.primary.main} />
                              </InputAdornment>
                            }
                            onChange={onChange}
                          >
                            {Object.keys(transportSheetData).map(transport => (
                              <MenuItem key={transport} value={transport}>
                                {transport.split('_').join(' ')}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.vehicleType && (
                        <errors sx={{ color: 'error.main' }} id='checkpoints-error'>
                          {errors.vehicleType?.message}
                        </errors>
                      )}
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='departureReturnDate'
                    control={control}
                    rules={{ required: 'Both start and end date required' }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selectsRange
                        monthsShown={2}
                        endDate={value[1]}
                        selected={value[0]}
                        startDate={value[0]}
                        shouldCloseOnSelect={false}
                        id='date-range-picker-months'
                        onChange={onChange}
                        popperPlacement='bottom-start'
                        customInput={
                          <CustomInput
                            label='Depature & Return Date'
                            end={value[1]}
                            start={value[0]}
                            propserror={errors}
                          />
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='from'
                      control={control}
                      rules={{ required: 'This field is required' }}
                      render={({ field: { value, onChange } }) => (
                        <LocationAutocomplete
                          label='From'
                          name='taxi-from'
                          defaultValue={value}
                          onChange={onChange}
                          error={errors.to}
                          theme={theme}
                          icon='location'
                        />
                      )}
                    />
                    {errors.from && (
                      <FormHelperText sx={{ color: 'error.main' }} id='from-error'>
                        {errors.from?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='isLocal'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        value={value}
                        checked={value}
                        onChange={e => {
                          if (e.target.checked) {
                            setValue('to', getValues('from'))
                          }
                          onChange(e.target.checked)
                        }}
                        control={<Checkbox size='small' />}
                        label='Book Taxi for local sight seeing'
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: { xs: '13px', mobileMd: '1 rem' }
                          },
                          '& .MuiFormControlLabel-root': {
                            ml: 0,
                            mr: 0
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                {fields.length > 0 && (
                  <Grid item xs={12} sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {fields.map((item, index) => (
                      <Grid container spacing={5} key={item.id}>
                        <Grid item xs={10.75} sx={{ mb: index != fields.length - 1 ? 5 : 0 }}>
                          <FormControl fullWidth>
                            {/* <InputLabel
                        htmlFor='stepper-linear-account-name'
                        error={Boolean(errors.additionalStops?.[index])}
                      >
                        Stop Added
                      </InputLabel> */}
                            <Controller
                              name={`additionalStops.${index}`}
                              control={control}
                              rules={{ required: 'This field is required' }}
                              render={({ field: { value, onChange } }) => (
                                <LocationAutocomplete
                                  label='Stop Added'
                                  name={`additionalStops.${index}`}
                                  defaultValue={value}
                                  cities={[]}
                                  onChange={onChange}
                                  error={errors.additionalStops?.[index]}
                                  theme={theme}
                                  icon='location-add'
                                />
                              )}
                            />
                            {errors.additionalStops?.[index] && (
                              <FormHelperText sx={{ color: 'error.main' }} id='additionalStops-error'>
                                {errors.additionalStops?.[index]?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={1.25} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Fab
                            onClick={() => remove(index)}
                            // disabled={additionalStops.length == 1}
                            // color='error'
                            sx={{
                              backgroundColor: theme => theme.palette.primary.main,
                              color: 'white',
                              '&.MuiFab-root:hover': {
                                backgroundColor: theme => theme.palette.primary.main
                              }
                            }}
                            aria-label='delete'
                            size='small'
                          >
                            <Icon fontSize='1.3rem' icon='mdi:delete' />
                          </Fab>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                  >
                    <IconButton
                      edge='end'
                      onClick={e => {
                        e.stopPropagation()
                        // append('')
                        append(null)
                      }}
                      aria-label='toggle plus visibility'
                      size='small'
                      sx={{
                        backgroundColor: theme => theme.palette.primary.main,
                        color: 'white',
                        '&.MuiIconButton-root:hover': {
                          backgroundColor: theme => theme.palette.primary.main
                        }
                      }}
                    >
                      <Icon icon='mdi:plus' />
                    </IconButton>
                    <Typography fontSize={15}>Add Stops</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    {/* <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.to)}>
                To
              </InputLabel> */}
                    <Controller
                      name='to'
                      control={control}
                      rules={{ required: 'This field is required' }}
                      render={({ field: { value, onChange } }) => (
                        <LocationAutocomplete
                          label='To'
                          name='taxi-to'
                          defaultValue={value}
                          cities={[]}
                          onChange={onChange}
                          error={errors.to}
                          theme={theme}
                          icon='flag'
                        />
                      )}
                    />
                    {errors.to && (
                      <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                        {errors.to?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ backgroundColor: '#ffffff' }}>
            <CardContent>
              {previewTaxi && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Pick-Up Location</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#FB760140',
                          padding: '10px',
                          borderRadius: '8px'
                        }}
                      >
                        <Box sx={{ paddingRight: '10px' }}>{DefaultLocationIcon}</Box>
                        <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                          {`${previewTaxi.pickup.city}, ${previewTaxi.pickup.state}`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography>Drop Location</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#FB760140',
                          padding: '10px',
                          borderRadius: '8px'
                        }}
                      >
                        <Box sx={{ paddingRight: '10px' }}>{DefaultLocationIcon}</Box>
                        <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                          {`${previewTaxi.drop.city}, ${previewTaxi.drop.state}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      alignItems: 'center',
                      backgroundColor: '#FB760140',
                      padding: '10px',
                      borderRadius: '8px'
                    }}
                  >
                    <Box>{RouteMapFilled}</Box>
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      {previewTaxi.days} Days Trip
                    </Typography>
                    <Typography variant='body1' sx={{ color: 'orange', fontWeight: 600 }}>
                      |
                    </Typography>
                    {previewTaxi.stops.map((stop, index) => (
                      <Fragment key={index}>
                        <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                          {stop.city}
                        </Typography>
                        {index != previewTaxi.stops.length - 1 && ArrowHead}
                      </Fragment>
                    ))}
                    {/* <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      Jaipur
                    </Typography>
                    {ArrowHead}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      Pushkar
                    </Typography>
                    {ArrowHead}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      Ajmer
                    </Typography>
                    {ArrowHead}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      Udaipur
                    </Typography> */}
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      {previewTaxi.vehicleType}
                    </Typography>
                    {Dot}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      A/C
                    </Typography>
                    {Dot}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      4 Seats
                    </Typography>
                    {Dot}
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                      {previewTaxi.distance} kms Included
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {HighPrice}
                      <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                        Extra Km Fare :
                      </Typography>
                      <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                        Rs {previewTaxi.killoFare}/km after {previewTaxi.distance} Kms
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {CancelTimeIcon}
                      <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                        Cancellation :
                      </Typography>
                      <Typography variant='body1' sx={{ color: '#333333', fontWeight: 600 }}>
                        Before 5 Days of Departure
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant='h2' sx={{ color: '#333333', fontWeight: 800 }}>
                      ₹ {previewTaxi.amount}
                    </Typography>
                    <Typography variant='body1' sx={{ color: '#333333', fontWeight: 500 }}>
                      Excluding Taxes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5 }}>
                    <Button
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        justifyContent: 'center',
                        fontWeight: '900'
                      }}
                      variant='contained'
                      onClick={() => handleBookTaxi(false)}
                    >
                      Book Now
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => handleBookTaxi(true)}
                      sx={{
                        textTransform: 'none',
                        justifyContent: 'center',
                        fontWeight: '900'
                      }}
                      variant='outlined'
                    >
                      Chat With Us
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default BookTaxi
