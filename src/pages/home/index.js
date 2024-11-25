import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

import axios from 'axios'
import toast from 'react-hot-toast'

import { useKeenSlider } from 'keen-slider/react'
import clsx from 'clsx'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'

import SideDrawer from 'src/components/SideDrawer'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import Icon from 'src/@core/components/icon'
import CardSnippet from 'src/@core/components/card-snippet'
import AnalyticsTransactionsCard from 'src/views/analytics/AnalyticsTransactionsCard'
import EcommerceTotalSalesDonut from 'src/views/analytics/EcommerceTotalSalesDonut'
import CrmTotalGrowth from 'src/views/analytics/CrmTotalGrowth'
import QuotationSteps from 'src/components/quotation/QuotationSteps'
import Loader from 'src/views/common/Loader'

const MutationPlugin = slider => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      slider.update()
    })
  })
  const config = { childList: true }

  slider.on('created', () => {
    observer.observe(slider.container, config)
  })
  slider.on('destroyed', () => {
    observer.disconnect()
  })
}

const Img = styled('img')({
  // right: 7,
  // bottom: 0,
  height: 70
  // position: 'absolute'
})

const data = [
  {
    title: 'Create Quotation',
    subtitle: 'Lorem Ipsum',
    src: '/images/icons/pencil.png',
    color: '#FF9B9E'
  },
  {
    title: 'Quote History',
    subtitle: '838 Quotes',
    src: '/images/icons/bill.png',
    color: '#F9CD90'
  },
  {
    title: 'Bookings',
    subtitle: '419 bookings',
    src: '/images/icons/keys.png',
    color: '#84C9CC'
  },
  {
    title: 'Taxi Services',
    subtitle: '345 taxi bookings',
    src: '/images/icons/taxi-stop.png',
    color: '#97D786'
  },
  {
    title: 'Travel Packages',
    subtitle: '1,288 packages',
    src: '/images/icons/luggage.png',
    color: '#BBBAF6'
  },
  {
    title: 'Activities',
    subtitle: '74 activities',
    src: '/images/icons/kayak.png',
    color: '#F9CD90'
  },
  {
    title: 'Hotels',
    subtitle: '3,214 hotels',
    src: '/images/icons/bell.png',
    color: '#84C9CC'
  },
  {
    title: 'Attractions',
    subtitle: '987 attractions',
    src: '/images/icons/mummy.png',
    color: '#BBBAF6'
  },
  {
    title: 'Honeymoon',
    subtitle: '86 Destinations',
    src: '/images/icons/honeymoon.png',
    color: '#97D786'
  }
]

const transformHotelData = data => {
  const headers = data[0]
  const result = {}

  const matchingColumnIndices = headers
    .map((header, index) => (header?.startsWith('room_type_') && header?.endsWith('_tag') ? index : -1))
    .filter(index => index !== -1)

  const filtered = data.slice(1).map(row => matchingColumnIndices.map(colIndex => row[colIndex] || ''))

  let roomsList = []
  filtered.map(data =>
    data.map(item => {
      if (item.length > 0 && !roomsList.includes(item)) roomsList.push(item)
    })
  )

  data.slice(1).forEach(row => {
    if (row.length > 0) {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))

      const cityKey = `${
        rowData.city
          ? rowData.city
              .split(' ')
              .map(c => c.toLowerCase())
              .join('_')
          : rowData.city
      }`

      const hotelTypeKey = `${rowData.type_of_hotel}`

      const hotelNameKey = `${rowData.hotel_name}`

      if (!result[cityKey]) result[cityKey] = {}
      if (!result[cityKey][hotelTypeKey]) result[cityKey][hotelTypeKey] = {}
      if (!result[cityKey][hotelTypeKey][hotelNameKey]) {
        result[cityKey][hotelTypeKey][hotelNameKey] = {}
      }

      result[cityKey][hotelTypeKey][hotelNameKey] = {
        ...result[cityKey][hotelTypeKey][hotelNameKey],
        breakfast: rowData.breakfast || '',
        lunch: rowData.lunch || '',
        dinner: rowData.dinner || '',
        extrabed: rowData.extrabed || '',
        [`${rowData.room_type_1_tag}`]: rowData.room_type_1 || '',
        [`${rowData.room_type_2_tag}`]: rowData.room_type_2 || '',
        [`${rowData.room_type_3_tag}`]: rowData.room_type_3 || '',
        [`${rowData.room_type_4_tag}`]: rowData.room_type_4 || ''
      }
    }
  })

  return { roomsList, hotelsRate: result }
}

const transformTransportData = data => {
  const headers = data[0]
  const result = {}

  data.slice(1).forEach(row => {
    if (row.length > 0) {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))

      const carName = `${rowData.car_name}`

      if (!result[carName]) result[carName] = {}
      headers.map(item => {
        if (item != 'car_name') {
          result[carName] = { ...result[carName], [item]: rowData[item] }
        }
      })
    }
  })

  return result
}

const Home = ({ hotel_response, rooms_list, transport_response }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  // const [slides, setSlides] = useState(data)
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  // const [transportRate, setTransportRate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [hotelRate, setHotelData] = useState(finalData?.hotelsRate ?? null)
  // const [roomsList, setRoomsList] = useState(finalData?.roomsList ?? [])

  const theme = useTheme()
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      rtl: false,
      slides: {
        // perView: 3,
        perView: 4,
        spacing: 10
      },
      breakpoints: {
        [`(max-width: ${theme.breakpoints.values.custom1}px)`]: {
          slides: { perView: 3, spacing: 10 }
        },
        // [`(max-width: ${theme.breakpoints.values.laptopSm}px)`]: {
        //   slides: { perView: 3, spacing: 10 }
        // },
        [`(max-width: ${theme.breakpoints.values.tabletMd}px)`]: {
          slides: { perView: 2, spacing: 10 }
        },
        [`(max-width: ${theme.breakpoints.values.sm}px)`]: {
          slides: { perView: 1, spacing: 16 }
        }
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [MutationPlugin]
  )

  // useEffect(() => {
  // getHotelRates()
  //   getTransportRate()
  // }, [])

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  const handleCloseDrawer = resetFunc => {
    setOpenDrawer(false)
    resetFunc()
  }

  // const getHotelRates = async () => {
  //   setIsLoading(true)
  //   const SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
  //   const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //   const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
  //   try {
  //     const response = await axios.get(URL)
  //     const finalData = transformHotelData(response.data.values ?? [])
  //     setHotelData(finalData.hotelsRate)
  //     setRoomsList(finalData.roomsList)
  //   } catch (error) {
  //     toast.error('Failed fetching hotel data')
  //     console.error('Error fetching data:', error)
  //   }
  //   setIsLoading(false)
  // }

  // const getTransportRate = async () => {
  //   setIsLoading(true)
  //   const SHEET_ID = process.env.NEXT_PUBLIC_TRANSPORT_SHEET_ID
  //   const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //   const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
  //   try {
  //     const response = await axios.get(URL)
  //     const finalData = transformTransportData(response.data.values ?? [])
  //     setTransportRate(finalData)
  //   } catch (error) {
  //     toast.error('Failed fetching transport data')
  //     console.error('Error fetching data:', error)
  //   }
  //   setIsLoading(false)
  // }

  return (
    <>
      <Loader open={isLoading} />
      {/* <KeenSliderWrapper> */}
      <Grid container spacing={6} className='match-height' sx={{ height: '100%' }}>
        {/* <Grid item xs={12}> */}
        {/* <Box className='navigation-wrapper'> // this is not importnat */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {loaded && instanceRef.current && (
              <Icon
                style={{ cursor: 'pointer' }}
                icon='mdi:round-arrow-left'
                className={clsx('arrow arrow-left', {
                  'arrow-disabled': currentSlide === 0
                })}
                onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
              />
            )}
            <Box ref={sliderRef} className='keen-slider'>
              {data.map((item, index) => {
                return (
                  <Card
                    // title=''
                    // code={{
                    //   tsx: null,
                    //   jsx: null
                    // }}
                    sx={{
                      overflow: 'visible',
                      position: 'relative',
                      borderRadius: '17px',
                      backgroundColor: item.color
                    }}
                    key={index}
                    className='keen-slider__slide default-slide'
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 3,
                        '&.MuiCardContent-root': {
                          pb: 3
                        }
                      }}
                    >
                      <Box>
                        <Typography sx={{ mb: 3, fontWeight: 600 }}>{item.title}</Typography>
                        <Box sx={{ rowGap: 1, display: 'flex', flexWrap: 'wrap' }}>
                          <Typography fontSize={14}>{item.subtitle}</Typography>
                        </Box>
                      </Box>
                      <Img src={item.src} alt={item.title} />
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
            {loaded && instanceRef.current && (
              <Icon
                style={{ cursor: 'pointer' }}
                icon='mdi:round-arrow-right'
                className={clsx('arrow arrow-right', {
                  'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
                })}
                onClick={e => e.stopPropagation() || instanceRef.current?.next()}
              />
            )}
          </Box> */}
        {/* </Box> */}
        {/* </Grid> */}
        {/* <Grid item xs={6} md={6}>
            <AnalyticsTransactionsCard />
          </Grid>
          <Grid item xs={12} md={3}>
            <EcommerceTotalSalesDonut />
          </Grid>
          <Grid item xs={12} md={3}>
            <CrmTotalGrowth />
          </Grid> */}
        <Grid item xs={12} sx={{ height: '100%' }}>
          {hotel_response && rooms_list && transport_response && (
            <QuotationSteps hotelRate={hotel_response} roomsList={rooms_list} transportRate={transport_response} />
          )}
        </Grid>

        {/* <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button variant='contained' onClick={handleOpenDrawer}>
                  Open Drawer
                </Button>
              </CardContent>
            </Card>
          </Grid> */}
        <SideDrawer open={openDrawer} toggle={handleCloseDrawer} />
      </Grid>
      {/* </KeenSliderWrapper> */}
    </>
  )
}

export async function getStaticProps() {
  const HOTEL_SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const HOTEL_URL = `https://sheets.googleapis.com/v4/spreadsheets/${HOTEL_SHEET_ID}/values/Sheet1?key=${API_KEY}`

  const TRANSPORT_SHEET_ID = process.env.NEXT_PUBLIC_TRANSPORT_SHEET_ID
  // const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const TRANSPORT_URL = `https://sheets.googleapis.com/v4/spreadsheets/${TRANSPORT_SHEET_ID}/values/Sheet1?key=${API_KEY}`

  let hotel_response = null
  let rooms_list = []
  let transport_response = null

  try {
    const response = await axios.get(HOTEL_URL)
    const finalData = transformHotelData(response.data.values ?? [])
    hotel_response = finalData.hotelsRate
    rooms_list = finalData.roomsList
    // setHotelData(finalData.hotelsRate)
    // setRoomsList(finalData.roomsList)
  } catch (error) {
    toast.error('Failed fetching transport data')
    console.error('Error fetching data:', error)
  }

  try {
    const response = await axios.get(TRANSPORT_URL)
    const finalData = transformTransportData(response.data.values ?? [])
    transport_response = finalData
    // setTransportRate(finalData)
  } catch (error) {
    toast.error('Failed fetching transport data')
    console.error('Error fetching data:', error)
  }

  return {
    props: {
      hotel_response,
      rooms_list,
      transport_response
    }
  }
}

export default Home
