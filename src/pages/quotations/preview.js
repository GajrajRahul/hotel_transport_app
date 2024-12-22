import { useState, useEffect, useRef, Fragment } from 'react'
import toast from 'react-hot-toast'
import { usePDF } from 'react-to-pdf'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { useJsApiLoader } from '@react-google-maps/api'

import { format } from 'date-fns'
import axios from 'axios'

import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Icon from 'src/@core/components/icon'
import Loader from 'src/components/common/Loader'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import { postRequest, putRequest } from 'src/api-main-file/APIServices'
import { getDayNightCount } from 'src/utils/function'
import { transformHotelData } from '.'
import {
  BedCount,
  DayNight,
  DropLocation,
  ExclusionIcon,
  HotelCategory,
  HotelName,
  InclusionIcon,
  KnowBeforeYouGo,
  MealIcon,
  MonumentBullets,
  PersonCount,
  PickupLocation,
  RoomCategory,
  RoomCount,
  RouteMap,
  SeightSeeing,
  TravelDate,
  TravellerName,
  vehicleType
} from 'src/utils/icons'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const getUniqueHotelTypes = cities => {
  const hotelTypes = cities.flatMap(city => city.info.map(info => info.hotel.type))
  return [...new Set(hotelTypes)]
}

const BulletPoint = ({ text, icon }) => (
  <div className='bullet-points-container'>
    <div className='svg-container'>{icon}</div>
    <div className='bullet-text'>{text}</div>
  </div>
)

function generateDayWiseItinerary(cities, transportData, monuments) {
  const itinerary = []
  let currentDate = null
  let currentHotel = null
  let currentCity = null

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i]
    const cityName = city.label
    const hotels = city.info
    let attractions = monuments[cityName] ? monuments[cityName].cityAttractions.split('|') : []

    const totalAttractions = attractions.length

    let totalDaysInCity = 0
    for (const hotel of hotels) {
      const [checkIn, checkOut] = hotel.checkInCheckOut.map(date => new Date(date))
      totalDaysInCity += Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    }

    let attractionsPerDay = Math.floor(totalAttractions / totalDaysInCity)
    let remainingAttractions = totalAttractions % totalDaysInCity

    let currentAttractionIndex = 0

    for (let j = 0; j < hotels.length; j++) {
      const hotel = hotels[j]
      const hotelName = hotel.hotel.name
      const { type, extraBed, roomType, image } = hotel.hotel
      const [checkIn, checkOut] = hotel.checkInCheckOut.map(date => new Date(date))
      const checkInCheckOut = `${format(new Date(hotel.checkInCheckOut[0]), 'dd MMM yyyy')} to ${format(
        new Date(hotel.checkInCheckOut[1]),
        'dd MMM yyyy'
      )}`

      if (!currentDate) currentDate = new Date(checkIn)

      while (currentDate < checkOut) {
        const day = itinerary.length + 1
        if (!currentCity) {
          currentCity = cityName
        }

        let dailyAttractionsCount = attractionsPerDay + (remainingAttractions > 0 ? 1 : 0)
        if (remainingAttractions > 0) remainingAttractions--

        const dayAttractions = attractions.slice(currentAttractionIndex, currentAttractionIndex + dailyAttractionsCount)
        currentAttractionIndex += dailyAttractionsCount

        let hotelInfo = { hotelType: type, roomType, extraBed }
        let meals = []
        // First day in the city
        if (day == 1) {
          let description = `Upon your arrival in ${cityName}, ${monuments[cityName]?.cityIntro ?? ''}`
          if (transportData.vehicleType) {
            description += `you will be transferred to your hotel in a comfortable ${transportData.vehicleType} Vehicle`
          }
          description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (hotel.lunch) {
            meals.push('Lunch')
            description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }

          let footer = ''
          if (hotel.dinner) {
            meals.push('Dinner')
            footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }
          itinerary.push({
            head: `Day ${day} | Arrival in ${cityName}`,
            hotelInfo: { ...hotelInfo, meals },
            hotelImage: image != 'singapore' ? image : '',
            hotelName,
            date: '',
            description,
            attractions: dayAttractions,
            footer,
            checkInCheckOut,
            cityImage: monuments[cityName].cityImage,
            cityName
          })
          currentCity = cityName
          currentHotel = hotelName
        }
        // If staying in the same city
        else if (currentCity === cityName) {
          // If the hotel changes
          if (currentHotel !== hotelName) {
            let description = ''
            if (hotel.breakfast) {
              meals.push('Breakfast')
              description += 'Enjoy a delicious breakfast at the hotel.'
            }
            description += 'complete the check-out formalities and proceed to your next hotel.'
            if (transportData.vehicleType) {
              description += `you will be transferred to your hotel in a comfortable ${transportData.vehicleType} Vehicle.`
            }
            description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}. Dive deeper into the city's charm`
            if (hotel.lunch) {
              meals.push('Lunch')
              description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            }
            let footer = ''
            if (hotel.dinner) {
              meals.push('Dinner')
              footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
            } else {
              footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
            }
            itinerary.push({
              head: `Day ${day} | From ${currentHotel} to ${hotelName} in ${cityName}`,
              hotelInfo: { ...hotelInfo, meals },
              hotelImage: image != 'singapore' ? image : '',
              hotelName,
              date: '',
              description,
              attractions: dayAttractions,
              footer,
              checkInCheckOut,
              cityImage: monuments[cityName].cityImage,
              cityName
            })
            currentHotel = hotelName
          } else {
            let description = "Dive deeper into the city's charm"
            if (hotel.breakfast) {
              meals.push('Breakfast')
              description += 'Enjoy a delicious breakfast at the hotel.'
            }
            if (hotel.lunch) {
              meals.push('Lunch')
              description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            }

            let footer = ''
            if (hotel.dinner) {
              meals.push('Dinner')
              footer += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
            } else {
              footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
            }
            itinerary.push({
              head: `Day ${day} | Continue exploring ${cityName}`,
              hotelInfo: { ...hotelInfo, meals },
              hotelImage: image != 'singapore' ? image : '',
              hotelName,
              date: '',
              description,
              attractions: dayAttractions,
              footer,
              checkInCheckOut,
              cityImage: monuments[cityName].cityImage,
              cityName
            })
          }
        }
        // If the city changes
        else {
          let description = ''
          if (hotel.breakfast) {
            meals.push('Breakfast')
            description += 'Enjoy a delicious breakfast at the hotel.'
          }
          description += 'complete the check-out formalities and proceed to your onward journey.'
          description += `Upon your arrival in ${cityName}, ${monuments[cityName]?.cityIntro ?? ''}`
          if (transportData.vehicleType) {
            description += `you will be transferred to your hotel in a comfortable ${transportData.vehicleType} Vehicle`
          }
          description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (hotel.lunch) {
            meals.push('Lunch')
            description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }
          let footer = ''
          if (hotel.dinner) {
            meals.push('Dinner')
            footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }
          itinerary.push({
            head: `Day ${day} | ${currentCity} to ${cityName}`,
            hotelInfo: { ...hotelInfo, meals },
            hotelImage: image != 'singapore' ? image : '',
            hotelName,
            date: '',
            description,
            attractions: dayAttractions,
            footer,
            checkInCheckOut,
            cityImage: monuments[cityName].cityImage,
            cityName
          })
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
      const cityImage = `${rowData.city_image}`
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

const getHotelFare = cities => {
  const hotelRate = JSON.parse(localStorage.getItem('hotelRates'))
  const roomsList = JSON.parse(localStorage.getItem('roomsList'))
  let hotelAmount = 0
  let totalNights = 0
  cities.map(city => {
    const { label, info } = city
    info.map(currHotel => {
      const { breakfast, lunch, dinner, rooms, extraBed, hotel, checkInCheckOut, adult, child } = currHotel
      const { type, name } = hotel
      const totalDayNight = Number(getDayNightCount(checkInCheckOut))
      totalNights += totalDayNight
      const hotelInfo =
        hotelRate[
          label
            ? label
                .split(' ')
                .map(c => c.toLowerCase())
                .join('_')
            : ''
        ][type][name]

      Object.keys(hotel).map(data => {
        if (roomsList.includes(data)) {
          hotelAmount += Number(hotel[data]) * Number(hotelInfo[data]) * totalDayNight
          // console.log("room: ", Number(hotel[data]) * Number(hotelInfo[data]) * totalDayNight)
        }
      })

      if (breakfast) {
        hotelAmount += Number(hotelInfo['breakfast']) * (Number(adult) + Number(child)) * totalDayNight
        // console.log('breakfast: ', Number(hotelInfo['breakfast']) * (Number(adult) + Number(child)) * totalDayNight)
      }
      if (lunch) {
        hotelAmount += Number(hotelInfo['lunch']) * (Number(adult) + Number(child)) * totalDayNight
        // console.log('lunch: ', Number(hotelInfo['lunch']) * (Number(adult) + Number(child)) * totalDayNight)
      }
      if (dinner) {
        hotelAmount += Number(hotelInfo['dinner']) * (Number(adult) + Number(child)) * totalDayNight
        // console.log('dinner: ', Number(hotelInfo['dinner']) * (Number(adult) + Number(child)) * totalDayNight)
      }
      if (extraBed) {
        hotelAmount += Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight
        // console.log('extrabed: ', Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight)
      }
    })
  })

  return { hotelAmount: hotelAmount, totalNights }
}

const getTransportFare = (data, cities) => {
  const { totalDays, totalDistance, vehicleType, additionalStops } = data
  const transportRate = JSON.parse(localStorage.getItem('transportRates'))
  const vehicleRates = transportRate[vehicleType]

  if (cities.current.length == 1) {
    let totalAmount = Number(vehicleRates['city_local_fare'] * Number(totalDays))
    if (additionalStops.length > 0) {
      const tempTotalDistance = totalDistance < 280 ? 280 : totalDistance
      const remainingAmount =
        tempTotalDistance * Number(vehicleRates['amount_per_km']) +
        Number(vehicleRates['toll_charges_per_day']) +
        Number(vehicleRates['driver_charges_per_day']) +
        Number(vehicleRates['parking_charges_per_day']) +
        Number(vehicleRates['service_cleaning_charge_one_time'])
      totalAmount += remainingAmount
    }
    return totalAmount
  } else {
    const distanceAmount =
      Number(totalDays) * Number(vehicleRates['minimum_km_charge']) * Number(vehicleRates['amount_per_km'])

    let distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])

    if (totalDistance >= 1500) {
      distanceAmount2 = distanceAmount2 * 1.32
    }

    const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
    const driverAmount = Number(vehicleRates['driver_charges_per_day']) * Number(totalDays)
    const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
    const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])

    const totalAmount =
      (distanceAmount > distanceAmount2 ? distanceAmount : Math.floor(distanceAmount2)) +
      Number(tollAmount) +
      Number(driverAmount) +
      Number(parkingCharges) +
      Number(cleaningAmount)

    return totalAmount
  }
}

const inclusionItems = [
  { text: 'Refresh yourself with a delightful welcome drink upon arrival.', icon: InclusionIcon },
  {
    text: 'Enjoy carefully curated meals as per the itinerary, featuring local flavors and international favorites.',
    icon: InclusionIcon
  },
  {
    text: 'Rest easy in well-chosen, comfortable hotels for the nights specified in your package.',
    icon: InclusionIcon
  },
  {
    text: 'Explore the best of the destination with private vehicle transfers for sightseeing, ensuring a smooth and personalized experience.',
    icon: InclusionIcon
  },
  {
    text: 'All toll taxes, parking fees, and driver charges are fully covered within the package for your peace of mind.',
    icon: InclusionIcon
  }
]

const knowBeforeItems = [
  { text: 'Welcome drink on arrival.', icon: KnowBeforeYouGo },
  { text: 'Daily Delicious Buffet Breakfast in Every Hotel.', icon: KnowBeforeYouGo },
  { text: 'Breakfast + dinner in desert camp & camel ride at camp.', icon: KnowBeforeYouGo },
  { text: 'Accommodation in 3 star Hotels & camp for 05 Nights.', icon: KnowBeforeYouGo },
  { text: 'All applicable transportation and Hotel Taxes.', icon: KnowBeforeYouGo },
  { text: 'Cultural shows & dances at Camp.', icon: KnowBeforeYouGo }
]

const exclusionItems = [
  {
    text: 'Any costs associated with airfare or train travel are not included in the package price.',
    icon: ExclusionIcon
  },
  {
    text: 'Expenses of a personal nature such as laundry, extra services, table bills, and tips or guide fees are not covered.',
    icon: ExclusionIcon
  },
  {
    text: 'Any personal adventure activities or excursions not mentioned in the inclusions are excluded from the package.',
    icon: ExclusionIcon
  },
  {
    text: 'Any medical costs arising from accidents or mishaps during the trip will be the responsibility of the traveler.',
    icon: ExclusionIcon
  },
  { text: 'Room heaters, if requested, will be provided at an additional cost.', icon: ExclusionIcon },
  {
    text: 'Goods and Services Tax (GST) is not included in the quoted price and will be charged separately.',
    icon: ExclusionIcon
  },
  {
    text: 'Any items or services not specifically mentioned under the package inclusions are excluded.',
    icon: ExclusionIcon
  }
]

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
  const [dayWiseItinerary, setDayWiseItinerary] = useState([])
  const [dayWiseItineryStyle, setDayWiseItineryStyle] = useState({
    background: '',
    backgroundSize: '',
    backgroundPosition: ''
  })
  const [states, setStates] = useState([])
  const [monuments, setMonuments] = useState(null)
  const [totalNights, setTotalNights] = useState('')
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  const [error, setError] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [offerPrice, setOfferPrice] = useState('')
  const [data, setData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchMonumentsData()
    fetchHotelData()
  }, [])

  useEffect(() => {
    if (isLoaded) {
      getTotalAmount()
    }
  }, [isLoaded])

  const fetchHotelData = async () => {
    const HOTEL_SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const HOTEL_URL = `https://sheets.googleapis.com/v4/spreadsheets/${HOTEL_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    setIsLoading(true)
    try {
      const response = await axios.get(HOTEL_URL)
      setIsLoading(false)
      const finalData = transformHotelData(response.data.values).stateList
      const cityLabels = cities.current.map(item => item.label)
      const selectedStates = finalData
        .map(state => {
          const filteredCities = state.cities.filter(city => cityLabels.includes(city.name))
          return {
            ...state,
            cities: filteredCities
          }
        })
        .filter(state => state.cities.length > 0)
      setStates(selectedStates)
      localStorage.setItem('selectedStates', JSON.stringify(selectedStates))
    } catch (error) {
      setIsLoading(false)
      toast.error('Failded fetching quotation data')
    }
  }

  const fetchMonumentsData = async () => {
    const MONUMENTS_SHEET_ID = process.env.NEXT_PUBLIC_MONUMENTS_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const MONUMENTS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${MONUMENTS_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      setIsLoading(true)
      const response = await axios.get(MONUMENTS_URL)
      setIsLoading(false)
      const finalData = generateMonumentsData(response.data.values ?? [])
      const itineraryDayWiseData = generateDayWiseItinerary(cities.current, transportData.current, finalData.result)
      getDayWiseItineryStyle(itineraryDayWiseData)
      setDayWiseItinerary(itineraryDayWiseData)

      setMonuments(finalData.result)
    } catch (error) {
      toast.error('Failed fetching monuments data')
      console.error('Error fetching data:', error)
    }
  }

  const getDayWiseItineryStyle = itineraryDayWiseData => {
    let background = ['url(/images/background-image.jpg)']
    // let backgroundPosition = ['0vh 0vh']
    let backgroundPosition = ['0px 0px']
    let backgroundSize = ['100%']
    let prevCity = ''
    let currIndex = 0
    itineraryDayWiseData.map((itinerary, index) => {
      if (prevCity.length == 0 || prevCity != itinerary.cityName) {
        prevCity = itinerary.cityName
        currIndex = 0
      } else {
        currIndex += 1
      }
      background.push(`url('/images/pdf-image/${itinerary.cityName}/${itinerary.cityName}00${currIndex + 1}.jpg')`)
      // backgroundPosition.push(`0vh ${(index + 1) * 136}vh`)
      backgroundPosition.push(`0px ${(index + 1) * 1120}px`)
      backgroundSize.push('100%')
    })

    background.push('url(/images/background-image.jpg)')
    // backgroundPosition.push(`0vh ${(itineraryDayWiseData.length + 1) * 136}vh`)
    backgroundPosition.push(`0px ${(itineraryDayWiseData.length + 1) * 1120}px`)
    backgroundSize.push('100%')

    setDayWiseItineryStyle({
      background: background.join(', '),
      backgroundPosition: backgroundPosition.join(', '),
      backgroundSize: backgroundSize.join(', ')
    })
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
            checkpoints: transportData.current.additionalStops.map(stop => stop.description),
            transportStartDate: transportData.current.departureReturnDate[0],
            transportEndDate: transportData.current.departureReturnDate[1]
          }
        : null,
      totalAmount: `${totalAmount}`
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const api_url = `${BASE_URL}/${clientType.current}`
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
      resetLocalStorage()
      router.push('/')
    } else {
      toast.error(response.error)
    }
  }

  const getTotalAmount = () => {
    const { from, to, additionalStops, departureReturnDate } = transportData.current
    const origin = typeof from == 'object' ? from.description : from
    const destination = typeof from == 'object' ? to.description : to

    const date1 = new Date(departureReturnDate[0])
    const date2 = new Date(departureReturnDate[1])

    const diffInMs = date2 - date1

    const totalDays = diffInMs / (1000 * 60 * 60 * 24)

    const directionsService = new window.google.maps.DirectionsService()

    let waypoints =
      additionalStops.length > 0
        ? additionalStops.map((item, index) => {
            return { location: item.description, stopover: true }
          })
        : []

    let distanceObj = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    }

    if (origin != destination) {
      waypoints = [...waypoints, { location: origin, stopover: true }]
      distanceObj = { ...distanceObj, destination: destination }
    }

    directionsService.route(
      waypoints.length > 0
        ? {
            ...distanceObj,
            waypoints
          }
        : distanceObj,
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
          const totalDistance = (totalDist / 1000).toFixed(2)
          // const totalTransportAmount = 0
          const totalTransportAmount =
            getTransportFare(
              {
                ...transportData.current,
                totalDistance,
                totalDays: totalDays + 1,
                additionalStops
              },
              cities
            ) ?? 0
          const { hotelAmount: totalHotelAmount, totalNights: totalNightCount } = getHotelFare(cities.current)
          const hotelFinalAmount =
            clientType.current == 'admin'
              ? Number(totalHotelAmount)
              : clientType.current == 'employee'
              ? Number(totalHotelAmount) * 1.265
              : Number(totalHotelAmount) * 0.95

          const transportFinalAmount =
            clientType.current == 'admin'
              ? Number(totalTransportAmount)
              : clientType.current == 'employee'
              ? Number(totalTransportAmount) * 1.265
              : Number(totalTransportAmount) * 0.95
          setTotalAmount(Number(hotelFinalAmount) + Number(transportFinalAmount))
          setTotalNights(totalNightCount)
        } else {
          toast.error(`error fetching distance: ${result?.status}`)
          setTotalAmount(0)
        }
      }
    )
  }

  const resetLocalStorage = () => {
    localStorage.removeItem('selectedStates')
    localStorage.removeItem('citiesHotels')
    localStorage.removeItem('quotationId')
    localStorage.removeItem('quotationName')
    localStorage.removeItem('transport')
    localStorage.removeItem('travel')
  }

  return (
    <>
      <Loader open={isLoading} />
      <Grid container spacing={6} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Grid sx={{ mt: 10 }}>
          <Card
            sx={{
              height: '842px',
              overflow: 'auto'
            }}
          >
            <CardContent
              sx={{
                '&.MuiCardContent-root': {
                  padding: 0
                }
              }}
              ref={targetRef}
            >
              <div
                style={{
                  backgroundImage: `${dayWiseItineryStyle.background}`,
                  backgroundPosition: `${dayWiseItineryStyle.backgroundPosition}`,
                  backgroundSize: `${dayWiseItineryStyle.backgroundSize}`,
                  backgroundRepeat: 'no-repeat',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '210mm',
                  height: '100%',
                  margin: '0 auto',
                  border: '1px solid #000',
                  padding: '30px',
                  boxSizing: 'border-box',
                  overflow: 'auto'
                }}
              >
                <div className='Header'>
                  <img className='logo' src='/images/logo_full.png' />
                  <div className='days-nights'>
                    {DayNight}
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
                    {TravellerName}
                    <span>{travelInfoData.current.name}</span>
                  </div>
                  <div className='date'>
                    {TravelDate}
                    <span>
                      {format(new Date(travelInfoData.current.dates[0]), 'dd MMM yyyy')} -{' '}
                      {format(new Date(new Date(travelInfoData.current.dates[1])), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>

                <div className='route'>
                  {RouteMap}
                  {cities.current.map((city, index) => (
                    <span key={index}>
                      {city.label ? `${city.label[0].toUpperCase()}${city.label.slice(1)}` : ''}
                      {index != cities.current.length - 1 ? ' - ' : ''}
                    </span>
                  ))}
                </div>

                <div>
                  <div className='accommodation-section'>
                    <h3 className='accommodation-title'>Accommodation Overview</h3>
                    <div className='travel-basic-details'>
                      <div className='no-of-traveller'>
                        {PersonCount}
                        <span>{cities.current[0]?.info[0]?.persons ?? ''}</span>
                      </div>

                      <div className='hotel-category'>
                        {HotelCategory}
                        <span>{getUniqueHotelTypes(cities.current).join(', ')}</span>
                      </div>

                      <div className='no-of-rooms'>
                        {RoomCount}
                        <span>{cities.current[0].info[0].rooms}</span>
                      </div>
                    </div>

                    <div className='travel-basic-details'>
                      <div className='no-of-traveller'>
                        {RoomCategory}
                        <span>Basic Room</span>
                      </div>

                      <div className='hotel-category'>
                        {MealIcon}
                        <span>
                          {cities.current[0].info[0].breakfast &&
                          cities.current[0].info[0].lunch &&
                          cities.current[0].info[0].dinner
                            ? 'Breakfast, Lunch, Dinner'
                            : cities.current[0].info[0].breakfast && cities.current[0].info[0].lunch
                            ? 'Breakfast, Lunch'
                            : cities.current[0].info[0].breakfast && cities.current[0].info[0].dinner
                            ? 'Breakfast, Dinner'
                            : cities.current[0].info[0].lunch && cities.current[0].info[0].dinner
                            ? 'Lunch, Dinner'
                            : cities.current[0].info[0].breakfast
                            ? 'Breakfast'
                            : cities.current[0].info[0].lunch
                            ? 'Lunch'
                            : 'Dinner'}
                        </span>
                      </div>

                      {![undefined, null].includes(cities.current[0].info[0].extraBed) && (
                        <div className='no-of-rooms'>
                          {BedCount}
                          <span>{cities.current[0].info[0].extraBed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='price-section' style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }}>
                  <div className='price-section-total'>
                    <span className='total-amount'>Total : ₹{offerPrice.length > 0 ? offerPrice : totalAmount}</span>
                  </div>

                  <div className='price-section-state'>
                    <div>
                      {states.map((state, index) => (
                        <span key={index}>
                          {state ? `${state.name[0].toUpperCase()}${state.name.slice(1)}` : ' '}
                          {index != states.length - 1 ? ' | ' : ''}
                        </span>
                      ))}
                    </div>
                    <span className='no-of-nights'>{` | ${totalNights}N`}</span>
                  </div>
                </div>

                <div style={{ height: '180px' }}>
                  <div className='transportation-section'>
                    <h3 className='accommodation-title'>Transportation Overview</h3>
                    <div className='travel-basic-details'>
                      <div className='pick-up-location'>
                        {PickupLocation}
                        <span>
                          {typeof transportData.current.from == 'object'
                            ? transportData.current.from.description
                            : transportData.current.from}
                        </span>
                      </div>

                      <div className='drop-location'>
                        {DropLocation}
                        <span>
                          {typeof transportData.current.to == 'object'
                            ? transportData.current.to.description
                            : transportData.current.to}
                        </span>
                      </div>

                      <div className='vehicle-type'>
                        {vehicleType}
                        <span>
                          {transportData.current.vehicleType
                            ? `${transportData.current.vehicleType[0].toUpperCase()}${transportData.current.vehicleType.slice(
                                1
                              )}`
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='itinerary-section'>
                  <h3 className='itinerary-title'>Day Wise Itinerary</h3>
                </div>

                {dayWiseItinerary.map((itinerary, index) => (
                  <div key={index}>
                    <div className='days-section'>
                      <h3 className='itinerary-title'>{itinerary.head}</h3>
                      <div className='travel-inclusive'>
                        {HotelCategory}
                        <span>{itinerary.hotelInfo.hotelType}</span> <span>|</span>
                        {RoomCategory}
                        <span>Base Catagory</span>
                        <span>|</span>
                        {SeightSeeing}
                        <span>Sightseeing</span>
                        <span>|</span>
                        {itinerary.hotelInfo.extraBed && (
                          <>
                            {BedCount}
                            <span>{itinerary.hotelInfo.extraBed}</span>
                            <span>|</span>
                          </>
                        )}
                        {itinerary.hotelInfo.meals.length > 0 && (
                          <>
                            {MealIcon}
                            <span>{itinerary.hotelInfo.meals.join(', ')}</span>
                          </>
                        )}
                      </div>
                      <div className='daywise-itinerary'>
                        <img
                          src={itinerary.hotelImage.length > 0 ? itinerary.hotelImage : '/images/hotels/jaipur.jpg'}
                          width='320px'
                          height='150px'
                        />
                        <div style={{ marginLeft: '20px', width: '50%' }}>
                          <div className='hotel-name'>
                            {HotelName}
                            <span>{itinerary.hotelName}</span>
                          </div>
                          <div className='checkin-checkout'>
                            {TravelDate}
                            <span>{itinerary.checkInCheckOut}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className='day-description'>{itinerary.description}</p>
                        {itinerary.attractions.map((place, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            {MonumentBullets}
                            <p className='day-attraction-dexcription'>
                              <b>{place.split(':')[0]} : </b> {place.split(':')[1]}
                            </p>
                          </div>
                        ))}
                        <p className='day-description'>{itinerary.footer}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {dayWiseItinerary.length > 0 && (
                  <div>
                    <div className='days-section'>
                      <h3 className='itinerary-title'>Departure Day | A Sweet Farewell</h3>
                      <p className='day-description'>
                        {dayWiseItinerary[dayWiseItinerary.length - 1].hotelInfo.meals.includes('Breakfast')
                          ? 'Begin your day with a delightful breakfast at the hotel before checking out. If you’ve hired a vehicle with us, our driver will ensure a smooth and timely transfer to your next destination or departure point. Double-check your belongings and cherish the memories of this incredible adventure.'
                          : 'Start your day by checking out of the hotel as your journey concludes. Please ensure all your belongings are packed and ready. If you’ve arranged your own transport, we wish you safe and pleasant travels ahead. Thank you for choosing us to be a part of your journey.'}
                      </p>
                    </div>
                  </div>
                )}
                {console.log(dayWiseItinerary)}

                <div className='bullet-points'>
                  <h6 className='bullet-title'>Inclusion</h6>
                  {inclusionItems.map((item, index) => (
                    <BulletPoint key={`inclusion-${index}`} text={item.text} icon={item.icon} />
                  ))}
                </div>

                <div className='bullet-points'>
                  <h6 className='bullet-title'>Exclusion</h6>
                  {exclusionItems.map((item, index) => (
                    <BulletPoint key={`exclusion-${index}`} text={item.text} icon={item.icon} />
                  ))}
                </div>

                <div className='bullet-points'>
                  <h6 className='bullet-title'>Know Before You Go</h6>
                  {knowBeforeItems.map((item, index) => (
                    <BulletPoint key={`knowBefore-${index}`} text={item.text} icon={item.icon} />
                  ))}
                </div>

                <div className='contact-info-last'>
                  <h6 className='contact-info-title'>Name of Employee here</h6>
                  <p className='contact-info-designation'>Designation of Employee</p>
                  <div className='contact-info-emailphone'>
                    <p>+91 88888 66666 </p> <span style={{ margin: '0 10px' }}> | </span> <p> myemail@domain.com</p>
                  </div>
                  <p className='contact-info-address'>
                    <span>Jagdamba Colony, Vidhyadhar Nagar, Jaipur - 302023</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ '&.MuiGrid-item': { pt: 0 }, mt: 10 }} item xl={3} md={4} xs={12}>
          <Card>
            <CardContent>
              <TextField disabled fullWidth label='ARH Price' value={totalAmount} InputLabelProps={{ shrink: true }} />

              <TextField
                fullWidth
                label='Offer Price'
                sx={{ mt: 5 }}
                value={offerPrice}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setOfferPrice(value)
                }}
              />
            </CardContent>
          </Card>
          <Card sx={{ mt: 5 }}>
            <CardContent>
              <Button
                fullWidth
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                variant='outlined'
                startIcon={<Icon icon='mdi:custom-file-add' />}
                onClick={() => {
                  resetLocalStorage()
                  router.push('/quotations')
                }}
              >
                Create New Quotation
              </Button>
              <Button
                fullWidth
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                variant='outlined'
                startIcon={<Icon icon='mdi:custom-file-edit' />}
                onClick={() => router.push('/quotations')}
              >
                Edit Quote
              </Button>
              <Button
                fullWidth
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                startIcon={<Icon icon='mdi:custom-file-download' />}
                onClick={() => toPDF()}
                variant='outlined'
              >
                Download Pdf
              </Button>
              <Button
                fullWidth
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                variant='outlined'
                startIcon={<Icon icon='mdi:custom-send-quote' />}
              >
                Send Quote For Approval
              </Button>
              <Button
                fullWidth
                variant='outlined'
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                startIcon={<Icon icon='mdi:custom-cancel-quote' />}
                onClick={() => {
                  resetLocalStorage()
                  router.push('/')
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={() => saveQuotation()}
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
