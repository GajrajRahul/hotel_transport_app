import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { useLoadScript } from '@react-google-maps/api'

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
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { Chip, Divider, useTheme } from '@mui/material'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon'
import CustomInput from 'src/components/common/CustomInput'
import { BedCount, CancelTimeIcon, HotelName, HotelNameDark } from 'src/utils/icons'

// import CustomInput from 'src/components/common/CustomInput'

const getArhHotelsList = hotels => {
  let hotelCategoryList = []
  let citiesList = []

  let hotelsArr = []

  for (const [city, cityValue] of Object.entries(hotels)) {
    if (city && city.length > 0 && !citiesList.includes(city)) {
      citiesList.push(city)
    }

    for (const [hotelType, hotelInfo] of Object.entries(cityValue)) {
      if (hotelType && hotelType.length > 0 && !hotelCategoryList.includes(hotelType)) {
        hotelCategoryList.push(hotelType)
      }
      for (const [hotelName, hotelDetail] of Object.entries(hotelInfo)) {
        const minPrice = hotelDetail['minPrice']
        const maxPrice = hotelDetail['maxPrice']
        let rooomsList = []

        Object.keys(hotelDetail).map(hotel => {
          if (
            !['', 'breakfast', 'lunch', 'dinner', 'extrabed', 'minPrice', 'maxPrice', 'primeHotels'].includes(hotel) &&
            hotelDetail['primeHotels'] == 'TRUE'
          ) {
            rooomsList.push(hotel)
          }
        })

        if (hotelDetail['primeHotels'] == 'TRUE') {
          hotelsArr.push({
            name: hotelName,
            location: city,
            image: 'singapore',
            price:
              minPrice == maxPrice
                ? `₹${minPrice?.slice(0, 1)}xxx`
                : `₹${minPrice?.slice(0, 1)}xxx-₹${maxPrice.slice(0, 1)}xxx`,
            selected: false,
            type: hotelType,
            rooms: rooomsList
          })
        }
      }
    }
  }

  // console.log("hotelCategoryList: ", hotelCategoryList)
  return { hotelCategoryList, citiesList, hotelsArr }
}

const ARHPrimeHotel = () => {
  const hotelSheetData = useSelector(state => state.hotelRateData)
  const arhPrimeData = getArhHotelsList(hotelSheetData?.hotelsRate ?? {})
  const [hotelCategories, setHotelCategories] = useState(arhPrimeData.hotelCategoryList)
  const [citiesList, setCitiesList] = useState(arhPrimeData.citiesList)
  const [hotelsList, setHotelList] = useState(arhPrimeData.hotelsArr)

  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    handleFilter()
  }, [city, category])

  const handleFilter = () => {
    setHotelList(
      arhPrimeData.hotelsArr
        .filter(hotel => hotel.type.toLowerCase().includes(category.toLowerCase()))
        .filter(hotel => hotel.location.toLowerCase().includes(city.toLowerCase()))
    )
  }

  return (
    <>
      <Typography className='main-title' variant='h3'>
        ARH Prime Hotels
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

      <Grid
        container
        spacing={6}
        sx={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '30px',
          borderRadius: '10px',
          backgroundColor: '#ffffff'
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} sm={12}>
            {/* {console.log(hotelCategories)} */}
            <FormControl fullWidth>
              <InputLabel id='hotel-category-label'>Hotel Category</InputLabel>
              <Select
                labelId='hotel-category-label'
                id='hotel-category'
                label='Hotel Category'
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <MenuItem value=''>All</MenuItem>
                {hotelCategories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
                {/* <MenuItem value='2 star'>2 star</MenuItem>
                <MenuItem value='3 star'>3 star</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sm={12}>
            <FormControl fullWidth>
              <InputLabel id='city-label'>City</InputLabel>
              <Select labelId='city-label' id='city' label='City' value={city} onChange={e => setCity(e.target.value)}>
                <MenuItem value=''>All</MenuItem>
                {citiesList.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city.length > 0 ? `${city[0].toUpperCase()}${city.slice(1)}` : ''}
                  </MenuItem>
                ))}
                {/* <MenuItem value='jodhpur'>Jodhpur</MenuItem>
                <MenuItem value='udaipur'>Udaipur</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {hotelsList.map((hotel, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card
                sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
              >
                <Box>
                  <Box>
                    <img
                      src='/images/hotels/jaipur.jpg'
                      alt='hotel'
                      width={'100%'}
                      style={{ borderRadius: '10px 10px 0px 0px' }}
                    />
                  </Box>
                  <Box sx={{ padding: '20px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center',
                        marginBottom: '10px',
                        marginTop: '-10px'
                      }}
                    >
                      {HotelNameDark}
                      <span style={{ paddingLeft: '10px', fontWeight: '700', fontSize: '25px' }}>{hotel.name}</span>
                    </Box>
                    <Divider />
                    <Box>
                      <span style={{ marginTop: '10px', fontSize: '12px', display: 'block' }}>
                        Available Room Types
                      </span>
                      <Box sx={{ mt: 2, mb: 3 }}>
                        {hotel.rooms.map((room, idx) => (
                          <Chip
                            key={idx}
                            label={room}
                            sx={{
                              backgroundColor: idx == 0 ? '#D2F5B0' : idx == 1 ? '#FFCCC6' : '#3355A8',
                              borderRadius: '5px',
                              color: idx == 0 ? '#487C15' : idx == 1 ? '#D04534' : '#3355A8',
                              mr: 1.5,
                              height: 25,
                              fontWeight: '900 !important',
                              '& .MuiChip-label': { px: 3, textTransform: 'capitalize' }
                            }}
                          />
                        ))}
                        {/* <Chip
                          label={'Room Type 2'}
                          sx={{
                            borderRadius: '5px',
                            backgroundColor: '#FFCCC6',
                            color: '#D04534',
                            fontWeight: '900 !important',
                            mr: 1.5,
                            height: 25,
                            '& .MuiChip-label': { px: 3, textTransform: 'capitalize' }
                          }}
                        />
                        <Chip
                          label={'Room Type 3'}
                          sx={{
                            borderRadius: '5px',
                            color: '#3355A8',
                            backgroundColor: '#DBE5FF',
                            mr: 1.5,
                            height: 25,
                            fontWeight: '900 !important',
                            '& .MuiChip-label': { px: 3, textTransform: 'capitalize' }
                          }}
                        /> */}
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant='h6' paddingTop={2}>
                          {hotel.price} <span style={{ color: 'orange', fontSize: '14px' }}>/ Room</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default ARHPrimeHotel
