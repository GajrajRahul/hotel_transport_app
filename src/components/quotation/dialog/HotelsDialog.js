import React, { Fragment, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import TabContext from '@mui/lab/TabContext'
import MuiTabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import { styled, useTheme } from '@mui/material/styles'

import HotelInfoDialog from './HotelInfoDialog'

const defaultHotelInfoValues = {
  checkInCheckOut: [undefined, undefined],
  daysNights: '',
  meals: [],
  persons: [],
  rooms: [],
  extraBed: '0'
}

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    borderRadius: theme.shape.borderRadius
  }
}))

const getHotelsListData = cityHotelData => {
  const groupedHotels = cityHotelData.reduce((acc, hotel) => {
    // Check if the type already exists in the accumulator
    if (!acc[hotel.type]) {
      acc[hotel.type] = [] // Initialize an array for the type
    }
    acc[hotel.type].push(hotel) // Add the hotel to the corresponding type group
    return acc
  }, {})

  // Convert the grouped object into an array of arrays
  const hotels = Object.keys(groupedHotels).map(type => ({
    type,
    hotels: groupedHotels[type]
  }))

  return hotels
}

const HotelsDialog = props => {
  const { open, onClose, isEdit, selectedCity, selectedHotelInfo, selectedCitiesHotels, setSelectedCitiesHotels } =
    props
  const hotelSheetInfo = useSelector(state => state.hotelsInfo)
  // console.log(selectedCity)

  const [isHotelInfoDialogOpen, setIsHotelDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(selectedHotelInfo)
  const [tabValue, setTabValue] = useState('0')
  const [hotelInfo, setHotelInfo] = useState({})

  const hotelsList = useMemo(() => {
    if (selectedCity) {
      const currentCityHotelData = hotelSheetInfo.find(cityInfo => cityInfo.city == selectedCity.label)

      if (currentCityHotelData) {
        return getHotelsListData(currentCityHotelData.hotels)
      }
      return []
    }
    return []
  }, [selectedCity])

  const handleOpenHotelInfoDialog = hotel => {
    // console.log(hotel)
    setSelectedHotel(hotel)
    setIsHotelDialogOpen(true)
  }

  const handleCloseHotelInfoDialog = () => {
    setIsHotelDialogOpen(false)
    setSelectedHotel(null)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSubmit = () => {
    console.log(hotelInfo)
    console.log(selectedCity)
    console.log(selectedHotelInfo)
    const { name, type, image, persons, rooms, meals, extraBed, checkInCheckOut, roomPrice } = hotelInfo
    let personsArr = []
    persons.map(person => {
      const count = person.count
      const type = person.type
      if (personCount > 0) {
        personsArr.push(`${count}${type == 'Adult' ? 'A' : type == 'Child' ? 'C' : 'I'}`)
      }
    })

    const cityToFind = selectedCitiesHotels.find(city => city.label == selectedCity.label)
    if (isEdit) {
      const updatedCities = selectedCitiesHotels.map(city =>
        city.label == selectedCity.label
          ? {
              ...city,
              info: city.info.map(currHotel =>
                currHotel.id == selectedHotelInfo.id
                  ? {
                      ...currHotel,
                      name,
                      type,
                      image,
                      roomPrice,
                      persons: personsArr,
                      rooms,
                      meals,
                      extraBed,
                      checkInCheckOut
                    }
                  : currHotel
              )
            }
          : city
      )

      setSelectedCitiesHotels(updatedCities)
    } else {
      if (cityToFind) {
        const updatedCities = selectedCitiesHotels.map(city =>
          city.label == selectedCity.label
            ? {
                ...city,
                info: [
                  ...city.info,
                  {
                    id: Date.now(),
                    name,
                    type,
                    image,
                    roomPrice,
                    persons: personsArr,
                    rooms,
                    meals,
                    extraBed,
                    checkInCheckOut
                  }
                ]
              }
            : city
        )
        setSelectedCitiesHotels(updatedCities)
      }
    }
  }

  const resetFields = () => {
    setHotelInfo({})
    setTabValue('0')
    onClose()
  }

  // console.log('hotelsList: ', hotelsList)
  return (
    <Dialog fullWidth maxWidth='laptopSm' open={open} onClose={resetFields}>
      <HotelInfoDialog
        onClose={handleCloseHotelInfoDialog}
        selectedHotel={selectedHotel}
        open={isHotelInfoDialogOpen}
        setHotelInfo={setHotelInfo}
        hotelInfo={hotelInfo}
      />
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 0
          }
        }}
      >
        Hotel Category
        <DialogContentText>Need To Select at least 1 Hotel</DialogContentText>
      </DialogTitle>
      <DialogContent sx={{ pt: 0, mt: 3 }}>
        <TabContext value={tabValue}>
          <TabList
            onChange={handleTabChange}
            aria-label='customized tabs example'
            sx={{ backgroundColor: '#EAEBF0', borderRadius: '5px' }}
          >
            {hotelsList.map((hotelsInfo, idx) => (
              <Tab
                key={hotelsInfo.type}
                value={idx.toString()}
                label={hotelsInfo.type ?? ''}
                sx={{ minWidth: 1 / hotelsList.length }}
              />
            ))}
          </TabList>
          {hotelsList.map((hotelsInfo, idx) => (
            <TabPanel key={hotelsInfo.type} value={idx.toString()} sx={{ mt: 3 }}>
              <Grid container spacing={6}>
                {hotelsInfo.hotels.map((hotel, index) => (
                  <Grid key={index} item xs={12} sm={6}>
                    <Card>
                      <CardMedia sx={{ height: '9.375rem' }} image={hotel.image || '/images/hotels/jaipur.jpg'} />
                      <CardContent
                        sx={{
                          p: theme => `${theme.spacing(3, 5, 4)} !important`
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Typography variant='h6' sx={{ mb: 2 }}>
                              {hotel.name ? `${hotel.name.slice(0, 18)}...` : ''}
                            </Typography>
                          </Box>
                          {hotel.minMaxRoomPrice.length > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'baseline'
                              }}
                            >
                              {hotel.minMaxRoomPrice[0].type == hotel.minMaxRoomPrice[1].type ? (
                                <Typography variant='h6'>
                                  <sup>₹</sup>
                                  {hotel.minMaxRoomPrice[0].price}
                                </Typography>
                              ) : (
                                <Typography variant='h6'>
                                  <sup>₹</sup>
                                  {hotel.minMaxRoomPrice[0].price} - <sup>₹</sup>
                                  {hotel.minMaxRoomPrice[1].price}
                                </Typography>
                              )}
                              <Typography variant='caption'>/Room</Typography>
                            </Box>
                          )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {hotelInfo.name ? (
                          <Button
                            variant='contained'
                            sx={{
                              mt: 1,
                              width: '100%',
                              textTransform: 'none'
                            }}
                            disabled={hotelInfo.name != hotel.name}
                            onClick={() => handleOpenHotelInfoDialog(hotel)}
                          >
                            {hotelInfo.name == hotel.name ? 'Update Room' : 'Create Room'}
                          </Button>
                        ) : (
                          <Button
                            variant='contained'
                            sx={{
                              mt: 1,
                              width: '100%',
                              textTransform: 'none'
                            }}
                            onClick={() => handleOpenHotelInfoDialog(hotel)}
                          >
                            Select Room
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={resetFields}>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HotelsDialog
