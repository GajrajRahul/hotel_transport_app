import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import toast from 'react-hot-toast'
import axios from 'axios'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'
import Loader from 'src/views/common/Loader'
import Dashboard from 'src/components/dashboard/Dashboard'
import { replaceTravelPackageData } from 'src/store/TravelPackageSlice'

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
  }
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

const transformPackageData = data => {
  const headers = data[0]

  let result = []
  data.slice(1).forEach((row, index) => {
    let obj = {}
    let packages = []
    let count = 1

    headers.forEach((header, idx) => {
      if (!header.includes('package_') || header == 'package_duration') {
        if (header.trim() == 'tour_route') {
          let segments = row[idx].split(',')

          let places = segments.flatMap(segment => segment.split('-').map(place => place.trim()))

          obj[header.trim()] = [...new Set(places)]
        } else {
          obj[header.trim()] = row[idx]
        }
      } else if (header.startsWith('package_') && header.endsWith('_price_per_person')) {
        if (row[idx - 2]) {
          // console.log('row[idx - 2]: ', row[idx - 2])
          // console.log('row[idx]: ', row[idx])
          packages.push({
            [`package_${count}_name`]: row[idx - 2] || '',
            [`package_${count}_hotels`]: row[idx - 1]
              ? row[idx - 1].split('|').map((hotels_info, j) => {
                  if (
                    hotels_info.split(':')[0] &&
                    hotels_info.split(':')[0] != '\n' &&
                    hotels_info.split(':')[0] != '\n '
                  ) {
                    // console.log("hotels_info.split(':'): ", hotels_info.split(':'))
                    return { city: hotels_info.split(':')[0], hotels: hotels_info.split(':')[1] }
                  } else {
                    return { city: '', hotels: '' }
                  }
                })
              : [],
            [`package_${count}_price_per_person`]: row[idx]
          })
          count++
        }
      }
    })
    obj.packages = packages
    result.push(obj)
  })
  return result
}

const MainHome = () => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchTravelPackageData()
  }, [])

  const fetchTravelPackageData = async () => {
    const TRAVEL_PACKAGE_SHEET_ID = process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const TRAVEL_PACKAGE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${TRAVEL_PACKAGE_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      const response = await axios.get(TRAVEL_PACKAGE_URL)
      const travelPackageSheetData = transformPackageData(response.data.values)
      // console.log(travelPackageSheetData)
      dispatch(replaceTravelPackageData(travelPackageSheetData))
      // return transformHotelData(response.data.values)
    } catch (error) {
      console.log(error)
      toast.error('Failded fetching quotation data')
      return { hotelsRate: null, roomsList: [], stateList: [] }
    }
  }

  return (
    <>
      <Loader open={isLoading} />
      <Grid container sx={{ justifyContent: 'center' }}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3} sx={{ padding: '10px 10px' }}>
            <Card
              sx={{
                width: '100% !important',
                borderRadius: '17px',
                backgroundColor: item.color,
                cursor: 'pointer'
              }}
              key={index}
              onClick={() => {
                if (item.href == '/quotations' || item.href == '/quotations-history') {
                  router.push(item.href)
                } else if (item.href == '/taxi') {
                  router.push('/book-taxi')
                }
                if (item.href == '/quotations') {
                  localStorage.removeItem('quotationId')
                  localStorage.removeItem('quotationName')
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
      </Grid>
    </>
  )
}

export default MainHome
