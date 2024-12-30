import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
import Dashboard from 'src/components/dashboard/Dashboard'

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
  height: 50
  // position: 'absolute'
})

const data = [
  {
    title: 'Create Itinerary',
    subtitle: 'Plan your perfect journey, effortlessly',
    src: '/images/icons/pencil.png',
    color: '#FF9B9E',
    href: '/quotations'
  },
  {
    title: 'Itinerary History',
    subtitle: 'Relive your past adventures, anytime',
    src: '/images/icons/bill.png',
    color: '#F9CD90',
    href: '/quotations-history'
  },
  // {
  //   title: 'Bookings',
  //   subtitle: '419 bookings',
  //   src: '/images/icons/keys.png',
  //   color: '#84C9CC'
  // },
  {
    // title: 'Taxi Services',
    title: 'Book a Taxi',
    subtitle: 'Your ride, your way, at your doorstep',
    src: '/images/icons/taxi-stop.png',
    color: '#97D786',
    href: '/taxi'
  },
  {
    title: 'ARH Prime Hotels',
    subtitle: "Stay secure with ARH's guarantee",
    src: '/images/icons/luggage.png',
    color: '#BBBAF6',
    href: '/packages'
  },
  // {
  //   title: 'Approval Status ',
  //   // subtitle: 'Offer curated travel packages.',
  //   subtitle: '325 approvals.',
  //   src: '/images/icons/kayak.png',
  //   color: '#F9CD90',
  //   href: '/approvals'
  // }
  // {
  //   title: 'Activities',
  //   subtitle: '74 activities',
  //   src: '/images/icons/kayak.png',
  //   color: '#F9CD90'
  // },
  // {
  //   title: 'Hotels',
  //   subtitle: '3,214 hotels',
  //   src: '/images/icons/bell.png',
  //   color: '#84C9CC'
  // },
  // {
  //   title: 'Attractions',
  //   subtitle: '987 attractions',
  //   src: '/images/icons/mummy.png',
  //   color: '#BBBAF6'
  // },
  // {
  //   title: 'Honeymoon',
  //   subtitle: '86 Destinations',
  //   src: '/images/icons/honeymoon.png',
  //   color: '#97D786'
  // }
]

const MainHome = ({ hotel_response, rooms_list, transport_response }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  // const [slides, setSlides] = useState(data)
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  // const [transportRate, setTransportRate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [hotelRate, setHotelData] = useState(finalData?.hotelsRate ?? null)
  // const [roomsList, setRoomsList] = useState(finalData?.roomsList ?? [])

  const theme = useTheme()
  const router = useRouter()
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

  return (
    <>
      <Loader open={isLoading} />
      {/* <KeenSliderWrapper> */}
      <Grid container sx={{justifyContent: 'center'}}>
        {data.map((item, index) => (
          <Grid key={index}  xs={12}  sm={6}  md={4}  lg={3}  sx={{padding: '10px 10px'}}>
            <Card
              sx={{
                width: '100% !important',
                borderRadius: '17px',
                backgroundColor: item.color,
                cursor: 'pointer'
              }}
              key={index}
              // className='keen-slider__slide default-slide'
              onClick={() => {
                if (item.href == '/quotations' || item.href == '/quotations-history') {
                  router.push(item.href)
                }
                else if(item.href == '/taxi') {
                  router.push('/book-taxi')
                }
                if (item.href == '/quotations') {
                  localStorage.removeItem("quotationId")
                  localStorage.removeItem("quotationName")
                  localStorage.removeItem('travel')
                  localStorage.removeItem('citiesHotels')
                  localStorage.removeItem('transport')
                  localStorage.removeItem('selectedStates')
                }
              }}
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
                  <Typography fontWeight={600} fontSize={14} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ rowGap: 1, display: 'flex', flexWrap: 'wrap' }}>
                    <Typography variant='caption' fontSize={10}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
                <Img src={item.src} alt={item.title} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={6} className='match-height' sx={{ mt: 0 }}>
        <Grid item xs={12}>
          <Dashboard />
        </Grid>
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
        {/* <Grid item xs={12} sx={{ height: '100%' }}>
          {hotel_response && rooms_list && transport_response && (
            <QuotationSteps hotelRate={hotel_response} roomsList={rooms_list} transportRate={transport_response} />
          )}
        </Grid> */}

        {/* <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button variant='contained' onClick={handleOpenDrawer}>
                  Open Drawer
                </Button>
              </CardContent>
            </Card>
          </Grid> */}
        {/* <SideDrawer open={openDrawer} toggle={handleCloseDrawer} /> */}
      </Grid>
      {/* </KeenSliderWrapper> */}
    </>
  )
}

export default MainHome
