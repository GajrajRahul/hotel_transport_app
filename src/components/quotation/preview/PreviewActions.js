import { useState } from 'react'
import toast from 'react-hot-toast'

import Link from 'next/link'
import { useRouter } from 'next/router'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import Icon from 'src/@core/components/icon'
import Loader from 'src/components/common/Loader'
import { postRequest, putRequest } from 'src/api-main-file/APIServices'

const PreviewActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const saveQuotation = async () => {
    const quotationId = localStorage.getItem('quotationId')
    const travelInfoData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null
    const cities = localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
    const transportData = localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null
    const clientType = ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
      ? localStorage.getItem('clientType')
      : 'admin'

    const dataToSend = {
      quotationName: localStorage.getItem('quotationName') ? localStorage.getItem('quotationName') : '',
      travelInfo: travelInfoData
        ? {
            userName: travelInfoData.name,
            journeyStartDate: new Date(travelInfoData.dates[0]),
            journeyEndDate: new Date(travelInfoData.dates[1])
          }
        : null,
      citiesHotelsInfo: {
        cities: cities.map(city => {
          const { label, info } = city
          return {
            id: city.id,
            cityName: label,
            hotelInfo: info.map(d => {
              const { checkInCheckOut, breakfast, lunch, dinner, rooms, child, extraBed, hotel, persons, adult, id } = d
              // console.log(d)
              let roomTypes = []
              Object.keys(hotel).map(h => {
                if (!['id', 'name', 'location', 'image', 'price', 'selected', 'type'].includes(h)) {
                  roomTypes.push(hotel[h])
                }
              })
              return {
                id,
                hotelName: hotel.name,
                hotelType: hotel.type,
                rooms,
                roomType: roomTypes, // it will be like [{roomName: '', roomCount: 1}],
                adult,
                child,
                checkIn: new Date(checkInCheckOut[0]),
                checkOut: new Date(checkInCheckOut[1]),
                isBreakfast: breakfast,
                isLunch: lunch,
                isDinner: dinner,
                extraBed,
                persons, // might remove this,
                hotelImage: hotel.image, // add this is mongoose,
                price: hotel.price
              }
            })
          }
        })
      },
      transportInfo: transportData
        ? {
            vehicleType: transportData.vehicleType,
            from: typeof transportData.from == 'object' ? transportData.from.description : transportData.from,
            to: typeof transportData.to == 'object' ? transportData.to.description : transportData.from,
            checkpoints: transportData.additionalStops.map(stop => stop.description)
          }
        : null
    }

    // console.log(dataToSend)
    // return
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const api_url = `${BASE_URL}/${clientType}`
    setIsLoading(true)
    let response
    if (quotationId) {
      response = await putRequest(`${api_url}/update-quotation`, { id: quotationId, ...dataToSend })
    } else {
      response = await postRequest(`${api_url}/create-quotation`, dataToSend)
    }
    setIsLoading(false)

    if (response.status) {
      toast.success(typeof response.data == 'object' ? 'Success' : response.data)
      router.push('/')
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Card>
      <Loader open={isLoading} />
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-file-add' />}
        >
          Create New Quotation
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-file-edit' />}
        >
          Edit Quote
        </Button>
        <Button
          fullWidth
          //   target='_blank'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-file-download' />}
          //   component={Link}
          variant='outlined'

          //   href={'/'}
        >
          Download Pdf
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          //   component={Link}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-send-quote' />}
          //   href={'/'}
        >
          Send Quote For Approval
        </Button>
        <Button
          fullWidth
          variant='outlined'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-cancel-quote' />}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          onClick={saveQuotation}
          variant='outlined'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-save-quote' />}
        >
          Save
        </Button>
        <Button
          fullWidth
          variant='outlined'
          sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-share-quote' />}
        >
          Share
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
