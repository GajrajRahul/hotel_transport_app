import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'

import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
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
import Checkbox from '@mui/material/Checkbox'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'

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
  open,
  handleClose,
  cities,
  setHotelValue,
  selectedCity,
  isEdit,
  selectedHotelInfo,
  travelDates,
  hotelRate,
  roomsList
}) => {
  const dayCount = useMemo(() => {
    return getDayNightCount(travelDates) + 1
  }, [])

  const {
    reset: hotelReset,
    watch: hotelWatch,
    setValue,
    control: hotelControl,
    handleSubmit: handleHotelDialogSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: isEdit
      ? selectedHotelInfo
      : {
          ...selectedHotelInfo,
          checkInCheckOut: travelDates,
          daysNights: `${dayCount} ${dayCount < 2 ? 'Day' : 'Days'} & ${dayCount - 1} ${
            dayCount < 3 ? 'Night' : 'Nights'
          }`
        }
  })
  const [tabValue, setTabValue] = useState('0')
  const [hotelList, setHotelList] = useState([])

  const [openRoomDialog, setOpenRoomDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedHotelDetail, setSelectedHotelDetail] = useState(null)
  const [totalRooms, setTotalRooms] = useState(0)

  const theme = useTheme()
  const rooms = hotelWatch('rooms')
  const child = hotelWatch('child')

  useEffect(() => {
    if (selectedCity) {
      getHotelList()
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedHotelInfo) {
      const { checkInCheckOut, daysNights, breakfast, lunch, dinner, rooms, extraBed, child } = selectedHotelInfo
      hotelReset({
        checkInCheckOut: checkInCheckOut,
        breakfast,
        lunch,
        dinner,
        extraBed,
        rooms,
        daysNights,
        child
      })
      setSelectedHotelDetail(selectedHotelInfo.hotel)
    }
  }, [selectedHotelInfo])

  const getHotelList = () => {
    let finalHotelList = []
    Object.keys(hotelRate[selectedCity.label]).map(hotel_type => {
      let hotelsArr = []
      Object.keys(hotelRate[selectedCity.label][hotel_type]).map((hotel, index) => {
        hotelsArr.push({
          id: index,
          name: hotel,
          location: selectedCity.label,
          image: 'singapore',
          price: '2xx - 3xx',
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
    const { checkInCheckOut, breakfast, lunch, dinner, rooms, daysNights, extraBed, child } = data
    if (!selectedHotelDetail) {
      return
    }

    let selectedRoomsList = Object.keys(selectedHotelDetail).filter(roomType => roomsList.includes(roomType))
    let roomCount = 0
    selectedRoomsList.map(room => (roomCount += Number(selectedHotelDetail[room])))
    if (roomCount != Number(rooms)) {
      setTotalRooms(roomCount)
      return
    }

    const cityToFind = cities.find(city => city.id == selectedCity.id)

    if (isEdit) {
      const updatedCities = cities.map(city =>
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
                      hotel: selectedHotelDetail
                    }
                  : currHotel
              )
            }
          : city
      )

      setHotelValue('cities', updatedCities)
    } else {
      if (cityToFind) {
        cityToFind.info.push({
          id: Date.now(),
          checkInCheckOut,
          breakfast,
          lunch,
          dinner,
          rooms,
          child,
          daysNights,
          extraBed,
          hotel: selectedHotelDetail
        })
        setHotelValue('cities', cities)
      }
    }
    resetFields()
  }

  const resetFields = () => {
    setTotalRooms(0)
    setHotelList([])
    hotelReset()
    setSelectedHotelDetail(null)
    handleClose()
  }

  return (
    <Dialog fullWidth maxWidth='laptopXs' open={open} onClose={resetFields}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 3
          }
        }}
        textAlign='center'
      >
        Select Hotel
      </DialogTitle>
      <Box component='form' onSubmit={handleHotelDialogSubmit(onDialogSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText textAlign='center'>Select Hotel and Meal type.</DialogContentText>
          <DatePickerWrapper sx={{ mt: 5 }}>
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
                        minDate={travelDates[0]}
                        maxDate={travelDates[1]}
                        monthsShown={2}
                        endDate={value[1]}
                        selected={value[0]}
                        startDate={value[0]}
                        shouldCloseOnSelect={false}
                        id='date-range-picker-months'
                        onChange={e => {
                          onChange(e)
                          const dayCount = getDayNightCount(e) + 1
                          setValue(
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
                            <Icon icon='mdi:sun-moon-stars' color={theme.palette.primary.main} />
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} tablet={6}>
                <FormGroup
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    border: '1px solid black',
                    borderRadius: '6px',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    height: '100%'
                  }}
                >
                  <Controller
                    name='breakfast'
                    control={hotelControl}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        value={value}
                        checked={value}
                        onChange={onChange}
                        control={<Checkbox />}
                        label='Breakfast'
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
                        control={<Checkbox />}
                        label='Lunch'
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
                        control={<Checkbox />}
                        label='Dinner'
                      />
                    )}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} mobileSm={6} tablet={2.5}>
                <CusomInputWithButttons
                  name='rooms'
                  hotelControl={hotelControl}
                  isRequired='This field is required'
                  label='No. of Rooms *'
                  errors={errors}
                />
              </Grid>
              <Grid
                item
                xs={12}
                mobileSm={6}
                tablet={2}
                sx={{
                  '&.MuiGrid-root': {
                    pl: 0
                  }
                }}
              >
                <CusomInputWithButttons
                  name='extraBed'
                  hotelControl={hotelControl}
                  isRequired={false}
                  label='Extra Bed'
                  errors={errors}
                />
              </Grid>
              <Grid
                item
                xs={12}
                mobileSm={6}
                tablet={1.5}
                sx={{
                  '&.MuiGrid-root': {
                    pl: 0
                  }
                }}
              >
                <CusomInputWithButttons
                  name='child'
                  hotelControl={hotelControl}
                  isRequired={false}
                  label='Child'
                  errors={errors}
                />
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
                            <Grid key={hotel.id} item xs={12} sm={4}>
                              <Card>
                                <CardMedia sx={{ height: '9.375rem' }} image={`/images/hotels/${hotel.image}.png`} />
                                <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='h6' sx={{ mb: 2 }}>
                                      {hotel.name}
                                    </Typography>
                                    <Icon
                                      onClick={() => handleHotelChange(hotel)}
                                      style={{ cursor: 'pointer' }}
                                      icon={`mdi:${hotel.selected ? 'bookmark' : 'bookmark-outline'}`}
                                    />
                                  </Box>
                                  <Typography variant='body2'>Lorem ipsum dolor sit amet</Typography>
                                  <Typography variant='body2'>Room Prices - {hotel.price} INR</Typography>
                                  {/* {console.log(
                                    selectedHotelDetail ? selectedHotelDetail.id != hotel.id : Number(rooms) == 0
                                  )} */}
                                  <Button
                                    disabled={
                                      Number(rooms) == 0
                                        ? true
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
                                      : selectedHotelDetail.id == hotel.id
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
        handleClose={handleCloseRoomDialog}
        rooms={rooms}
        selectedHotel={selectedHotel}
        selectedHotelDetail={selectedHotelDetail}
        roomsList={roomsList}
        hotelRate={hotelRate}
        totalRooms={totalRooms}
      />
    </Dialog>
  )
}

export default HotelDialog
