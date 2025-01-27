import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { subDays } from 'date-fns'

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
  const {
    open,
    onClose,
    isEdit,
    selectedCity,
    selectedHotelInfo,
    selectedCitiesHotels,
    setSelectedCitiesHotels,
    selectedDates
  } = props
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

  useEffect(() => {
    if (isEdit) {
      setHotelInfo(selectedHotelInfo)
    } else {
      setHotelInfo({})
    }
  }, [isEdit])
  // console.log('selectedHotelInfo: ', selectedHotelInfo)
  // console.log('hotelInfo: ', hotelInfo)
  // console.log('hotelsList: ', hotelsList)

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
    // console.log('hotelInfo: ', hotelInfo)
    // console.log(selectedCity)
    // console.log(selectedHotelInfo)
    const { name, type, image, rooms, meals, extraBed, checkInCheckOut, adult, child, infant, daysNights } =
      hotelInfo
    // console.log('rooms: ', rooms)

    let minRoomPrice = 1000000000
    let maxRoomPrice = 0

    rooms.forEach(room => {
      if (Number(room.price) < minRoomPrice) {
        minRoomPrice = Number(room.price)
      }
      if (Number(room.price) > maxRoomPrice) {
        maxRoomPrice = Number(room.price)
      }
    })

    let currData = {
      name,
      type,
      image,
      rooms,
      meals,
      extraBed,
      daysNights,
      checkInCheckOut,
      roomsPrice: minRoomPrice == maxRoomPrice ? [minRoomPrice] : [minRoomPrice, maxRoomPrice]
    }

    selectedDates.current = [
      ...selectedDates.current,
      { start: new Date(subDays(new Date(checkInCheckOut[0]), 1)), end: new Date(subDays(new Date(checkInCheckOut[1]), 1)) }
    ]
    if (adult) {
      currData.adult = adult
    }
    if (child) {
      currData.child = child
    }
    if (infant) {
      currData.infant = infant
    }

    const cityToFind = selectedCitiesHotels.find(city => city.label == selectedCity.label)
    // console.log('cityToFind: ', cityToFind)
    if (isEdit) {
      // console.log('isEdit: ', isEdit)
      const updatedCities = selectedCitiesHotels.map(city =>
        city.label == selectedCity.label
          ? {
              ...city,
              info: city.info.map(currHotel =>
                currHotel.id == selectedHotelInfo.id
                  ? {
                      ...currHotel,
                      ...currData
                    }
                  : currHotel
              )
            }
          : city
      )

      setSelectedCitiesHotels(updatedCities)
    } else {
      // console.log('isEdit: ', isEdit)
      if (cityToFind) {
        const updatedCities = selectedCitiesHotels.map(city =>
          city.label == selectedCity.label
            ? {
                ...city,
                info: [
                  ...city.info,
                  {
                    id: Date.now(),
                    ...currData
                  }
                ]
              }
            : city
        )
        // console.log('updatedCities: ', updatedCities)
        setSelectedCitiesHotels(updatedCities)
      }
    }
    resetFields()
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
        selectedDates={selectedDates}
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
                                  {hotel.minMaxRoomPrice[0].price[0]}xxx
                                </Typography>
                              ) : (
                                <Typography variant='h6'>
                                  <sup>₹</sup>
                                  {hotel.minMaxRoomPrice[0].price[0]}xxx - <sup>₹</sup>
                                  {hotel.minMaxRoomPrice[1].price[0]}xxx
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
