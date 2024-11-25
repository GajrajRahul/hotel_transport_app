import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { useTheme } from '@mui/material'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import CitiesDialog from '../dialog/CitiesDialog'
import HotelDialog from '../dialog/HotelDialog'

const icons = {
  rooms: 'meeting-room-outline',
  extraBed: 'bed-double-outline',
  breakfast: 'free-breakfast-outline',
  lunch: 'lunch',
  dinner: 'dinner-outline'
}

const HotelInfoStep = props => {
  const {
    onSubmit,
    hotelErrors,
    setHotelValue,
    hotelControl,
    cities,
    travelDates,
    handleHotelSubmit,
    handleBack,
    defaultHotelInfoValues,
    hotelRate,
    roomsList
  } = props

  const [openCitiesDialog, setOpenCitiesDialog] = useState(false)
  const [openHotelDialog, setOpenHotelDialog] = useState(false)
  const [openEditHotelDialog, setOpenEditHotelDialog] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedHotelInfo, setSelectedHotelInfo] = useState(defaultHotelInfoValues)
  const [expanded, setExpanded] = useState('panel0')
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const theme = useTheme()

  const expandIcon = value => (
    <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} color={theme.palette.primary.main} />
  )

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleDeleteCityHotel = (cityId, idToDelete) => {
    setHotelValue(
      'cities',
      cities.map(city =>
        city.id == cityId ? { ...city, info: city.info.filter(data => data.id != idToDelete) } : city
      )
    )
  }

  const handleDeleteCity = cityIdToDelete => {
    setHotelValue(
      'cities',
      cities.filter(city => city.id != cityIdToDelete)
    )
  }

  const handleOpenMenu = (event, city, hotel) => {
    setSelectedCity(city)
    setSelectedHotelInfo(hotel)
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenCitiesDialog = () => {
    setOpenCitiesDialog(true)
  }

  const handleCloseCitiesDialog = () => {
    setOpenCitiesDialog(false)
  }

  const handleOpenEditHotelDialog = () => {
    handleCloseMenu()
    setOpenEditHotelDialog(true)
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

  const handleCloseHotelDialog = () => {
    setSelectedCity(null)
    setOpenHotelDialog(false)
  }

  return (
    <>
      <form key={1} onSubmit={handleHotelSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(hotelErrors.cities)}>
                Cities
              </InputLabel>
              <Controller
                name='cities'
                control={hotelControl}
                rules={{ required: 'This field is required' }}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    value={value.map(item => {
                      return item.label
                        ? item.label
                            .split('_')
                            .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                            .join(' ')
                        : ''
                    })}
                    label='Cities'
                    onClick={handleOpenCitiesDialog}
                    id='stepper-linear-personal-cities'
                    error={Boolean(hotelErrors.cities)}
                    startAdornment={
                      <InputAdornment position='start'>
                        <Icon icon='mdi:location-outline' color={theme.palette.primary.main} />
                      </InputAdornment>
                    }
                  />
                )}
              />
              {hotelErrors.cities && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-first-name'>
                  {hotelErrors.cities.message}
                </FormHelperText>
              )}
            </FormControl>
            <Icon
              icon='mdi:map-location-add'
              fontSize='2.5rem'
              color={theme.palette.primary.main}
              style={{ cursor: 'pointer' }}
              onClick={handleOpenCitiesDialog}
            />
          </Grid>
          {cities.map((city, index) => (
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
                    <Icon
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteCity(city.id)
                      }}
                      icon='mdi:delete-outline'
                      color={theme.palette.primary.main}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {city.info.map(data => (
                      <Grid key={data.id} item xs={12} sm={3}>
                        <Card>
                          <CardMedia sx={{ height: '9.375rem' }} image={`/images/hotels/${data.hotel.image}.png`}>
                            <IconButton
                              aria-label='more'
                              id='long-button'
                              aria-controls={isMenuOpen ? 'long-menu' : undefined}
                              aria-expanded={isMenuOpen ? 'true' : undefined}
                              aria-haspopup='true'
                              onClick={e => {
                                handleOpenMenu(e, city, data)
                              }}
                              sx={{ float: 'right', mt: '10px', color: 'white', cursor: 'pointer' }}
                            >
                              <Icon icon='mdi:more-vert' fontSize='2rem' />
                            </IconButton>
                            <Menu
                              id='long-menu'
                              MenuListProps={{
                                'aria-labelledby': 'long-button'
                              }}
                              anchorEl={anchorEl}
                              open={isMenuOpen}
                              onClose={handleCloseMenu}
                              PaperProps={{
                                style: {
                                  maxHeight: 216,
                                  width: '15ch'
                                }
                              }}
                            >
                              <MenuItem sx={{ display: 'flex', gap: 2 }} onClick={handleOpenEditHotelDialog}>
                                <Icon color={theme.palette.primary.main} icon='mdi:pencil-outline' />
                                Edit
                              </MenuItem>
                              <MenuItem
                                sx={{ display: 'flex', gap: 2 }}
                                onClick={() => handleDeleteCityHotel(city.id, data.id)}
                              >
                                <Icon color={theme.palette.primary.main} icon='mdi:delete-outline' />
                                Delete
                              </MenuItem>
                            </Menu>
                          </CardMedia>
                          <CardContent sx={{ p: theme => `${theme.spacing(3, 3, 4)} !important` }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon='mdi:room-service-outline' fontSize='2rem' />
                                <Box>
                                  <Typography fontSize={14} fontWeight={600}>
                                    {data.hotel.name}
                                  </Typography>
                                  <Typography fontSize={12}>{data.hotel.location}</Typography>
                                </Box>
                              </Box>
                              <Chip
                                sx={{ fontSize: '9px', color: '#52AFB3', backgroundColor: '#84C9CC33' }}
                                size='small'
                                label='PREMIUM HOTEL'
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                              {Object.keys(data).map(
                                item =>
                                  !['id', 'checkInCheckOut', 'daysNights', 'hotel'].includes(item) &&
                                  data[item] && (
                                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Icon icon={`mdi:${icons[item]}`} fontSize='1.25rem' />
                                      <Typography fontSize={13}>
                                        {item == 'rooms'
                                          ? `${data[item]} Room`
                                          : item == 'extraBed'
                                          ? `${data[item]} Extra Bed`
                                          : `${item[0].toUpperCase()}${item.slice(1)}`}
                                      </Typography>
                                    </Box>
                                  )
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={3}>
                      <Card
                        sx={{ borderRadius: '15px', cursor: 'pointer' }}
                        onClick={() => handleOpenHotelDialog(city)}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 3,
                            height: '250px'
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
                    <Grid item xs={12} sm={3}>
                      <Card sx={{ borderRadius: '15px' }}>
                        <CardContent
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 3,
                            height: '250px',
                            borderRadius: '15px'
                          }}
                        >
                          <Icon icon='mdi:flag-outline' color={theme.palette.primary.main} fontSize='3.5rem' />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Icon icon='mdi:plus' color={theme.palette.primary.main} />
                            <Typography fontWeight={600}>Add Attractions</Typography>
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
            <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
              Back
            </Button>
            <Button size='large' type='submit' variant='contained'>
              Next
            </Button>
          </Grid>
        </Grid>
        <CitiesDialog
          open={openCitiesDialog}
          handleClose={handleCloseCitiesDialog}
          cities={cities}
          setHotelValue={setHotelValue}
          hotelRate={hotelRate}
        />
      </form>
      <HotelDialog
        open={openHotelDialog}
        handleClose={handleCloseHotelDialog}
        travelDates={travelDates}
        cities={cities}
        setHotelValue={setHotelValue}
        selectedCity={selectedCity}
        selectedHotelInfo={defaultHotelInfoValues}
        isEdit={false}
        hotelRate={hotelRate}
        roomsList={roomsList}
      />
      <HotelDialog
        open={openEditHotelDialog}
        handleClose={handleCloseEditHotelDialog}
        travelDates={travelDates}
        cities={cities}
        setHotelValue={setHotelValue}
        selectedCity={selectedCity}
        selectedHotelInfo={selectedHotelInfo}
        isEdit={true}
        hotelRate={hotelRate}
        roomsList={roomsList}
      />
    </>
  )
}

export default HotelInfoStep
