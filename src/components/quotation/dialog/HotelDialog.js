import React, { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

import { styled, useTheme } from '@mui/material/styles'

import MuiTabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Icon from 'src/@core/components/icon'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RoomDialog from './RoomDialog'
import CustomInput from 'src/components/common/CustomInput'
import { getDayNightCount } from 'src/utils/function'
import CusomInputWithButttons from 'src/components/common/CusomInputWithButttons'
import { useMediaQuery } from '@mui/material'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    // minHeight: 38,
    // minWidth: 130,
    borderRadius: theme.shape.borderRadius
  }
}))

const HotelDialog = ({
  setSelectedCitiesHotels,
  selectedCitiesHotels,
  open,
  handleClose,
  selectedCity,
  isEdit,
  selectedHotelInfo
}) => {
  const travelInfoData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null
  const hotelSheetData = useSelector(state => state.hotelRateData)
  // console.log('selectedCitiesHotels: ', selectedCitiesHotels)
  // console.log(selectedHotelInfo)

  const isBelowTablet = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const [tabValue, setTabValue] = useState('0')
  const [hotelList, setHotelList] = useState([])

  const [selectedHotelDetail, setSelectedHotelDetail] = useState(null)
  const [openRoomDialog, setOpenRoomDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [openMenuList, setOpenMenuList] = useState(false)
  const [totalRooms, setTotalRooms] = useState(0)
  const isSubmited = useRef(false)

  const {
    reset: hotelReset,
    watch: hotelWatch,
    setValue: setHotelValue,
    control: hotelControl,
    handleSubmit: handleHotelDialogSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: selectedHotelInfo
  })

  const paperRef = useRef(null)

  const theme = useTheme()

  const rooms = hotelWatch('rooms')
  const child = hotelWatch('child')
  const adult = hotelWatch('adult')

  useEffect(() => {
    if (selectedCity) {
      getHotelList()
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedHotelInfo) {
      const { checkInCheckOut, daysNights, breakfast, lunch, dinner, rooms, extraBed, child, adult, persons, hotel } =
        selectedHotelInfo
      hotelReset({
        checkInCheckOut: [
          checkInCheckOut[0] ? new Date(checkInCheckOut[0]) : null,
          checkInCheckOut[1] ? new Date(checkInCheckOut[1]) : null
        ],
        daysNights,
        breakfast,
        lunch,
        dinner,
        rooms,
        extraBed,
        child,
        adult,
        persons,
        hotel
      })
      setSelectedHotelDetail(selectedHotelInfo.hotel)
    }
  }, [selectedHotelInfo])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClickOutside = event => {
    if (paperRef.current && !paperRef.current.contains(event.target)) {
      setOpenMenuList(false)
    }
  }

  const getHotelList = () => {
    let finalHotelList = []
    Object.keys(hotelSheetData.hotelsRate[selectedCity.label]).map(hotel_type => {
      let hotelsArr = []
      Object.keys(hotelSheetData.hotelsRate[selectedCity.label][hotel_type]).map((hotel, index) => {
        const minPrice = hotelSheetData.hotelsRate[selectedCity.label][hotel_type][hotel]['minPrice']
        const maxPrice = hotelSheetData.hotelsRate[selectedCity.label][hotel_type][hotel]['maxPrice']
        // console.log(hotel)

        hotelsArr.push({
          id: index,
          name: hotel,
          location: selectedCity.label,
          image: 'singapore',
          price:
            minPrice == maxPrice
              ? `₹${minPrice?.slice(0, 1)}xxx`
              : `₹${minPrice?.slice(0, 1)}xxx-₹${maxPrice.slice(0, 1)}xxx`,
          selected: false,
          type: hotel_type
        })
      })
      finalHotelList.push({ hotelType: hotel_type, hotels: hotelsArr })
    })
    setHotelList(finalHotelList)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleChildIncrement = onChange => {
    const newValue =
      Number(adult) == 0 ? `${Number(child) + 1} Childs` : `${adult} Adults & ${Number(child) + 1} Childs`
    setHotelValue('persons', newValue)
    onChange(`${Number(child) + 1}`)
  }

  const handleChildDecrement = onChange => {
    if (Number(child) != 0) {
      onChange(`${Number(child) - 1}`)
    }
    const newValue =
      Number(adult) == 0 && Number(child) == 0
        ? ''
        : Number(adult) != 0 && Number(child) != 0
        ? `${adult} Adults & ${Number(child) - 1} Childs`
        : Number(child) == 0
        ? `${adult} Adults`
        : `${Number(child) - 1} Childs`
    setHotelValue('persons', newValue)
  }

  const handleAdultIncrement = onChange => {
    const newValue =
      Number(child) == 0 ? `${Number(adult) + 1} Adults` : `${Number(adult) + 1} Adults & ${child} Childs`
    setHotelValue('persons', newValue)
    onChange(`${Number(adult) + 1}`)
  }

  const handleAdultDecrement = onChange => {
    if (Number(adult) != 0) {
      onChange(`${Number(adult) - 1}`)
    }
    const newValue =
      Number(adult) == 0 && Number(child) == 0
        ? ''
        : Number(adult) != 0 && Number(child) != 0
        ? `${Number(adult) - 1} Adults & ${child} Childs`
        : Number(adult) == 0
        ? `${child} Childs`
        : `${Number(adult) - 1} Adults`
    setHotelValue('persons', newValue)
  }

  const handleHotelChange = hotel => {
    setHotelList(prev =>
      prev.map(data => (data.id == hotel.id ? { ...data, selected: !data.selected } : { ...data, selected: false }))
    )
  }

  const handleOpenRoomDialog = hotel => {
    setSelectedHotel(hotel)
    setOpenRoomDialog(true)
  }

  const handleCloseRoomDialog = (hotelInfo, roomInfo, isSubmit) => {
    if (hotelInfo && roomInfo && isSubmit) {
      setSelectedHotelDetail({ ...hotelInfo, ...roomInfo })
    }
    setSelectedHotel(null)
    setOpenRoomDialog(false)
  }

  const onDialogSubmit = data => {
    // console.log(data)
    // return;
    isSubmited.current = true
    const { checkInCheckOut, breakfast, lunch, dinner, rooms, daysNights, extraBed, child, adult, persons } = data
    if (!selectedHotelDetail) {
      return
    }

    let selectedRoomsList = Object.keys(selectedHotelDetail).filter(roomType => hotelSheetData.roomsList.includes(roomType))
    let roomCount = 0
    // console.log("hotelSheetData.roomsList: ", hotelSheetData.roomsList)
    // console.log("selectedRoomsList: ", selectedRoomsList)
    // console.log("selectedHotelDetail: ", selectedHotelDetail)
    // return;
    selectedRoomsList.map(room => (roomCount += Number(selectedHotelDetail[room])))
    if (roomCount != Number(rooms)) {
      setTotalRooms(roomCount)
      return
    }

    const cityToFind = selectedCitiesHotels.find(city => city.id == selectedCity.id)

    if (isEdit) {
      const updatedCities = selectedCitiesHotels.map(city =>
        city.id == selectedCity.id
          ? {
              ...city,
              info: city.info.map(currHotel =>
                currHotel.id == selectedHotelInfo.id
                  ? {
                      ...currHotel,
                      checkInCheckOut,
                      breakfast,
                      lunch,
                      dinner,
                      rooms,
                      child,
                      daysNights,
                      extraBed,
                      hotel: selectedHotelDetail,
                      child,
                      adult,
                      persons
                    }
                  : currHotel
              )
            }
          : city
      )

      // console.log(updatedCities)
      setSelectedCitiesHotels(updatedCities)
      // setHotelValue('cities', updatedCities)
    } else {
      // console.log(cityToFind)
      if (cityToFind) {
        const updatedCities = selectedCitiesHotels.map(city =>
          city.id == selectedCity.id
            ? {
                ...city,
                info: [
                  ...city.info,
                  {
                    id: Date.now(),
                    checkInCheckOut,
                    breakfast,
                    lunch,
                    dinner,
                    rooms,
                    child,
                    daysNights,
                    extraBed,
                    hotel: selectedHotelDetail,
                    persons,
                    adult
                  }
                ]
              }
            : city
        )
        // cityToFind.info.push({
        //   id: Date.now(),
        //   checkInCheckOut,
        //   breakfast,
        //   lunch,
        //   dinner,
        //   rooms,
        //   child,
        //   daysNights,
        //   extraBed,
        //   hotel: selectedHotelDetail
        // })
        // console.log(updatedCities)
        setSelectedCitiesHotels(updatedCities)
        // setHotelValue('cities', selectedCitiesHotels)
      }
    }
    // return
    resetFields()
  }

  const resetFields = () => {
    isSubmited.current = false
    setTotalRooms(0)
    setHotelList([])
    hotelReset()
    setSelectedHotelDetail(null)
    handleClose()
  }

  return (
    <Dialog fullWidth maxWidth='laptopSm' open={open} onClose={resetFields}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 0
          }
        }}
      >
        Hotel Category
      </DialogTitle>
      <Box component='form' onSubmit={handleHotelDialogSubmit(onDialogSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText>Need To Select at least 1 Hotel</DialogContentText>
          <DatePickerWrapper sx={{ p: 2, pt: 5 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} tablet={6}>
                <Controller
                  name='checkInCheckOut'
                  control={hotelControl}
                  rules={{ required: 'Both start and end date required' }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DatePicker
                        selectsRange
                        minDate={
                          travelInfoData && Array.isArray(travelInfoData.dates) && travelInfoData.dates[0]
                            ? new Date(travelInfoData.dates[0])
                            : new Date()
                        }
                        maxDate={
                          travelInfoData && Array.isArray(travelInfoData.dates) && travelInfoData.dates[1]
                            ? new Date(travelInfoData.dates[1])
                            : addDays(new Date(), 45)
                        }
                        monthsShown={2}
                        endDate={value[1] ? new Date(value[1]) : null}
                        selected={value[0] ? new Date(value[0]) : null}
                        startDate={value[0] ? new Date(value[0]) : null}
                        shouldCloseOnSelect={false}
                        id='date-range-picker-months'
                        onChange={e => {
                          onChange(e)
                          const dayCount = getDayNightCount(e) + 1
                          setHotelValue(
                            'daysNights',
                            e[1] == null
                              ? '1 Day'
                              : `${dayCount} ${dayCount < 2 ? 'Day' : 'Days'} & ${dayCount - 1} ${
                                  dayCount < 3 ? 'Night' : 'Nights'
                                }`
                          )
                        }}
                        popperPlacement='bottom-start'
                        customInput={
                          <CustomInput
                            label='Check-In & Check-Out'
                            end={value[1]}
                            start={value[0]}
                            propserror={errors}
                          />
                        }
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} tablet={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-daysNights'>Days and Nights</InputLabel>
                  <Controller
                    name='daysNights'
                    control={hotelControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        value={value}
                        disabled
                        label='Days and Nights'
                        id='stepper-linear-account-daysNights'
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:night-day' />
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} tablet={5}>
                <Box sx={{ border: '1px solid #9A9A9A', borderRadius: '6px', position: 'relative', height: '56px' }}>
                  <Typography
                    variant='caption'
                    sx={{ position: 'absolute', top: -11.5, left: 10, background: 'white', px: 1 }}
                  >
                    Meals
                  </Typography>
                  <FormGroup
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      height: '100%',
                      alignItems: 'center',
                      '&.MuiFormGroup-root': {
                        flexWrap: 'nowrap'
                      },
                      pl: 2
                    }}
                  >
                    {!isBelowTablet && <Icon icon='mdi:plate-eating' color={theme.palette.primary.main} />}
                    <Controller
                      name='breakfast'
                      control={hotelControl}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          value={value}
                          checked={value}
                          onChange={onChange}
                          control={<Checkbox size='small' />}
                          label='Breakfast'
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
                    <Controller
                      name='lunch'
                      control={hotelControl}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          value={value}
                          checked={value}
                          onChange={onChange}
                          control={<Checkbox size='small' />}
                          label='Lunch'
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
                    <Controller
                      name='dinner'
                      control={hotelControl}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          value={value}
                          checked={value}
                          onChange={onChange}
                          control={<Checkbox size='small' />}
                          label='Dinner'
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
                  </FormGroup>
                </Box>
              </Grid>
              <Grid item xs={12} tablet={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-person'>No. of Persons</InputLabel>
                  <Controller
                    name='persons'
                    control={hotelControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        value={
                          Number(adult) == 0 && Number(child) == 0
                            ? ''
                            : Number(adult) != 0 && Number(child) != 0
                            ? `${adult} Adults & ${child} Childs`
                            : Number(adult) == 0
                            ? `${child} Childs`
                            : `${adult} Adults`
                        }
                        label='No. of Persons'
                        id='stepper-linear-account-person'
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:double-user' color={theme.palette.primary.main} />
                          </InputAdornment>
                        }
                        onFocus={() => {
                          setOpenMenuList(true)
                        }}
                      />
                    )}
                  />
                  {openMenuList && (
                    <Paper
                      sx={{
                        width: '100%',
                        maxWidth: '100%',
                        position: 'absolute',
                        zIndex: 2,
                        mt: { xs: '18%', mobileMd: '25%' }
                      }}
                      ref={paperRef}
                    >
                      <MenuList>
                        <MenuItem
                          sx={{
                            '&.MuiMenuItem-root': {
                              backgroundColor: 'transparent'
                            },
                            '&.MuiMenuItem-root:hover': {
                              backgroundColor: 'transparent'
                            },
                            cursor: 'default'
                          }}
                          disableRipple
                        >
                          Adult{' '}
                          <Controller
                            name='adult'
                            control={hotelControl}
                            rules={{ required: 'This field is required' }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <IconButton
                                  edge='end'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleAdultDecrement(onChange)
                                  }}
                                  aria-label='toggle minus visibility'
                                  size='small'
                                  sx={{
                                    mx: 3,
                                    backgroundColor: theme => theme.palette.primary.main,
                                    color: 'white',
                                    '&.MuiIconButton-root:hover': {
                                      backgroundColor: theme => theme.palette.primary.main
                                    }
                                  }}
                                >
                                  <Icon icon='mdi:minus' />
                                </IconButton>
                                {value}
                                <IconButton
                                  edge='end'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleAdultIncrement(onChange)
                                  }}
                                  aria-label='toggle plus visibility'
                                  size='small'
                                  sx={{
                                    mx: 3,
                                    backgroundColor: theme => theme.palette.primary.main,
                                    color: 'white',
                                    '&.MuiIconButton-root:hover': {
                                      backgroundColor: theme => theme.palette.primary.main
                                    }
                                  }}
                                >
                                  <Icon icon='mdi:plus' />
                                </IconButton>
                              </>
                            )}
                          />
                        </MenuItem>
                        <MenuItem
                          sx={{
                            '&.MuiMenuItem-root': {
                              backgroundColor: 'transparent'
                            },
                            '&.MuiMenuItem-root:hover': {
                              backgroundColor: 'transparent'
                            },
                            cursor: 'default'
                          }}
                          disableRipple
                        >
                          Child
                          <Controller
                            name='child'
                            control={hotelControl}
                            rules={{ required: 'This field is required' }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <IconButton
                                  edge='end'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleChildDecrement(onChange)
                                  }}
                                  aria-label='toggle minus visibility'
                                  size='small'
                                  sx={{
                                    mx: 3,
                                    backgroundColor: theme => theme.palette.primary.main,
                                    color: 'white',
                                    '&.MuiIconButton-root:hover': {
                                      backgroundColor: theme => theme.palette.primary.main
                                    }
                                  }}
                                >
                                  <Icon icon='mdi:minus' />
                                </IconButton>
                                {value}
                                <IconButton
                                  edge='end'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleChildIncrement(onChange)
                                  }}
                                  aria-label='toggle plus visibility'
                                  size='small'
                                  sx={{
                                    mx: 3,
                                    backgroundColor: theme => theme.palette.primary.main,
                                    color: 'white',
                                    '&.MuiIconButton-root:hover': {
                                      backgroundColor: theme => theme.palette.primary.main
                                    }
                                  }}
                                >
                                  <Icon icon='mdi:plus' />
                                </IconButton>
                              </>
                            )}
                          />
                        </MenuItem>
                      </MenuList>
                    </Paper>
                  )}
                  {errors.persons && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-persons'>
                      {errors.persons?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} tablet={4}>
                <Grid container spacing={6}>
                  <Grid item xs={12} mobileSm={6} tablet={6}>
                    <Box
                      sx={{
                        border: '1px solid #9A9A9A',
                        borderRadius: '6px',
                        position: 'relative',
                        height: '55.7px',
                        display: 'flex',
                        alignItems: 'center',
                        px: 3
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{ position: 'absolute', top: -11.5, left: 10, background: 'white', px: 1 }}
                      >
                        No of Rooms
                      </Typography>
                      <CusomInputWithButttons
                        name='rooms'
                        hotelControl={hotelControl}
                        isRequired='This field is required'
                        // label='No. of Rooms *'
                        errors={errors}
                        icon='curtains-open'
                        theme={theme}
                      />
                    </Box>
                    {isSubmited.current && rooms.length == 0 && (
                      <FormHelperText sx={{ color: 'error.main', ml: 3 }} id='stepper-linear-account-password'>
                        This field is required
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} mobileSm={6} tablet={6}>
                    <Box
                      sx={{
                        border: '1px solid #9A9A9A',
                        borderRadius: '6px',
                        position: 'relative',
                        height: '55.7px',
                        display: 'flex',
                        px: 3
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{ position: 'absolute', top: -11.5, left: 10, background: 'white', px: 1 }}
                      >
                        Extra Bed
                      </Typography>
                      <CusomInputWithButttons
                        name='extraBed'
                        hotelControl={hotelControl}
                        isRequired={false}
                        label='Extra Bed'
                        errors={errors}
                        icon='double-bed'
                        theme={theme}
                        rooms={rooms}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              {hotelList.length > 0 && (
                <Grid item xs={12}>
                  <TabContext value={tabValue}>
                    <TabList
                      onChange={handleTabChange}
                      aria-label='customized tabs example'
                      sx={{ backgroundColor: '#EAEBF0', borderRadius: '5px' }}
                    >
                      {hotelList.map((hotel, index) => (
                        <Tab
                          key={hotel?.hotelType}
                          value={index.toString()}
                          label={hotel.hotelType ?? ''}
                          sx={{ width: 1 / hotelList.length }}
                        />
                      ))}
                    </TabList>
                    {hotelList.map((currHotels, index) => (
                      <TabPanel key={currHotels?.hotelType} value={index.toString()} sx={{ mt: 3 }}>
                        <Grid container spacing={6}>
                          {currHotels.hotels.map(hotel => (
                            <Grid key={hotel.id} item xs={12} sm={6}>
                              {/* {console.log('selectedHotelDetail: ', selectedHotelDetail)}
                              {console.log('hotel: ', hotel)} */}
                              <Card>
                                <CardMedia sx={{ height: '9.375rem' }} image={`/images/hotels/jaipur.jpg`} />
                                <CardContent sx={{ p: theme => `${theme.spacing(3, 5, 4)} !important` }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      flexWrap: 'wrap'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {/* <Icon icon='mdi:hotel-location' /> */}
                                      <Typography variant='h6' sx={{ mb: 2 }}>
                                        {hotel.name ? `${hotel.name.slice(0, 18)}...` : ''}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                                      <Typography variant='h6'>{hotel.price}</Typography>
                                      <Typography variant='caption'>/Room</Typography>
                                    </Box>
                                  </Box>
                                  <Divider sx={{ mb: 2 }} />
                                  <Button
                                    disabled={
                                      Number(rooms) == 0
                                        ? true
                                        : selectedHotelDetail
                                        ? selectedHotelDetail.name != hotel.name
                                        : selectedHotelDetail
                                        ? selectedHotelDetail.id != hotel.id
                                        : false
                                    }
                                    variant='contained'
                                    sx={{ mt: 1, width: '100%', textTransform: 'none' }}
                                    onClick={() => handleOpenRoomDialog(hotel)}
                                  >
                                    {Number(rooms) == 0 || !selectedHotelDetail
                                      ? 'Select Rooms Type'
                                      : selectedHotelDetail.id == hotel.id || selectedHotelDetail.name == hotel.name
                                      ? 'Update Rooms Type'
                                      : 'Select Rooms Type'}
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </TabPanel>
                    ))}
                  </TabContext>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{
                  '&.MuiGrid-root': {
                    pt: '7px'
                  }
                }}
              >
                <Typography color='error' sx={{ ml: 5 }} fontWeight={600}>
                  Note: {totalRooms == 0 ? '' : totalRooms} Room Types are required
                </Typography>
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={resetFields}>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </Box>
      <RoomDialog
        open={openRoomDialog}
        selectedHotelDetail={selectedHotelDetail}
        handleClose={handleCloseRoomDialog}
        selectedHotel={selectedHotel}
        rooms={rooms}
      />
    </Dialog>
  )
}

export default HotelDialog
