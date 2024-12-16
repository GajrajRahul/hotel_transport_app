import { useState, useEffect, useRef, Fragment } from 'react'
import toast from 'react-hot-toast'
import { usePDF } from 'react-to-pdf'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { format } from 'date-fns'
import axios from 'axios'

import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Icon from 'src/@core/components/icon'
import Loader from 'src/components/common/Loader'

// import PreviewCard from 'src/components/quotation/preview/PreviewCard'
// import PreviewActions from 'src/components/quotation/preview/PreviewActions'
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { postRequest, putRequest } from 'src/api-main-file/APIServices'

const getUniqueHotelTypes = cities => {
  const hotelTypes = cities.flatMap(city => city.info.map(info => info.hotel.type))
  return [...new Set(hotelTypes)]
}

function generateDayWiseItinerary(cities, transportData, monuments) {
  const itinerary = []
  let currentDate = null
  let currentHotel = null
  let currentCity = null

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i]
    const cityName = city.label
    const hotels = city.info

    for (let j = 0; j < hotels.length; j++) {
      const hotel = hotels[j]
      const hotelName = hotel.hotel.name
      const [checkIn, checkOut] = hotel.checkInCheckOut.map(date => new Date(date))

      if (!currentDate) currentDate = new Date(checkIn)

      while (currentDate < checkOut) {
        const day = itinerary.length + 1
        if (!currentCity) {
          currentCity = cityName
        }

        // First day in the city
        if (day == 1) {
          let body = `Upon your arrival in ${cityName}, ${monuments[cityName]?.cityIntro ?? ''}`
          if (transportData.vehicleType) {
            body += `you will be transferred to your ${hotelName} in a comfortable ${transportData.vehicleType} Vehicle`
          }
          body += `Once at the ${hotelName}, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (hotel.lunch) {
            body += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }
          body += `${monuments[cityName] ? monuments[cityName].cityAttractions.split('|').join('\n') : ''}`
          if (hotel.dinner) {
            body += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            body += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }
          itinerary.push({
            head: `Day ${day} | Arrival in ${cityName}`,
            body
          })
          currentCity = cityName
          currentHotel = hotelName
        }
        // If staying in the same city
        else if (currentCity === cityName) {
          // If the hotel changes
          if (currentHotel !== hotelName) {
            let body = ''
            if (hotel.breakfast) {
              body += 'Enjoy a delicious breakfast at the hotel.'
            }
            body += 'complete the check-out formalities and proceed to your next hotel.'
            if (transportData.vehicleType) {
              body += `you will be transferred to your ${hotelName} in a comfortable ${transportData.vehicleType} Vehicle.`
            }
            body += `Once at the ${hotelName}, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}. Dive deeper into the city's charm`
            if (hotel.lunch) {
              body += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            }
            body += `${monuments[cityName] ? monuments[cityName].cityAttractions.split('|').join('\n') : ''}`
            if (hotel.dinner) {
              body += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
            } else {
              body += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
            }
            itinerary.push({ head: `Day ${day} | From ${currentHotel} to ${hotelName} in ${cityName}`, body })
            currentHotel = hotelName
          } else {
            let body = "Dive deeper into the city's charm"
            if (hotel.breakfast) {
              body += 'Enjoy a delicious breakfast at the hotel.'
            }
            if (hotel.lunch) {
              body += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            }
            body += `${monuments[cityName] ? monuments[cityName].cityAttractions.split('|').join('\n') : ''}`
            if (hotel.dinner) {
              body += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            } else {
              body += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
            }
            itinerary.push({ head: `Day ${day} | Continue exploring ${cityName}`, body })
          }
        }
        // If the city changes
        else {
          let body = ''
          if (hotel.breakfast) {
            body += 'Enjoy a delicious breakfast at the hotel.'
          }
          body += 'complete the check-out formalities and proceed to your onward journey.'
          body += `Upon your arrival in ${cityName}, ${monuments[cityName]?.cityIntro ?? ''}`
          if (transportData.vehicleType) {
            body += `you will be transferred to your ${hotelName} in a comfortable ${transportData.vehicleType} Vehicle`
          }
          body += `Once at the ${hotelName}, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (hotel.lunch) {
            body += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }
          body += `${monuments[cityName] ? monuments[cityName].cityAttractions.split('|').join('\n') : ''}`
          if (hotel.dinner) {
            body += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            body += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }
          itinerary.push({ head: `Day ${day} | ${currentCity} to ${cityName}`, body })
          currentCity = cityName
          currentHotel = hotelName
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    // Add travel day between cities
    // if (i < cities.length - 1) {
    //   const nextCity = cities[i + 1].label
    //   const day = itinerary.length + 1
    //   itinerary.push(`Day ${day} | ${currentCity} to ${nextCity}`)
    //   currentDate.setDate(currentDate.getDate() + 1)
    //   currentCity = null // Reset for next city
    // }
  }

  // Final departure
  // const lastCity = cities[cities.length - 1].label
  // itinerary.push(`Day ${itinerary.length + 1} | Departure from ${lastCity}`)

  // console.log(itinerary)
  return itinerary
}

const generateMonumentsData = data => {
  const headers = data[0]
  const result = {}

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

      const cityIntro = `${rowData.city_intro}`
      const cityImage = `${rowData.cityImage}`
      const cityAttractions = `${rowData.attractions}`
      const cityInclusion = `${rowData.inclusion}`
      const cityExclusion = `${rowData.exclusion}`

      if (!result[cityKey]) {
        result[cityKey] = {}
      }

      result[cityKey] = {
        ...result[cityKey],
        cityIntro: cityIntro || '',
        cityImage: cityImage || '',
        cityAttractions: cityAttractions || '',
        cityInclusion: cityInclusion || '',
        cityExclusion: cityExclusion || ''
      }
    }
  })

  return { result }
}

const QutationPreview = ({ id }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })
  const quotationId = useRef(localStorage.getItem('quotationId') ?? '')
  const travelInfoData = useRef(localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null)
  const cities = useRef(localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : [])
  const transportData = useRef(localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null)
  const clientType = useRef(
    ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
      ? localStorage.getItem('clientType')
      : 'admin'
  )
  const quotationName = useRef(localStorage.getItem('quotationName') ? localStorage.getItem('quotationName') : '')
  const states = useRef(
    localStorage.getItem('selectedStates') ? JSON.parse(localStorage.getItem('selectedStates')) : []
  )
  const [monuments, setMonuments] = useState(null)

  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchMonumentsData()
  }, [])

  const fetchMonumentsData = async () => {
    const MONUMENTS_SHEET_ID = process.env.NEXT_PUBLIC_MONUMENTS_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const MONUMENTS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${MONUMENTS_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      setIsLoading(true)
      const response = await axios.get(MONUMENTS_URL)
      setIsLoading(false)
      const finalData = generateMonumentsData(response.data.values ?? [])
      setMonuments(finalData.result)
    } catch (error) {
      toast.error('Failed fetching monuments data')
      console.error('Error fetching data:', error)
    }
  }

  const saveQuotation = async () => {
    // const quotationId = localStorage.getItem('quotationId')
    // const travelInfoData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null
    // const cities = localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
    // const transportData = localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null
    // const clientType = ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
    //   ? localStorage.getItem('clientType')
    //   : 'admin'

    const dataToSend = {
      // quotationName: localStorage.getItem('quotationName') ? localStorage.getItem('quotationName') : '',
      quotationName: quotationName.current,
      travelInfo: travelInfoData.current
        ? {
            userName: travelInfoData.current.name,
            journeyStartDate: new Date(travelInfoData.current.dates[0]),
            journeyEndDate: new Date(travelInfoData.current.dates[1])
          }
        : null,
      citiesHotelsInfo: {
        cities: cities.current.map(city => {
          const { label, info } = city
          return {
            id: city.id,
            cityName: label,
            hotelInfo: info.map(d => {
              const { checkInCheckOut, breakfast, lunch, dinner, rooms, child, extraBed, hotel, persons, adult, id } = d
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
            vehicleType: transportData.current.vehicleType,
            from:
              typeof transportData.current.from == 'object'
                ? transportData.current.from.description
                : transportData.current.from,
            to:
              typeof transportData.current.to == 'object'
                ? transportData.current.to.description
                : transportData.current.from,
            checkpoints: transportData.current.additionalStops.map(stop => stop.description)
          }
        : null
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const api_url = `${BASE_URL}/${clientType}`
    setIsLoading(true)
    let response
    if (quotationId.current.length > 0) {
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
    <>
      <Loader open={isLoading} />
      <Grid container spacing={6} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Grid>
          {/* <PreviewCard data={data} /> */}
          <Card
            sx={{
              // width: '595px',
              height: '842px',
              overflow: 'auto'
            }}
          >
            <CardContent ref={targetRef}>
              <div className='a4-background'>
                <div className='Header'>
                  <img className='logo' src='adventure-richa-holidays.png' />
                  <div className='days-nights'>
                    {' '}
                    <span>{travelInfoData.current['days-nights']}</span>
                  </div>
                </div>

                <div className='title-description'>
                  <div className='tag-line'>Your Gateway to Memorable Journeys</div>
                  <h1 className='title'>Adventure Richa Holidays</h1>
                  <p className='description'>
                    Explore the world with Adventure Richa Holidays! Offering tailored domestic and international tours
                    for individuals, groups, and corporate clients. Adventure and relaxation, all perfectly planned.
                  </p>
                </div>

                <div className='basic-info'>
                  <div className='traveller-name'>
                    {' '}
                    <span>{travelInfoData.current.name}</span>
                  </div>
                  <div className='date'>
                    {' '}
                    <span>
                      {format(new Date(travelInfoData.current.dates[0]), 'dd MMM yyyy')} -{' '}
                      {format(new Date(new Date(travelInfoData.current.dates[1])), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
                <div className='route'>
                  {cities.current.map((city, index) => (
                    <span key={index}>
                      {city.label ? `${city.label[0].toUpperCase()}${city.label.slice(1)}` : ''}
                      {index != cities.current.length - 1 ? ' - ' : ''}
                    </span>
                  ))}
                  {/* Jaipur - Pushkar - Jodhpur - Jaisalmer */}
                </div>

                <div style={{ height: '300px' }}>
                  <div className='accommodation-section'>
                    <h3 className='accommodation-title'>Accommodation Overview</h3>
                  </div>

                  <div className='textfield-container no-of-person-position'>
                    <input type='text' id='outlined-input' value={cities.current[0]?.info[0]?.persons ?? ''} disabled />
                    <label htmlFor='outlined-input'>No of Person</label>
                  </div>

                  <div className='textfield-container hotel-category-position'>
                    <input
                      type='text'
                      id='outlined-input'
                      value={getUniqueHotelTypes(cities.current).join(', ')}
                      disabled
                    />
                    <label htmlFor='outlined-input'>Hotel Category</label>
                  </div>

                  <div className='textfield-container room-type-position'>
                    <input type='text' id='outlined-input' value='Base Catagory' disabled />
                    <label htmlFor='outlined-input'>Room Type</label>
                  </div>

                  <div className='textfield-container Included-meals-position'>
                    <input
                      type='text'
                      id='outlined-input'
                      value={
                        cities.current[0].info[0].breakfast &&
                        cities.current[0].info[0].lunch &&
                        cities.current[0].info[0].dinner
                          ? 'Breakfast, Lunch, Dinner'
                          : cities.current[0].info[0].breakfast && cities.current[0].info[0].lunch
                          ? 'Breakfast, Lunch'
                          : cities.current[0].info[0].breakfast && cities.current[0].info[0].dinner
                          ? 'Breakfast, Donner'
                          : cities.current[0].info[0].lunch && cities.current[0].info[0].dinner
                          ? 'Lunch, Dinner'
                          : cities.current[0].info[0].breakfast
                          ? 'Breakfast'
                          : cities.current[0].info[0].lunch
                          ? 'Lunch'
                          : 'Dinner'
                      }
                      disabled
                    />
                    <label htmlFor='outlined-input'>Included Meals</label>
                  </div>

                  <div className='textfield-container no-of-rooms-position'>
                    <input type='text' id='outlined-input' value={cities.current[0].info[0].rooms} disabled />
                    <label htmlFor='outlined-input'>No of Rooms</label>
                  </div>

                  <div className='textfield-container Extra-bed-position'>
                    <input type='text' id='outlined-input' value={cities.current[0].info[0].extraBed} disabled />
                    <label htmlFor='outlined-input'>Extra Bed</label>
                  </div>
                </div>

                <div className='price-section' style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }}>
                  <div className='price-section-total'>
                    {' '}
                    <span className='total-amount'>Total : ₹56,700</span>
                  </div>

                  <div className='price-section-state'>
                    {' '}
                    <div>
                      {states.current.map((state, index) => (
                        <span key={index}>
                          {state ? `${state.name[0].toUpperCase()}${state.name.slice(1)}` : ''}
                          {index != states.current.length - 1 ? ' | ' : ''}
                        </span>
                      ))}
                    </div>
                    <span className='no-of-nights'> 5 N</span>
                  </div>
                </div>

                <div style={{ height: '180px' }}>
                  <div className='transportation-section'>
                    <h3 className='accommodation-title'>Transportation Overview</h3>
                  </div>
                  <div className='textfield-container pickup-location-position'>
                    <input
                      type='text'
                      id='outlined-input'
                      value={
                        typeof transportData.current.from == 'object'
                          ? transportData.current.from.description
                          : transportData.current.from
                      }
                      disabled
                    />
                    <label htmlFor='outlined-input'>Pick up Location</label>
                  </div>

                  <div className='textfield-container drop-location-position'>
                    <input
                      type='text'
                      id='outlined-input'
                      value={
                        typeof transportData.current.to == 'object'
                          ? transportData.current.to.description
                          : transportData.current.to
                      }
                      disabled
                    />
                    <label htmlFor='outlined-input'>Drop Location</label>
                  </div>

                  <div className='textfield-container vehicle-type-position'>
                    <input
                      type='text'
                      id='outlined-input'
                      value={
                        transportData.current.vehicleType
                          ? `${transportData.current.vehicleType[0].toUpperCase()}${transportData.current.vehicleType.slice(
                              1
                            )}`
                          : ''
                      }
                      disabled
                    />
                    <label htmlFor='outlined-input'>Vehicle</label>
                  </div>
                </div>

                <div className='itinerary-section'>
                  <h3 className='itinerary-title'>Day Wise Itinerary</h3>
                </div>

                {/* {monuments && console.log(generateDayWiseItinerary(cities.current, transportData.current, monuments))} */}
                {monuments && (
                  <div className='days-section'>
                    {generateDayWiseItinerary(cities.current, transportData.current, monuments).map(
                      (itinerary, index) => (
                        <Fragment key={index}>
                          <h3 className='itinerary-title'>{itinerary.head}</h3>
                        </Fragment>
                      )
                    )}
                    <div className='travel-inclusive'>
                      <span>3 Star Hotel</span> <span>&#20;|&#20;</span> <i className='fi fi-ts-door-closed'></i>
                      <span>1 Basic Room</span> <span>&#20;|&#20;</span> <i className='fi fi-ts-binoculars'></i>
                      <span>1 Basic Room</span>
                      <span>&#20;|&#20;</span> <i className='fi fi-ts-plate-eating'></i>
                      <span>Breakfast, Dinner</span>
                    </div>
                    <img
                      src='/hotel-image.jpg'
                      width='320px'
                      height='150px'
                      style={{
                        textAlign: 'left',
                        textAlign: 'left',
                        display: 'flex',
                        margin: '20px 0 0 0px',
                        borderRadius: '10px'
                      }}
                    />
                    <div>
                      <p className='day-description'>
                        Welcome to Jaipur, the vibrant "Pink City" known for its rich heritage and grand palaces. Upon
                        arrival, check in at Hotel Shyam. Complete the check-in process, rest for two hours, and then
                        head out to explore:
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src='/sightseeing-icon.png' width='20px' style={{ marginRight: '10px' }} />
                        <p className='day-attraction-dexcription'>
                          <b>City Palace :</b> A magnificent blend of Rajasthani and Mughal architecture.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <img src='/sightseeing-icon.png' width='20px' style={{ marginRight: '10px' }} />
                        <p className='day-attraction-dexcription'>
                          <b>City Palace :</b> A magnificent blend of Rajasthani and Mughal architecture.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <img src='/sightseeing-icon.png' width='20px' style={{ marginRight: '10px' }} />
                        <p className='day-attraction-dexcription'>
                          <b>Jantar Mantar : </b>A UNESCO World Heritage Site showcasing ancient astronomical
                          instruments.{' '}
                        </p>
                      </div>
                      <p className='day-description'>
                        End your day with a delicious dinner at a famous local restaurant before returning to the hotel
                        for an overnight stay.
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ height: '0px' }}>
                    <div className='textfield-container hotel-name-position'>
                      <input
                        type='text'
                        id='outlined-input'
                        value='Jodhpur, Rajasthan'
                        disabled
                        style={{ width: '93%' }}
                      />
                      <label htmlFor='outlined-input'>Drop Location</label>
                    </div>

                    <div className='textfield-container checkin-checkout-date-position'>
                      <input
                        type='text'
                        id='outlined-input'
                        value='Jodhpur, Rajasthan'
                        disabled
                        style={{ width: '93%' }}
                      />
                      <label htmlFor='outlined-input'>Drop Location</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ '&.MuiGrid-item': { pt: 0 } }} item xl={3} md={4} xs={12}>
          {/* <PreviewActions /> */}
          <Card>
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
                onClick={() => toPDF()}
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
        </Grid>
      </Grid>
    </>
  )
}

QutationPreview.getLayout = page => <BlankLayout>{page}</BlankLayout>
QutationPreview.guestGuard = false

export default QutationPreview
