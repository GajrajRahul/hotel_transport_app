import React, { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { addDays, format } from 'date-fns'

import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Autocomplete from '@mui/material/Autocomplete'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

import { useTheme } from '@mui/material'

import Icon from 'src/@core/components/icon'

import CommonDialog from 'src/components/common/dialog'
import HotelsDialog from '../dialog/HotelsDialog'
// import HotelsDialog from '../dialog/HotelsDialog'

const HotelInfoStep = props => {
  const { onSubmit, handleBack } = props
  const hotelSheetInfo = useSelector(state => state.hotelsInfo)

  const [selectedCitiesHotels, setSelectedCitiesHotels] = useState(
    localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
  )

  const [isEditHotelDialogOpen, setIsEditHotelDialogOpen] = useState(false)
  const [isAddHotelDialogOpen, setIsAddHotelDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedHotelInfo, setSelectedHotelInfo] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [expanded, setExpanded] = useState('panel0')
  const selectedDates = useRef([])
  const theme = useTheme()

  const citiesList = useMemo(() => {
    return hotelSheetInfo.map((cityInfo, index) => {
      // console.log("cityInfo: ", cityInfo)
      return {
        id: index,
        label: cityInfo.city,
        state: cityInfo.state,
        info: []
      }
    })
  }, [])

  const expandIcon = value => (
    <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} color={theme.palette.primary.main} />
  )

  const handleAddOpenHotelDialog = city => {
    setSelectedCity(city)
    setIsAddHotelDialogOpen(true)
  }

  const handleAddCloseHotelDialog = () => {
    setSelectedCity(null)
    setIsAddHotelDialogOpen(false)
  }

  const handleEditOpenHotelDialog = (city, hotel) => {
    setSelectedCity(city)
    setSelectedHotelInfo(hotel)
    setIsEditHotelDialogOpen(true)
  }

  const handleEditCloseHotelDialog = () => {
    setSelectedCity(null)
    setSelectedHotelInfo(null)
    setIsEditHotelDialogOpen(false)
  }

  const handleDeleteCity = () => {
    if (selectedCity) {
      const remainingSelectedCitiesHotels = selectedCitiesHotels.filter(city => city.id != selectedCity.id)
      const deletedCity = selectedCitiesHotels.find(city => city.id == selectedCity.id)

      const deletedDates = deletedCity.info.map(info => ({
        start: info.checkInCheckOut[0]
        // end: info.checkInCheckOut[1]
      }))

      // const filteredDate = selectedDates.current.filter(item => {
      //   return !deletedDates.some(deleted => new Date(item.start).getTime() == new Date(deleted.start).getTime())
      // })
      const filteredDate = selectedDates.current.filter(item => {
        return !deletedDates.some(deleted => new Date(addDays(new Date(item.start), 1)).getTime() == new Date(deleted.start).getTime())
      })

      selectedDates.current = filteredDate
      setSelectedCitiesHotels(remainingSelectedCitiesHotels)
    } else {
      selectedDates.current = []
      localStorage.setItem('selectedState', JSON.stringify([]))
      setSelectedCitiesHotels([])
    }
    handleDeleteDialogClose()
  }

  const handleDeleteCityHotel = (cityName, hotelId) => {
    const city = selectedCitiesHotels.find(city => city.label == cityName)
    console.log(city)
    if (city) {
      const hotel = city.info.find(hotel => hotel.id == hotelId)
      console.log(hotel.checkInCheckOut[0])
      console.log("hotel: ", hotel)
      const updatedDates = selectedDates.current.filter(
        date => new Date(addDays(new Date(date.start), 1)).getTime() != new Date(hotel.checkInCheckOut[0]).getTime()
      )
      console.log("updatedDates: ", updatedDates)
      selectedDates.current = updatedDates
    }
    setSelectedCitiesHotels(prev =>
      prev.map(city =>
        city.label == cityName ? { ...city, info: city.info.filter(hotel => hotel.id != hotelId) } : city
      )
    )
  }

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setSelectedCity(null)
    setIsDeleteDialogOpen(false)
  }

  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const onHotelInfoSubmit = data => {
    if (selectedCitiesHotels.length == 0) {
      toast.error('City and Hotel is Required')
      return
    }

    const emptyCitisList = selectedCitiesHotels.filter(city => city.info.length == 0)
    if (emptyCitisList.length > 0) {
      toast.error('City and Hotel is Required')
      return
    }
    localStorage.setItem('citiesHotels', JSON.stringify(selectedCitiesHotels))
    onSubmit()
  }

  const onHotelInfoBack = () => {
    localStorage.setItem('citiesHotels', JSON.stringify(selectedCitiesHotels))
    handleBack()
  }

  return (
    <>
      <CommonDialog
        open={isDeleteDialogOpen}
        onCancel={handleDeleteDialogClose}
        onSuccess={handleDeleteCity}
        title='Confirm Deletion'
        description='Are you sure you want to delete the selected city(ies)? All related data will be permanently removed.'
      />
      <HotelsDialog
        setSelectedCitiesHotels={setSelectedCitiesHotels}
        selectedCitiesHotels={selectedCitiesHotels}
        onClose={handleAddCloseHotelDialog}
        selectedCity={selectedCity}
        open={isAddHotelDialogOpen}
        selectedDates={selectedDates}
        isEdit={false}
      />
      {isEditHotelDialogOpen && (
        <HotelsDialog
          setSelectedCitiesHotels={setSelectedCitiesHotels}
          selectedCitiesHotels={selectedCitiesHotels}
          selectedHotelInfo={selectedHotelInfo}
          onClose={handleEditCloseHotelDialog}
          open={isEditHotelDialogOpen}
          selectedCity={selectedCity}
          selectedDates={selectedDates}
          isEdit={true}
        />
      )}
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            limitTags={2}
            id='multiple-limit-cities'
            isOptionEqualToValue={(option, value) => option.label == value.label}
            value={selectedCitiesHotels}
            onChange={(e, option, response, value) => {
              if (response == 'removeOption' || response == 'clear') {
                if (response == 'removeOption') {
                  setSelectedCity(value.option)
                  handleDeleteDialogOpen()
                } else {
                  handleDeleteDialogOpen()
                }
              } else {
                setSelectedCitiesHotels(option)
              }
            }}
            options={citiesList}
            getOptionLabel={option => (option.label ? `${option.label[0].toUpperCase()}${option.label.slice(1)}` : '')}
            renderInput={params => <TextField {...params} label='Add Cities' />}
            fullWidth
            sx={{
              '& .MuiChip-root': { backgroundColor: theme => theme.palette.primary.light },
              '& .MuiSvgIcon-root': { fill: theme => theme.palette.primary.dark }
            }}
            disableCloseOnSelect
          />
        </Grid>
        {/* {console.log('selectedCitiesHotels: ', selectedCitiesHotels)} */}

        {selectedCitiesHotels.map((city, index) => (
          <Grid key={index} item xs={12}>
            {/* {console.log(city)} */}
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              sx={{
                '&.MuiAccordion-root': {
                  borderRadius: '6px'
                },
                '&.MuiAccordion-root::before': {
                  backgroundColor: 'transparent'
                },
                backgroundColor: theme => theme.palette.primary.light
              }}
            >
              <AccordionSummary
                sx={{
                  '&.MuiAccordionSummary-root': {
                    px: '10px'
                  },
                  '& .MuiAccordionSummary-content': {
                    my: '10px'
                  }
                }}
                id={`customized-panel-header-${index}`}
                expandIcon={
                  <Typography
                    sx={{
                      backgroundColor: '#FFFFFF80',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      px: 3
                    }}
                  >
                    {expandIcon(`panel${index}`)}
                  </Typography>
                }
                aria-controls={`customized-panel-content-${index}`}
              >
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: '#FFFFFF80',
                    p: '10px 15px',
                    display: 'flex',
                    gap: 3
                  }}
                >
                  <Typography>
                    {city.label
                      ? city.label
                          .split('_')
                          .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                          .join(' ')
                      : ''}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {city.info.map(hotel => (
                    <Grid key={hotel.id} item xs={12} sm={4}>
                      {/* {console.log('hotel: ', hotel)} */}
                      <Card sx={{ borderRadius: '15px' }}>
                        <CardMedia sx={{ height: '9.375rem' }} image={hotel.image || `/images/hotels/jaipur.jpg`} />
                        <CardContent
                          sx={{
                            p: theme => `${theme.spacing(3, 3, 4)} !important`
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Icon icon='mdi:custom-hotel' fontSize='1.725rem' />
                              <Typography sx={{ color: 'black' }} variant='h6'>
                                {hotel.name ? `${hotel.name.slice(0, 18)}...` : ''}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                              <Typography sx={{ color: 'black' }} variant='h6'>
                                {/* {console.log(hotel.roomsPrice)} */}
                                ₹{hotel.roomsPrice.map(price => `${price.toString()[0]}xxx`).join('-₹')}
                              </Typography>
                              <Typography variant='caption' sx={{ color: theme => theme.palette.primary.main }}>
                                /Room
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ mt: 2, color: 'black' }} />
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 3,
                              gap: 5
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Icon fontSize='20px' icon='mdi:double-user' />
                              <Typography fontSize={14}>
                                {/* {console.log('hotel: ', hotel)} */}
                                {(hotel.adult ?? 0) + (hotel.child ?? 0) + (hotel.infant ?? 0)} Travelers
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Icon fontSize='20px' icon='mdi:custom-door-open' />
                              <Typography fontSize={14}>
                                {hotel.rooms.map(room => room.count).reduce((acc, count) => acc + count, 0)} Rooms
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Icon fontSize='20px' icon='mdi:custom-hotel' />
                              <Typography fontSize={14}>{hotel.type}</Typography>
                            </Box>
                            {/* {console.log(hotel)} */}
                            {hotel.extraBed && hotel.extraBed != '0' ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center'
                                }}
                              >
                                <Icon fontSize='20px' icon='mdi:double-bed' />
                                <Typography fontSize={14}>{hotel.extraBed} Extra Bed</Typography>
                              </Box>
                            ) : hotel.meals.length > 0 ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center'
                                }}
                              >
                                <Icon fontSize='20px' icon='mdi:plate-eating' />
                                <Typography fontSize={14}>{hotel.meals.join(' | ')}</Typography>
                              </Box>
                            ) : (
                              <></>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Icon fontSize='20px' icon='mdi:curtains-open' />
                              <Typography fontSize={14}>Base Category</Typography>
                            </Box>
                            {hotel.extraBed && hotel.extraBed != '0' && hotel.meals.length > 0 ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center'
                                }}
                              >
                                <Icon fontSize='20px' icon='mdi:plate-eating' />
                                <Typography fontSize={14}>{hotel.meals.join(' | ')}</Typography>
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Box>
                          <Box
                            sx={{
                              mt: 4,
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: 'rgba(251, 118, 1, 0.15)',
                              p: 3,
                              flexWrap: 'wrap',
                              gap: 3
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Icon fontSize='20px' icon='mdi:checkin-calendar' />
                              <Typography fontSize={14}>
                                {format(new Date(hotel.checkInCheckOut[0]), 'dd MMM yyyy')} -
                                {format(new Date(hotel.checkInCheckOut[1]), 'dd MMM yyyy')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Icon fontSize='20px' icon='mdi:night-day' />
                              <Typography fontSize={14}>{hotel.daysNights}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, gap: 3 }}>
                            <Button
                              fullWidth
                              variant='contained'
                              onClick={() => {
                                handleEditOpenHotelDialog(city, hotel)
                              }}
                            >
                              Edit Hotel
                            </Button>
                            <Button
                              fullWidth
                              variant='outlined'
                              onClick={() => handleDeleteCityHotel(city.label, hotel.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{ borderRadius: '15px', cursor: 'pointer' }}
                      onClick={() => handleAddOpenHotelDialog(city)}
                    >
                      <CardContent
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: 3,
                          height: '407px'
                        }}
                      >
                        <Icon icon='mdi:hotel' color={theme.palette.primary.main} fontSize='3.5rem' />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Icon icon='mdi:plus' color={theme.palette.primary.main} />
                          <Typography fontWeight={600}>Add Hotel</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={onHotelInfoBack}>
            Back
          </Button>
          <Button size='large' variant='contained' onClick={onHotelInfoSubmit}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default HotelInfoStep
