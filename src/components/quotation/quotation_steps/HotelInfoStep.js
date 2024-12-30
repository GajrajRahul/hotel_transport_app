import React, { useEffect, useMemo, useState } from 'react'
import { addDays, format } from 'date-fns'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { useTheme } from '@mui/material'

import Icon from 'src/@core/components/icon'

import CitiesDialog from '../dialog/CitiesDialog'
import HotelDialog from '../dialog/HotelDialog'
import CommonDialog from 'src/components/common/dialog'

let defaultHotelInfoValues = {
  checkInCheckOut: [undefined, undefined],
  daysNights: '',
  breakfast: true,
  lunch: true,
  dinner: true,
  rooms: '0',
  extraBed: '0',
  child: '0',
  adult: '0',
  persons: '',
  hotel: null
}

const HotelInfoStep = props => {
  const { onSubmit, handleBack } = props

  const hotelSheetData = useSelector(state => state.hotelRateData)

  const [selectedCitiesHotels, setSelectedCitiesHotels] = useState(
    localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
  )

  const [openCitiesDialog, setOpenCitiesDialog] = useState(false)
  const [openHotelDialog, setOpenHotelDialog] = useState(false)
  const [openEditHotelDialog, setOpenEditHotelDialog] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedHotelInfo, setSelectedHotelInfo] = useState(defaultHotelInfoValues)
  const [expanded, setExpanded] = useState('panel0')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const theme = useTheme()

  const citiesList = useMemo(() => {
    return hotelSheetData.hotelsRate
      ? Object.keys(hotelSheetData.hotelsRate).map((city, index) => {
          return { id: index, label: city, info: [] }
        })
      : []
  }, [])

  const expandIcon = value => (
    <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} color={theme.palette.primary.main} />
  )

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleDeleteCityHotel = (cityId, idToDelete) => {
    setSelectedCitiesHotels(prev =>
      prev.map(city =>
        city.id == cityId ? { ...city, info: city.info.filter(hotel => hotel.id != idToDelete) } : city
      )
    )
  }

  const handleDeleteCity = () => {
    if (selectedCity) {
      const remainingSelectedCitiesHotels = selectedCitiesHotels.filter(city => city.id != selectedCity.id)
      const selectedStates = localStorage.getItem('selectedStates')
        ? JSON.parse(localStorage.getItem('selectedStates'))
        : []
      const validCityLabels = remainingSelectedCitiesHotels.map(item => item.label)

      const updatedSelectedStates = selectedStates
        .map(state => {
          const filteredCities = state.cities.filter(city => validCityLabels.includes(city.name))
          return {
            ...state,
            cities: filteredCities
          }
        })
        .filter(state => state.cities.length > 0)
      localStorage.setItem('selectedStates', JSON.stringify(updatedSelectedStates))
      setSelectedCitiesHotels(remainingSelectedCitiesHotels)
    } else {
      localStorage.setItem('selectedState', JSON.stringify([]))
      setSelectedCitiesHotels([])
    }
    handleDeleteDialogClose()
  }

  const handleOpenCitiesDialog = () => {
    setOpenCitiesDialog(true)
  }

  const handleCloseCitiesDialog = () => {
    setOpenCitiesDialog(false)
  }

  const handleCloseEditHotelDialog = () => {
    setSelectedCity(null)
    setSelectedHotelInfo(defaultHotelInfoValues)
    setOpenEditHotelDialog(false)
  }

  const handleOpenHotelDialog = city => {
    setSelectedCity(city)
    setOpenHotelDialog(true)
  }

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setSelectedCity(null)
    setIsDeleteDialogOpen(false)
  }

  const handleCloseHotelDialog = () => {
    setSelectedCity(null)
    setOpenHotelDialog(false)
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
                }
                else {
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
        {/* <Grid item xs={12}>
          <Box
            sx={{
              border: '1px solid #9A9A9A',
              borderRadius: '6px',
              position: 'relative',
              height: '55.7px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer',
              px: 3
            }}
            onClick={handleOpenCitiesDialog}
          >
            <Typography
              variant='caption'
              sx={{ position: 'absolute', top: -11.5, left: 10, background: 'white', px: 1 }}
            >
              Add City
            </Typography>
            <Icon icon='mdi:track' color={theme.palette.primary.main} style={{ position: 'absolute' }} />
            <Stack direction='row' spacing={1} sx={{ position: 'absolute', left: '55px' }}>
              {selectedCitiesHotels.map(city => (
                <Chip
                  key={city.id}
                  label={city.label
                    .split('_')
                    .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                    .join(' ')}
                  sx={{
                    backgroundColor: theme => theme.palette.primary.light,
                    color: theme => theme.palette.primary.dark
                  }}
                  size='small'
                />
              ))}
            </Stack>
            <Icon
              icon='mdi:map-location-add'
              color={theme.palette.primary.main}
              style={{ position: 'absolute', right: '10px' }}
            />
          </Box>
        </Grid> */}
        {selectedCitiesHotels.map((city, index) => (
          <Grid item xs={12} key={index}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
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
                <Box sx={{ width: '100%', backgroundColor: '#FFFFFF80', p: '10px 15px', display: 'flex', gap: 3 }}>
                  <Typography>
                    {city.label
                      ? city.label
                          .split('_')
                          .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                          .join(' ')
                      : ''}
                  </Typography>
                  {/* <Icon
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteCity(city.id)
                    }}
                    icon='mdi:delete-outline'
                    color={theme.palette.primary.main}
                  /> */}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {city.info.map(data => (
                    <Grid key={data.id} item xs={12} sm={4}>
                      <Card sx={{ borderRadius: '15px' }}>
                        <CardMedia sx={{ height: '9.375rem' }} image={`/images/hotels/jaipur.jpg`} />
                        <CardContent sx={{ p: theme => `${theme.spacing(3, 3, 4)} !important` }}>
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
                                {data.hotel.name ? `${data.hotel.name.slice(0, 18)}...` : ''}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                              <Typography sx={{ color: 'black' }} variant='h6'>
                                {data.hotel.price}
                              </Typography>
                              <Typography variant='caption' sx={{ color: theme => theme.palette.primary.main }}>
                                /Room
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ mt: 2, color: 'black' }} />
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mt: 3, gap: 3 }}
                          >
                            <Box
                              sx={{
                                pl: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Icon fontSize='20px' icon='mdi:double-user' />
                                <Typography fontSize={14}>
                                  {data.adult != '0' && data.child != '0'
                                    ? `${data.adult}A, ${data.child}C`
                                    : data.adult != '0'
                                    ? `${data.adult}A`
                                    : `${data.child}C`}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Icon fontSize='20px' icon='mdi:custom-door-open' />
                                <Typography fontSize={14}>
                                  {data.rooms} {data.rooms == '1' ? 'Room' : 'Rooms'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                // borderLeft: '1px solid #9A9A9A',
                                pl: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Icon fontSize='20px' icon='mdi:custom-hotel' />
                                <Typography fontSize={14}>{data.hotel.type}</Typography>
                              </Box>
                              {data.extraBed != '0' ? (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Icon fontSize='20px' icon='mdi:double-bed' />
                                  <Typography fontSize={14}>{data.extraBed} Extra Bed</Typography>
                                </Box>
                              ) : data.breakfast || data.lunch || data.dinner ? (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Icon fontSize='20px' icon='mdi:plate-eating' />
                                  <Typography fontSize={14}>
                                    {data.breakfast && data.lunch && data.dinner
                                      ? 'BB | HB | FB'
                                      : data.breakfast && data.lunch
                                      ? 'BB | HB'
                                      : data.breakfast && data.dinner
                                      ? 'BB | FB'
                                      : data.lunch && data.dinner
                                      ? 'HB | FB'
                                      : data.breakfast
                                      ? 'BB'
                                      : data.lunch
                                      ? 'HB'
                                      : 'FB'}
                                  </Typography>
                                </Box>
                              ) : (
                                <></>
                              )}
                            </Box>
                            <Box
                              sx={{
                                // borderLeft: '1px solid #9A9A9A',
                                pl: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                pr: 5
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Icon fontSize='20px' icon='mdi:curtains-open' />
                                <Typography fontSize={14}>
                                  {data.hotel['Base Catagory'] ? 'Base Catagory' : 'Base Category'}
                                </Typography>
                              </Box>
                              {data.extraBed != '0' && (data.breakfast || data.lunch || data.dinner) ? (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Icon fontSize='20px' icon='mdi:plate-eating' />
                                  <Typography fontSize={14}>
                                    {data.breakfast && data.lunch && data.dinner
                                      ? 'BB | HB | FB'
                                      : data.breakfast && data.lunch
                                      ? 'BB | HB'
                                      : data.breakfast && data.dinner
                                      ? 'BB | FB'
                                      : data.lunch && data.dinner
                                      ? 'HB | FB'
                                      : data.breakfast
                                      ? 'BB'
                                      : data.lunch
                                      ? 'HB'
                                      : 'FB'}
                                  </Typography>
                                </Box>
                              ) : (
                                <></>
                              )}
                            </Box>
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
                                {format(new Date(data.checkInCheckOut[0]), 'dd MMM yyyy')} -{' '}
                                {format(new Date(data.checkInCheckOut[1]), 'dd MMM yyyy')}{' '}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Icon fontSize='20px' icon='mdi:night-day' />
                              {/* {console.log(data)} */}
                              <Typography fontSize={14}>
                                {/* {format(new Date(data.checkInCheckOut[0]), 'dd MM yyyy')} -{' '}
                                  {format(new Date(data.checkInCheckOut[1]), 'dd MM yyyy')}{' '} */}
                                {data.daysNights}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, gap: 3 }}>
                            <Button
                              fullWidth
                              variant='contained'
                              onClick={() => {
                                setSelectedCity(city)
                                setSelectedHotelInfo(data)
                                setOpenEditHotelDialog(true)
                              }}
                            >
                              Edit Hotel
                            </Button>
                            <Button
                              fullWidth
                              variant='outlined'
                              onClick={() => handleDeleteCityHotel(city.id, data.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: '15px', cursor: 'pointer' }} onClick={() => handleOpenHotelDialog(city)}>
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
      {/* <form key={1}>
      </form> */}
      <CitiesDialog
        open={openCitiesDialog}
        handleClose={handleCloseCitiesDialog}
        selectedCitiesHotels={selectedCitiesHotels}
        setSelectedCitiesHotels={setSelectedCitiesHotels}
      />

      <HotelDialog
        setSelectedCitiesHotels={setSelectedCitiesHotels}
        selectedCitiesHotels={selectedCitiesHotels}
        selectedHotelInfo={defaultHotelInfoValues}
        handleClose={handleCloseHotelDialog}
        // travelDates={travelDates}
        // setHotelValue={setHotelValue}
        selectedCity={selectedCity}
        open={openHotelDialog}
        isEdit={false}
      />

      <HotelDialog
        setSelectedCitiesHotels={setSelectedCitiesHotels}
        selectedCitiesHotels={selectedCitiesHotels}
        selectedHotelInfo={selectedHotelInfo}
        handleClose={handleCloseEditHotelDialog}
        // cities={cities}
        // setHotelValue={setHotelValue}
        selectedCity={selectedCity}
        open={openEditHotelDialog}
        isEdit={true}
      />
      <CommonDialog
        open={isDeleteDialogOpen}
        onCancel={handleDeleteDialogClose}
        onSuccess={handleDeleteCity}
        title='Confirm Deletion'
        description='Are you sure you want to delete the selected city(ies)? All related data will be permanently removed.'
      />
    </>
  )
}

export default HotelInfoStep
