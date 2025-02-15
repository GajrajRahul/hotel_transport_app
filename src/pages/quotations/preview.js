import { useState, useEffect, useRef, Fragment } from 'react'
import toast from 'react-hot-toast'
import { usePDF } from 'react-to-pdf'
import { useSelector } from 'react-redux'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { useJsApiLoader } from '@react-google-maps/api'

import { addDays, format, subDays } from 'date-fns'
import axios from 'axios'

import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Icon from 'src/@core/components/icon'
import Loader from 'src/components/common/Loader'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import { postRequest, putRequest } from 'src/api-main-file/APIServices'
import { generateHotelData, generateItineraryCss, getDayNightCount } from 'src/utils/function'
import {
  InstagramIcon,
  FacebookIcon,
  LocationIcon,
  CallIcon,
  EmailIcon,
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
  vehicleType,
  YoutubeIcon
} from 'src/utils/icons'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useAuth } from 'src/hooks/useAuth'
import ShareQuotation from 'src/components/quotation/dialog/ShareQuotation'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const getUniqueHotelTypes = cities => {
  const hotelTypes = cities.flatMap(city => city.info.map(info => info.type))
  return [...new Set(hotelTypes)]
}

const BulletPoint = ({ text, icon }) =>
  text &&
  text.length > 0 && (
    <div className='bullet-points-container'>
      <div className='svg-container'>{icon}</div>
      <div className='bullet-text'>{text}</div>
    </div>
  )

const inclusionItems = [
  { text: 'Enjoy a refreshing welcome drink when you arrive.', icon: InclusionIcon },
  {
    text: 'Delicious meals with local and international flavors. Included meals: ',
    icon: InclusionIcon
  },
  {
    text: 'Stay in cozy, comfortable hotels for the nights included in your package.',
    icon: InclusionIcon
  },
  {
    text: 'Travel around in a private vehicle for sightseeing (if included in your itinerary), making your trip smooth and personal',
    icon: InclusionIcon
  },
  {
    text: 'All tolls, parking fees, and driver charges are taken care of for you.',
    icon: InclusionIcon
  }
]

const knowBeforeItems = [
  {
    text: 'Ensure you have a valid photo ID for a smooth check-in process as per government regulations.',
    icon: KnowBeforeYouGo
  },
  {
    text: 'Check-in time is 12:00 PM and check-out time is 10:00 AM. Please adhere to these times.',
    icon: KnowBeforeYouGo
  },
  {
    text: 'Please note, air conditioning may not be available in hill stations due to local conditions.',
    icon: KnowBeforeYouGo
  },
  {
    text: 'Meal timings are set by the hotel. We are not responsible for meals not availed within the specified times.',
    icon: KnowBeforeYouGo
  },
  {
    text: 'We are not responsible for any cancellations of bus or train services due to weather conditions or unforeseen circumstances.',
    icon: KnowBeforeYouGo
  }
]

const exclusionItems = [
  {
    text: 'Airfare and train tickets are not included in the package.',
    icon: ExclusionIcon
  },
  {
    text: 'Personal expenses like laundry, extra services, table bills, tips, and guide fees are not covered.',
    icon: ExclusionIcon
  },
  {
    text: 'Adventure activities or trips not listed in the inclusions are not part of the package.',
    icon: ExclusionIcon
  },
  {
    text: 'Medical expenses from accidents during the trip are your responsibility.',
    icon: ExclusionIcon
  },
  {
    text: 'Room heaters, if needed, will cost extra.',
    icon: ExclusionIcon
  },
  {
    text: 'GST is not included and will be charged separately.',
    icon: ExclusionIcon
  },
  {
    text: 'Anything not listed in the inclusions is excluded from the package.',
    icon: ExclusionIcon
  }
]

function getCitiesBetweenSameCity(cities, citiesHotels) {
  const result = []
  const cityPositions = {}

  // Track positions of each city
  cities.forEach((city, index) => {
    if (!cityPositions[city]) {
      cityPositions[city] = []
    }
    cityPositions[city].push(index)
  })

  console.log('cities: ', cities)
  console.log('cityPositions: ', cityPositions)
  // Check for cities that appear more than once

  for (let city in cityPositions) {
    console.log('cityPositions[city]: ', cityPositions[city])
    if (cityPositions[city].length > 1) {
      const positions = cityPositions[city]
      // Get cities between the two occurrences
      const start = positions[0] + 1
      const end = positions[1]
      // console.log("start: ", start)
      // console.log("end: ", end)
      if (start < end) {
        const citiesBetween = cities.slice(start, end)
        console.log('citiesBetween: ', citiesBetween)
        let tempCitiesInBetween = []

        for (let betweenCity in citiesBetween) {
          // console.log("betweenCity: ", betweenCity);
          let currCity = citiesHotels.find(c => c.label === citiesBetween[betweenCity].toLowerCase())
          if (!currCity || currCity.info.length == 0) {
            tempCitiesInBetween.push(citiesBetween[betweenCity])
          } else {
            tempCitiesInBetween = []
            break
          }
        }
        // result.push({
        //   betweenCity: city.toLowerCase(),
        //   citiesInBetween: citiesBetween,
        // });
        if (tempCitiesInBetween.length > 0) {
          result.push({
            betweenCity: city.toLowerCase(),
            citiesInBetween: tempCitiesInBetween
          })
        }
      }
    }
  }

  console.log(result)
  return result
}

function generateDayWiseItinerary(cities, transportData, monuments) {
  // console.log('hotelsCities: ', cities)
  // console.log('transportData: ', transportData)

  // const inBetweenCitiesData = getCitiesBetweenSameCity(transportCities, cities)
  // const dayVisitInBetweenCitiesData = getCitiesBetweenSameCity(transportCities, cities)
  // let currDay = 0

  // let originalTotalDaysInCity = 0
  let itineraries = []
  let currDay = 1

  const { vehicleType } = transportData
  let prevCity = ''

  // need to remove
  let totalRoomTypes = []
  let mealsData = []
  let cityInclusions = []
  let cityInclusionText = ''
  let cityExclusions = []
  let cityExclusionText = ''
  let cityKnowBefores = []
  let cityKnowBeforeText = ''
  let currentDate = null
  let currentHotel = null
  let currentCity = null
  // need to remove

  const transportCities = [
    transportData.from.city || '', // city from "from"
    ...transportData.additionalStops.map(stop => stop.city || ''), // cities from "additionalStops"
    transportData.to.city || '' // city from "to"
  ]

  const dayVisitInBetweenCitiesData = getCitiesBetweenSameCity(transportCities, cities)

  for (let i = 0; i < cities.length; i++) {
    const { label, state, info, monuments } = cities[i]
    let allMonuments = []
    monuments.map((monument, idx) => {
      if(monument && monument.monumentDetails) {
        const currMonument = monument.monumentDetails.split('|')
        currMonument.map((currMonu) => {
          allMonuments.push(currMonu)
        })
      }
    })

    let totalDaysInCity = 0

    const cityName = label.toLowerCase()
    let prevHotelName = ''

    const citiesMonuments = monuments
    let monumentsInCityButIsFalse = citiesMonuments.filter(
      monuments => !monuments.showAlert
    )
    // console.log('monumentsInCityButIsFalse: ', monumentsInCityButIsFalse)

    let monumentsInCityButISTrue = citiesMonuments.filter(
      monuments => monuments.showAlert
    )
    // console.log('monumentsInCityButISTrue: ', monumentsInCityButISTrue)

    for (let j = 0; j < info.length; j++) {
      const { name: hotelName, type, image, rooms, meals, daysNights, checkInCheckOut, extraBed } = info[j]
      totalRoomTypes.push(...rooms.map(room => room.type))
      mealsData = meals

      totalDaysInCity += Number(daysNights.split(' Days')[0])
      let totalDaysInSingleHotel = Number(daysNights.split(' Days')[0])
      // let currHotelDay = j == 0 ? 2 : 1
      let currHotelDay = 2

      let [checkIn, checkOut] = checkInCheckOut.map(date => new Date(date))
      const checkInOut = `${format(checkIn, 'dd MMM yyyy')} to ${format(checkOut, 'dd MMM yyyy')}`

      let hotelInfo = { hotelType: type, extraBed, roomTypes: rooms.map(room => room.type) }
      console.log('Number(totalDaysInSingleHotel): ', Number(totalDaysInSingleHotel))

      while (currHotelDay <= Number(totalDaysInSingleHotel)) {
        console.log('currHotelDay: ', currHotelDay)
        if (currDay == 1) {
          prevCity = cityName
          prevHotelName = hotelName
          let description = `Upon your arrival in ${cityName}`
          if (vehicleType) {
            description += `you will be transferred to your hotel in a comfortable ${vehicleType} Vehicle`
          }
          description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (meals.includes('Lunch')) {
            description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }

          let footer = ''
          if (meals.includes('Dinner')) {
            footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }

          itineraries.push({
            head: `Day 1 | Arrival in ${cityName}`,
            hotelInfo: { ...hotelInfo, meals },
            hotelImage: image != 'singapore' ? image : '',
            hotelName,
            date: '',
            description,
            // attractions: dayAttractions,
            // attractions: [],
            attractions: allMonuments,
            footer,
            checkInCheckOut: checkInOut,
            // cityImage: monuments[cityName].cityImage,
            cityImage: '',
            cityName
          })
          // currDay++
          // } else if (currHotelDay == 2) {
        } else if (prevCity != cityName) {
          let description = ''
          prevHotelName = hotelName
          if (meals.includes('Breakfast')) {
            description += 'Enjoy a delicious breakfast at the hotel.'
          }
          description += 'Complete the check-out formalities and proceed to your onward journey.'

          // description += `Upon your arrival in ${cityName}, ${monuments[cityName]?.cityIntro ?? ''}`
          description += `Upon your arrival in ${cityName}, `
          if (vehicleType) {
            description += `you will be transferred to your hotel in a comfortable ${vehicleType} Vehicle`
          }
          description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}`
          if (meals.includes('Lunch')) {
            description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }
          let footer = ''
          if (meals.includes('Dinner')) {
            footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
          } else {
            footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }

          itineraries.push({
            head: `Day ${currDay} | ${prevCity} to ${cityName}`,
            hotelInfo: { ...hotelInfo, meals },
            hotelImage: image != 'singapore' ? image : '',
            hotelName,
            date: '',
            description,
            // attractions: dayAttractions,
            // attractions: [],
            attractions: allMonuments,
            footer,
            checkInCheckOut: checkInOut,
            // cityImage: monuments[cityName].cityImage,
            cityImage: '',
            cityName
          })
          prevCity = cityName
          // currDay++
        } else {
          let description = ''

          console.log('prevHotelName: ', prevHotelName)
          console.log('hotelName: ', hotelName)
          if (prevHotelName != hotelName) {
            if (meals.includes('Breakfast')) {
              description += 'Enjoy a delicious breakfast at the hotel.'
            }
            description += 'Complete the check-out formalities and proceed to your next hotel.'
            if (vehicleType) {
              description += `you will be transferred to your hotel in a comfortable ${transportData.vehicleType} Vehicle.`
            }
            description += `Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${cityName}. Dive deeper into the city's charm`
          } else {
            description += "Dive deeper into the city's charm"
            if (meals.includes('Breakfast')) {
              description += 'Enjoy a delicious breakfast at the hotel.'
            }
          }
          if (meals.includes('Lunch')) {
            description += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          }

          let footer = ''
          if (meals.includes('Dinner')) {
            footer += 'Return to the hotel for a delightful lunch, experiencing authentic flavors.'
          } else {
            footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
          }

          // `Day ${currDay} | From ${currentHotel} to ${hotelName} in ${cityName}`
          itineraries.push({
            head:
              prevHotelName != hotelName
                ? `Day ${currDay} | From ${prevHotelName} to ${hotelName} in ${cityName}`
                : `Day ${currDay} | Continue exploring ${cityName}`,
            hotelInfo: { ...hotelInfo, meals },
            hotelImage: image != 'singapore' ? image : '',
            hotelName,
            date: '',
            description,
            // attractions: dayAttractions,
            // attractions: [],
            attractions: allMonuments,
            footer,
            checkInCheckOut: checkInOut,
            // cityImage: monuments[cityName].cityImage,
            cityImage: '',
            cityName
          })
          prevHotelName = hotelName
        }
        currDay++
        currHotelDay++
      }
    }

    prevCity = cityName
  }

  // const inBetweenCitiesData = getCitiesBetweenSameCity(transportCities, cities)
  // const dayVisitInBetweenCitiesData = getCitiesBetweenSameCity(transportCities, cities)
  // let currDay = 0

  // let originalTotalDaysInCity = 0

  cityInclusions = [
    ...inclusionItems.map(inclusion => {
      return {
        text: inclusion.text.includes('Included meals:')
          ? `${inclusion.text}${[...new Set([...mealsData])].join(', ')}`
          : inclusion.text,
        icon: InclusionIcon
      }
    }),
    ...cityInclusionText.split('|').map(inclusion => {
      return {
        text: inclusion,
        icon: InclusionIcon
      }
    })
  ]
  cityExclusions = [
    ...exclusionItems,
    ...cityExclusionText.split('|').map(exclusion => {
      return {
        text: exclusion,
        icon: ExclusionIcon
      }
    })
  ]
  cityKnowBefores = [
    ...knowBeforeItems,
    ...cityKnowBeforeText.split('|').map(know_before => {
      return {
        text: know_before,
        icon: KnowBeforeYouGo
      }
    })
  ]

  return {
    // itinerary,
    itinerary: itineraries,
    cityInclusions,
    cityExclusions,
    cityKnowBefores,
    totalRoomTypes: [...new Set([...totalRoomTypes])]
  }
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
      const cityInclusion = rowData.inclusion ? `${rowData.inclusion}` : ''
      const cityExclusion = rowData.exclusion ? `${rowData.exclusion}` : ''
      const know_before_you_go = rowData.know_before_you_go ? `${rowData.know_before_you_go}` : ''

      if (!result[cityKey]) {
        result[cityKey] = {}
      }

      result[cityKey] = {
        ...result[cityKey],
        cityIntro: cityIntro || '',
        cityImage: cityImage || '',
        cityAttractions: cityAttractions || '',
        cityInclusion: cityInclusion || '',
        cityExclusion: cityExclusion || '',
        know_before_you_go: know_before_you_go || ''
      }
    }
  })

  return { result }
}

const getHotelFare = (cities, hotelSheetData, hotelSheetInfo) => {
  // console.log('cities are: ', cities)
  // console.log('hotelSheetData are: ', hotelSheetData)
  let hotelAmount = 0
  let totalNights = 0
  cities.map(city => {
    const { label, info } = city
    info.map(currHotel => {
      const { meals, rooms, extraBed, name, type, checkInCheckOut, adult, child, infant } = currHotel
      const totalDayNight = Number(getDayNightCount(checkInCheckOut))
      totalNights += totalDayNight
      const hotelInfo =
        hotelSheetData.hotelsRate[
          label
            ? label
                .split(' ')
                .map(c => c.toLowerCase())
                .join('_')
            : ''
        ][type][name]

      // console.log('hotel: ', hotel)
      const currentCity = hotelSheetInfo.find(data => data.city == label)
      // console.log('currentCity: ', currentCity)
      const curr_hotel = currentCity.hotels.find(data => data.name == name)
      // console.log('curr_hotel: ', curr_hotel)

      rooms.map(room => {
        const { type, count, price } = room
        // console.log('room: ', room)
        const matchingRoom = curr_hotel.rooms.find(data => data.type === room.name)
        // console.log('room price: ', price)
        // console.log('matchingRoom: ', matchingRoom)
        hotelAmount += Number(count) * Number(price ?? matchingRoom.price ?? 0) * totalDayNight
      })

      if (meals.includes('Breakfast')) {
        hotelAmount += Number(hotelInfo['breakfast']) * (Number(adult) + Number(child || 0)) * totalDayNight
        console.log(
          'breakfast: ',
          Number(hotelInfo['breakfast']) * (Number(adult) + Number(child || 0)) * totalDayNight
        )
      }
      if (meals.includes('Lunch')) {
        hotelAmount += Number(hotelInfo['lunch']) * (Number(adult) + Number(child || 0)) * totalDayNight
        console.log('lunch: ', Number(hotelInfo['lunch']) * (Number(adult) + Number(child || 0)) * totalDayNight)
      }
      if (meals.includes('Dinner')) {
        hotelAmount += Number(hotelInfo['dinner']) * (Number(adult) + Number(child || 0)) * totalDayNight
        console.log('dinner: ', Number(hotelInfo['dinner']) * (Number(adult) + Number(child || 0)) * totalDayNight)
      }
      if (extraBed) {
        hotelAmount += Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight
        console.log('extrabed: ', Number(extraBed) * Number(hotelInfo['extrabed']) * totalDayNight)
      }
    })
  })
  console.log('hotelAmount: ', hotelAmount)

  return { hotelAmount: hotelAmount, totalNights }
}

const getTransportFare = (data, transportSheetData) => {
  const { totalDays, totalDistance, vehicleType, additionalStops, isLocal } = data
  const vehicleRates = transportSheetData[vehicleType]

  if (isLocal) {
    let totalAmount = Number(vehicleRates['city_local_fare'] * Number(totalDays))
    if (additionalStops.length > 0) {
      totalAmount = Number(vehicleRates['city_local_fare'] * (Number(totalDays) - 1))
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
    console.log('totalDays: ', totalDays)
    console.log('minimum_km_charge: ', vehicleRates['minimum_km_charge'])
    console.log('amount_per_km: ', vehicleRates['amount_per_km'])
    console.log('distanceAmount: ', distanceAmount)

    let distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])
    console.log('totalDistance: ', totalDistance)
    console.log('distanceAmount2: ', distanceAmount2)

    if (totalDistance >= 1500) {
      distanceAmount2 = distanceAmount2 * 1.32
    }

    const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
    console.log('tollAmount: ', tollAmount)
    const driverAmount = Number(vehicleRates['driver_charges_per_day']) * Number(totalDays)
    console.log('driver_charges_per_day: ', driverAmount)
    const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
    console.log('parking_charges_per_day: ', parkingCharges)
    const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])
    console.log('service_cleaning_charge_one_time: ', cleaningAmount)

    const totalAmount =
      (distanceAmount > distanceAmount2 ? distanceAmount : Math.floor(distanceAmount2)) +
      Number(tollAmount) +
      Number(driverAmount) +
      Number(parkingCharges) +
      Number(cleaningAmount)
    console.log('final totalAmount is: ', totalAmount)

    return totalAmount
  }
}

const getTransportFare2 = (data, transportSheetData) => {
  const { totalDays, totalDistance, vehicleType, additionalStops, isLocal, from, to } = data
  // console.log("dayWiseItinerary: ", dayWiseItinerary)
  // console.log('my selected taxi Data: ', data)
  // console.log('transportSheetData: ', transportSheetData)
  // console.log(from.state)
  // console.log('vehicleType: ', vehicleType)

  const fromState =
    from.city != 'Jaipur' ? transportSheetData[from.state] || transportSheetData['other'] : transportSheetData['other']

  // console.log('fromState: ', fromState)
  const vehicleRates = fromState[vehicleType]
  console.log('totalDays: ', totalDays)
  // console.log('vehicleRates: ', vehicleRates)
  if (isLocal) {
    let totalAmount = Number(vehicleRates['city_local_fare']) * Number(totalDays)
    // console.log("city_local_fare * totalDays: ", Number(vehicleRates['city_local_fare']) * Number(totalDays))
    if (additionalStops.length > 0) {
      totalAmount = Number(vehicleRates['city_local_fare']) * (Number(totalDays) - 1)
      // console.log("city_local_fare * totalDays: ", Number(vehicleRates['city_local_fare']) * Number(totalDays)-1)
      const tempTotalDistance = totalDistance < 280 ? 280 : totalDistance
      const remainingAmount =
        tempTotalDistance * Number(vehicleRates['amount_per_km']) +
        Number(vehicleRates['toll_charges_per_day']) +
        Number(vehicleRates['driver_charges_per_day']) +
        Number(vehicleRates['parking_charges_per_day']) +
        Number(vehicleRates['service_cleaning_charge_one_time'])
      totalAmount += remainingAmount
      console.log('distance by google api * amount_per_km: ', tempTotalDistance * Number(vehicleRates['amount_per_km']))
    }
    return totalAmount
  } else {
    const distanceAmount =
      Number(totalDays) * Number(vehicleRates['minimum_km_charge']) * Number(vehicleRates['amount_per_km'])
    console.log('totalDays * minimum_km_charge * amount_per_km: ', distanceAmount)
    console.log('minimum_km_charge: ', vehicleRates['minimum_km_charge'])
    console.log('amount_per_km: ', vehicleRates['amount_per_km'])

    let distanceAmount2 = totalDistance * Number(vehicleRates['amount_per_km'])
    console.log('distance by google api: ', totalDistance)
    console.log('distance by google api * amount_per_km: ', distanceAmount2)

    if (totalDistance >= 1500) {
      distanceAmount2 = distanceAmount2 * 1.32
    }

    const tollAmount = Number(vehicleRates['toll_charges_per_day']) * Number(totalDays)
    console.log('tollAmount: ', tollAmount)
    const driverAmount = Number(vehicleRates['driver_charges_per_day']) * (Number(totalDays) - 1)
    console.log('driverAmount: ', driverAmount)
    const parkingCharges = Number(vehicleRates['parking_charges_per_day']) * Number(totalDays)
    console.log('parkingCharges: ', parkingCharges)
    const cleaningAmount = Number(vehicleRates['service_cleaning_charge_one_time'])
    console.log('cleaningAmount: ', cleaningAmount)

    const totalAmount =
      (distanceAmount > distanceAmount2 ? distanceAmount : Math.floor(distanceAmount2)) +
      Number(tollAmount) +
      Number(driverAmount) +
      Number(parkingCharges) +
      Number(cleaningAmount)

    return totalAmount
  }
}

const QutationPreview = ({ id }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })
  const hotelSheetData = useSelector(state => state.hotelRateData)
  const transportSheetData = useSelector(state => state.transportRateData)
  const hotelSheetInfo = useSelector(state => state.hotelsInfo)

  const quotationId = useRef(localStorage.getItem('quotationId') ?? '')
  const travelInfoData = useRef(localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null)
  const cities = useRef(localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : [])
  // console.log('cities: ', cities)
  const transportData = useRef(localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null)
  const clientType = useRef(
    ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
      ? localStorage.getItem('clientType')
      : 'admin'
  )
  const [showCopyMessage, setShowCopyMessage] = useState({ status: false, message: '' })
  const quotationName = useRef(localStorage.getItem('quotationName') ? localStorage.getItem('quotationName') : '')
  const [dayWiseItinerary, setDayWiseItinerary] = useState(null)
  const [dayWiseItineryStyle, setDayWiseItineryStyle] = useState({
    background: '',
    backgroundSize: '',
    backgroundPosition: ''
  })
  const [states, setStates] = useState([])
  const [selectedRoomsName, setSelectedRoomsName] = useState([])
  const [monuments, setMonuments] = useState(null)
  const [totalNights, setTotalNights] = useState('')
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  const [error, setError] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [offerPrice, setOfferPrice] = useState('')
  const [pdfUrl, setPdfUrl] = useState(() => localStorage.getItem('pdfUrl') || '')
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [comment, setComment] = useState(() => localStorage.getItem('comment') || '')

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchMonumentsData()
    fetchHotelData()
  }, [])

  useEffect(() => {
    if (isLoaded) {
      getTotalAmount()
    }
  }, [isLoaded])

  const fetchHotelData = () => {
    // console.log("hotelSheetData: ", hotelSheetData)
    const cityLabels = cities.current.map(item => item.label.toLowerCase())
    const selectedStates = hotelSheetData
      ? hotelSheetData.stateList
          .map(state => {
            const filteredCities = state.cities.filter(city => cityLabels.includes(city.name))
            return {
              ...state,
              cities: filteredCities
            }
          })
          .filter(state => state.cities.length > 0)
      : []
    // console.log("selectedStates: ", selectedStates)
    setStates(selectedStates)
    localStorage.setItem('selectedStates', JSON.stringify(selectedStates))
  }

  const fetchMonumentsData = async () => {
    if (quotationName.current.length == 0) {
      setIsLoading(false)
      router.push('/')
      return
    }

    const MONUMENTS_SHEET_ID = process.env.NEXT_PUBLIC_MONUMENTS_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const MONUMENTS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${MONUMENTS_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      // setIsLoading(true)
      const response = await axios.get(MONUMENTS_URL)
      setIsLoading(false)
      const finalData = generateMonumentsData(response.data.values ?? [])
      const itineraryDayWiseData = generateDayWiseItinerary(cities.current, transportData.current, finalData.result)
      setSelectedRoomsName(itineraryDayWiseData.totalRoomTypes)
      getDayWiseItineryStyle(itineraryDayWiseData.itinerary)
      setDayWiseItinerary(itineraryDayWiseData)

      setMonuments(finalData.result)
    } catch (error) {
      toast.error('Failed fetching monuments data')
      console.error('Error fetching data:', error)
    }
  }

  const getDayWiseItineryStyle = itineraryDayWiseData => {
    let background = ['url(https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/background-image.jpg)']
    // let backgroundPosition = ['0vh 0vh']
    let backgroundPosition = ['0px 0px']
    let backgroundSize = ['100%']
    let prevCity = ''
    let currIndex = 0
    itineraryDayWiseData.map((itinerary, index) => {
      if (prevCity && (prevCity.length == 0 || prevCity != itinerary.cityName)) {
        prevCity = itinerary.cityName
        currIndex = 0
      } else {
        currIndex += 1
      }
      // background.push(`url('/images/pdf-image/${itinerary.cityName}/${itinerary.cityName}00${currIndex + 1}.jpg')`)
      background.push(
        `url(https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/pdf-image/${itinerary.cityName}/${
          itinerary.cityName
        }00${currIndex + 1}.jpg)`
      )
      // backgroundPosition.push(`0vh ${(index + 1) * 136}vh`)
      backgroundPosition.push(`0px ${(index + 1) * 1120}px`)
      backgroundSize.push('100%')
    })

    background.push('url(https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/background-image.jpg)')
    // backgroundPosition.push(`0vh ${(itineraryDayWiseData.length + 1) * 136}vh`)
    backgroundPosition.push(`0px ${(itineraryDayWiseData.length + 1) * 1120}px`)
    backgroundSize.push('100%')

    setDayWiseItineryStyle({
      background: background.join(', '),
      backgroundPosition: backgroundPosition.join(', '),
      backgroundSize: backgroundSize.join(', ')
    })
  }

  const saveQuotation = async (status, willGenerateNewPdf) => {
    // console.log("cities.current: ", cities.current)
    // return;
    let dataToSend = {
      willGenerateNewPdf: willGenerateNewPdf ?? false,
      comment,
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
            hotelInfo: info.map(hotelDetails =>
              generateHotelData({
                ...hotelDetails,
                checkIn: hotelDetails.checkInCheckOut[0],
                checkOut: hotelDetails.checkInCheckOut[1]
              })
            )
          }
        })
      },
      transportInfo: transportData
        ? {
            vehicleType: transportData.current.vehicleType,
            from: transportData.current.from,
            isLocal: transportData.current.isLocal,
            to: transportData.current.to,
            checkpoints: transportData.current.additionalStops,
            transportStartDate: transportData.current.departureReturnDate[0],
            transportEndDate: transportData.current.departureReturnDate[1]
          }
        : null,
      totalAmount: `${totalAmount}`,
      companyName: user.companyName,
      userName: user.name,
      htmlContent: targetRef.current
        ? `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adventure Richa Holidays</title><style>${generateItineraryCss()}</style></head><body>${
            targetRef.current.innerHTML
          }</body></html>`
        : '',
      status
    }

    // console.log('dataToSend: ', dataToSend)
    // return
    const createdClientType = localStorage.getItem('createdQuoteClientId')
      ? localStorage.getItem('createdQuoteClientId').split('_')[0]
      : clientType.current

    if (createdClientType == 'employee' || createdClientType == 'partner') {
      dataToSend = { ...dataToSend, userId: localStorage.getItem('createdQuoteClientId') }
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    // const BASE_URL = 'http://localhost:4000/api'
    const api_url = `${BASE_URL}/${createdClientType}`
    setIsLoading(true)
    let response
    if (quotationId.current.length > 0) {
      response = await putRequest(
        `${api_url}/update-quotation`,
        { id: quotationId.current, ...dataToSend },
        { [`${createdClientType}id`]: localStorage.getItem('createdQuoteClientId') }
      )
    } else {
      response = await postRequest(`${api_url}/create-quotation`, dataToSend)
    }
    setIsLoading(false)

    if (response.status) {
      const { link, id } = response.data

      setPdfUrl(link)
      quotationId.current = id
      toast.success(typeof response.data == 'object' ? 'Success' : response.data)
    } else {
      toast.error(response.error)
    }
  }

  const downloadPdf = () => {
    if (pdfUrl == undefined || pdfUrl.length == 0) {
      toast.error('Kindly save pdf first.')
      return
    }

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${quotationName.current}.pdf` // The file name for the downloaded file
    link.target = '_blank' // Ensures it's downloaded, not opened in a new tab
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyPdfTrackerUrl = () => {
    if (quotationId.current.length == 0) {
      toast.error('Kindly save pdf first.')
      return
    }

    navigator.clipboard
      .writeText(`https://crm.adventurerichaholidays.com/pdf?id=${quotationId.current}`)
      // .writeText(`http://localhost:3000/pdf?id=${quotationId.current}`)
      .then(() => {
        setShowCopyMessage({ status: true, message: 'Link copied' })
        toast.success('Copied to clipboard')
      })
      .catch(err => {
        setShowCopyMessage({ status: true, message: 'Unable to copy link, Try again!' })
        toast.error('Unable to copy text to clipboard')
      })
  }

  const getTotalAmount = () => {
    if (!transportData.current) {
      router.push('/')
      return
    }
    const { from, to, additionalStops, departureReturnDate } = transportData.current
    const origin = from.place
    const destination = to.place

    const date1 = new Date(departureReturnDate[0])
    const date2 = new Date(departureReturnDate[1])

    const diffInMs = date2 - date1

    const totalDays = diffInMs / (1000 * 60 * 60 * 24)

    const directionsService = new window.google.maps.DirectionsService()

    let waypoints =
      additionalStops.length > 0
        ? additionalStops.map((item, index) => {
            return { location: item.place, stopover: true }
          })
        : []

    let distanceObj = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    }
    // console.log(waypoints)
    if (origin != destination) {
      // waypoints = [...waypoints, { location: origin, stopover: true }]
      // waypoints = [...waypoints, origin]
      distanceObj = { ...distanceObj, destination: destination }
    }

    directionsService.route(
      waypoints.length > 0
        ? {
            origin,
            waypoints: [...waypoints, { location: destination, stopover: true }],
            destination: origin,
            travelMode: window.google.maps.TravelMode.DRIVING
          }
        : distanceObj,
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          // console.log(result)
          const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
          const totalDistance = (totalDist / 1000).toFixed(2)
          // const totalTransportAmount = 0
          const totalTransportAmount =
            getTransportFare2(
              {
                ...transportData.current,
                totalDistance,
                totalDays: totalDays + 1,
                additionalStops
              },
              transportSheetData
              // dayWiseItinerary
            ) ?? 0
          console.log('totalTransportAmount: ', totalTransportAmount)
          const { hotelAmount: totalHotelAmount, totalNights: totalNightCount } = getHotelFare(
            cities.current,
            hotelSheetData,
            hotelSheetInfo
          )
          const hotelFinalAmount =
            clientType.current == 'admin'
              ? Number(totalHotelAmount)
              : clientType.current == 'employee'
              ? origin == destination
                ? Math.floor(Number(totalHotelAmount) * 1.44)
                : Math.floor(Number(totalHotelAmount) * 1.3)
              : Math.floor(Number(totalHotelAmount) * 1.11)
          console.log('totalHotelAmount: ', totalHotelAmount)

          const transportFinalAmount =
            clientType.current == 'admin'
              ? Number(totalTransportAmount)
              : clientType.current == 'employee'
              ? origin == destination
                ? Math.floor(Number(totalTransportAmount) * 1.44)
                : Math.floor(Number(totalTransportAmount) * 1.3)
              : Math.floor(Number(totalTransportAmount) * 1.11)

          // if (clientType.current == 'employee' && origin == destination) {
          //   setTotalAmount(
          //     Math.floor(Number(hotelFinalAmount) * 1.235) + Math.floor(Number(transportFinalAmount) * 1.235)
          //   )
          // } else {
          setTotalAmount(Number(hotelFinalAmount) + Number(transportFinalAmount))
          // }
          setTotalNights(totalNightCount)
        } else {
          toast.error(`error fetching distance: ${result?.status}`)
          setTotalAmount(0)
        }
      }
    )
  }

  const handleCloseShareDialog = () => {
    setIsShareDialogOpen(false)
  }

  const resetLocalStorage = () => {
    localStorage.removeItem('quotationId')
    localStorage.removeItem('quotationName')
    localStorage.removeItem('quotationStatus')
    localStorage.removeItem('travel')
    localStorage.removeItem('citiesHotels')
    localStorage.removeItem('transport')
    localStorage.removeItem('selectedStates')
    localStorage.removeItem('createdQuoteClientId')
    localStorage.removeItem('pdfUrl')
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
            {dayWiseItinerary && (
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
                    <img
                      className='logo'
                      src='https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/logo_full.png'
                    />
                    <div className='days-nights'>
                      {DayNight}
                      <span>{travelInfoData.current['days-nights']}</span>
                    </div>
                  </div>

                  <div className='title-description'>
                    <div className='tag-line'>Your Gateway to Memorable Journeys</div>
                    <h1 className='title'>Adventure Richa Holidays</h1>
                    <p className='description'>
                      Explore the world with Adventure Richa Holidays! Offering tailored domestic and international
                      tours for individuals, groups, and corporate clients. Adventure and relaxation, all perfectly
                      planned.
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
                        <div className='div-for-accomodations' style={{ width: '30%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Number of Travellers
                          </label>
                          <div className='no-of-traveller'>
                            {PersonCount}
                            <span>
                              {Number(cities.current[0]?.info[0]?.adult || 0) +
                                Number(cities.current[0]?.info[0]?.child || 0) +
                                Number(cities.current[0]?.info[0]?.infant || 0) ?? ''}
                            </span>
                          </div>
                        </div>

                        <div className='div-for-accomodations' style={{ width: '50%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Hotel Category
                          </label>

                          <div className='hotel-category'>
                            {HotelCategory}
                            <span>{getUniqueHotelTypes(cities.current).join(', ')}</span>
                          </div>
                        </div>

                        <div className='div-for-accomodations' style={{ width: '20%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Total Rooms
                          </label>
                          <div className='no-of-rooms'>
                            {RoomCount}
                            <span>
                              {cities.current[0].info[0].rooms.reduce((acc, room) => {
                                acc += Number(room.count)
                                return acc
                              }, 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='travel-basic-details'>
                        <div className='div-for-accomodations' style={{ width: '30%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Room Category
                          </label>
                          <div className='no-of-traveller'>
                            {RoomCategory}
                            <span>{selectedRoomsName.join(', ')}</span>
                            {/* <span>Basic Room</span> */}
                          </div>
                        </div>

                        <div className='div-for-accomodations' style={{ width: '50%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Meals
                          </label>
                          <div className='hotel-category'>
                            {MealIcon}
                            <span>{cities.current[0].info[0].meals.join(', ')}</span>
                          </div>
                        </div>
                        <div className='div-for-accomodations' style={{ width: '20%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Extra Bed
                          </label>
                          <div className='no-of-rooms'>
                            {BedCount}
                            <span>{cities.current[0].info[0].extraBed ?? 0}</span>
                          </div>
                        </div>
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
                        <div className='div-for-accomodations' style={{ width: '40%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Pick-up Location
                          </label>
                          <div className='pick-up-location'>
                            {PickupLocation}
                            <span>{transportData.current.from.place}</span>
                          </div>
                        </div>
                        <div className='div-for-accomodations' style={{ width: '45%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Drop Location
                          </label>
                          <div className='drop-location'>
                            {DropLocation}
                            <span>{transportData.current.to.place}</span>
                          </div>
                        </div>

                        <div className='div-for-accomodations' style={{ width: '15%' }}>
                          <label
                            style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                            htmlFor='traveller-count'
                          >
                            Vehicle
                          </label>
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
                  </div>

                  <div className='itinerary-section'>
                    <h3 className='itinerary-title'>Day Wise Itinerary</h3>
                  </div>

                  {dayWiseItinerary.itinerary.map((itinerary, index) => (
                    <div key={index}>
                      <div className='days-section'>
                        {console.log('itinerary: ', itinerary)}
                        <h3 className='itinerary-title'>{itinerary.head}</h3>
                        <div className='travel-inclusive'>
                          {HotelCategory}
                          <span>{itinerary.hotelInfo.hotelType}</span> <span>|</span>
                          {RoomCategory}
                          <span>{itinerary.hotelInfo.roomTypes.join(',')}</span>
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
                            src={
                              itinerary.hotelImage.length > 0
                                ? itinerary.hotelImage
                                : 'https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/hotels/jaipur.jpg'
                            }
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
                          {console.log('itinerary.attractions: ', itinerary.attractions)}
                          {itinerary.attractions.map((place, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'normal',
                                justifyContent: 'space-around',
                                marginTop: '20px'
                              }}
                            >
                              <img
                                style={{ marginTop: '5px' }}
                                alt='avatar'
                                width='4%'
                                height={30}
                                src='https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/column.png'
                              />
                              <p style={{ width: '95%' }} className='day-attraction-dexcription'>
                                <b>{place.split(':')[0]} : </b> {place.split(':')[1]}
                              </p>
                            </div>
                          ))}
                          <p className='day-description'>{itinerary.footer}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {dayWiseItinerary.itinerary.length > 0 && (
                    <div>
                      <div className='days-section'>
                        <h3 className='itinerary-title'>Departure Day | A Sweet Farewell</h3>
                        <p className='day-description'>
                          {dayWiseItinerary['itinerary'][
                            dayWiseItinerary['itinerary'].length - 1
                          ].hotelInfo.meals.includes('Breakfast')
                            ? 'Begin your day with a delightful breakfast at the hotel before checking out. If you’ve hired a vehicle with us, our driver will ensure a smooth and timely transfer to your next destination or departure point. Double-check your belongings and cherish the memories of this incredible adventure.'
                            : 'Start your day by checking out of the hotel as your journey concludes. Please ensure all your belongings are packed and ready. If you’ve arranged your own transport, we wish you safe and pleasant travels ahead. Thank you for choosing us to be a part of your journey.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {transportData.current.additionalStops.length > 0 && (
                    <div>
                      <div className='days-section'>
                        <h3 className='itinerary-title'>Additional Stops</h3>
                        <p className='day-description'>
                          Your journey will take you through some of the most captivating destinations, including{' '}
                          {transportData.current.additionalStops.map(stop => stop.place).join(' | ')}. Each location
                          offers its own unique charm, from vibrant streets and cultural landmarks to serene landscapes
                          and artistic wonders. Together, they form a rich tapestry of experiences, ensuring that your
                          trip is unforgettable and full of adventure.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='bullet-points'>
                    <h6 className='bullet-title'>Inclusions</h6>
                    {dayWiseItinerary.cityInclusions.map((item, index) => (
                      <BulletPoint key={`inclusion-${index}`} text={item.text} icon={item.icon} />
                    ))}
                  </div>

                  <div className='bullet-points'>
                    <h6 className='bullet-title'>Exclusions</h6>
                    {dayWiseItinerary.cityExclusions.map((item, index) => (
                      <BulletPoint key={`exclusion-${index}`} text={item.text} icon={item.icon} />
                    ))}
                  </div>

                  <div className='bullet-points'>
                    <h6 className='bullet-title'>Things to Remember</h6>
                    {dayWiseItinerary.cityKnowBefores.map((item, index) => (
                      <BulletPoint key={`knowBefore-${index}`} text={item.text} icon={item.icon} />
                    ))}
                  </div>

                  <div className='contact-info-last'>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px 0px 20px 0px'
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '30px', color: '#ffffff', padding: '0px', margin: '0px' }}>
                          {user.name || 'Owner'}
                        </h3>
                        <p
                          style={{
                            fontSize: '15px',
                            color: '#ffffff',
                            padding: '0px',
                            margin: '0px',
                            textAlign: 'left'
                          }}
                        >
                          {user.designation || 'Sales head'}
                        </p>
                      </div>
                      <img
                        src='https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/white_logo.png'
                        height={'70vh'}
                        alt='logo'
                      />
                    </div>
                    <p
                      style={{
                        fontSize: '15px',
                        color: '#ffffff',
                        padding: '20px 0px 0px 0px',
                        margin: '0px 0px 0px 0px',
                        borderTop: '1px solid #ffffff50',
                        textAlign: 'center'
                      }}
                    >
                      {user.about ||
                        "Specializing in both domestic and international travel, we create seamless, personalized tours that turn your travel dreams into reality. Whether you're exploring nearby or venturing abroad, we handle the details, ensuring a smooth and unforgettable experience."}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px 0px 20px 0px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'normal',
                          padding: '10px',
                          backgroundColor: '#ffffff40',
                          margin: '0px 10px 0px 0px ',
                          borderRadius: '10px',
                          width: '100%'
                        }}
                      >
                        <div className='contactinfo-icon-div'> {EmailIcon} </div>
                        <div style={{ textAlign: 'left', padding: '0px 0px 0px 7px' }}>
                          <h3 style={{ fontSize: '10px', color: '#ffffff', padding: '0px', margin: '0px' }}>Email</h3>
                          <p
                            style={{
                              fontSize: '13px',
                              color: '#ffffff',
                              padding: '0px',
                              margin: '0px',
                              textAlign: 'left'
                            }}
                          >
                            {user.email || 'vikas@gmail.com'}
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'normal',
                          padding: '10px',
                          backgroundColor: '#ffffff40',
                          margin: '0px 10px 0px 0px ',
                          borderRadius: '10px',
                          width: '100%'
                        }}
                      >
                        {CallIcon}
                        <div style={{ textAlign: 'left', padding: '0px 0px 0px 7px' }}>
                          <h3 style={{ fontSize: '10px', color: '#ffffff', padding: '0px', margin: '0px' }}>
                            Phone Number
                          </h3>
                          <p
                            style={{
                              fontSize: '13px',
                              color: '#ffffff',
                              padding: '0px',
                              margin: '0px',
                              textAlign: 'left'
                            }}
                          >
                            {user.mobile || '8890842006'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'normal',
                        padding: '10px',
                        backgroundColor: '#ffffff40',
                        borderRadius: '10px'
                      }}
                    >
                      <div className='contactinfo-icon-div'> {LocationIcon} </div>
                      <div style={{ textAlign: 'left', padding: '0px 0px 0px 7px' }}>
                        <h3 style={{ fontSize: '10px', color: '#ffffff', padding: '0px', margin: '0px' }}>Address</h3>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#ffffff',
                            padding: '0px',
                            margin: '0px',
                            textAlign: 'left'
                          }}
                        >
                          {user.address ||
                            'G -22, Pushp Enclave, Sanganer, Sector 11, Pratap Nagar, Jaipur, Rajasthan - 302033'}
                        </p>
                      </div>
                    </div>
                    <h1
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        borderTop: '1px solid #ffffff50',
                        paddingTop: '20px',
                        marginBottom: '0px'
                      }}
                    >
                      {' '}
                      Why Choose Us?
                    </h1>
                    <div className='why-choose-us'>
                      <ul className='choose-us-points'>
                        <li>
                          <strong>Tailored Experiences:</strong> We create customized itineraries that match your
                          interests, preferences, and budget, ensuring your trip is uniquely yours.
                        </li>
                        <li>
                          <strong>Expert Knowledge:</strong> With years of industry experience, our team offers expert
                          advice and insider knowledge to help you discover the best destinations, activities, and
                          hidden gems.
                        </li>
                        <li>
                          <strong>End-to-End Service:</strong> From planning to execution, we handle every
                          detail—flights, accommodation, transportation, and local experiences—so you can focus on
                          enjoying your trip.
                        </li>
                        <li>
                          <strong>Global Reach, Local Expertise:</strong> Whether you’re traveling domestically or
                          internationally, we offer local insights and trusted partnerships to enhance your travel
                          experience.
                        </li>
                        <li>
                          <strong>Customer Satisfaction:</strong> Your satisfaction is our top priority. We are
                          dedicated to providing exceptional customer service, ensuring a smooth and stress-free journey
                          every time.
                        </li>
                        <li>
                          <strong>Affordable Luxury:</strong> Enjoy premium services at competitive prices, ensuring you
                          get the most value for your travel investment.
                        </li>
                        <li>
                          <strong>24/7 Support:</strong> Our dedicated support team is always available to assist you
                          before, during, and after your trip, ensuring peace of mind throughout your journey.
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px 0px 0px 0px'
                      }}
                    >
                      <span style={{ marginRight: '10px' }}>{FacebookIcon} </span>
                      <span style={{ marginRight: '10px' }}>{InstagramIcon} </span>
                      <span style={{ marginRight: '10px' }}>{YoutubeIcon} </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </Grid>
        <Grid sx={{ '&.MuiGrid-item': { pt: 0 }, mt: 10 }} item xl={3} md={4} xs={12}>
          <Card>
            <CardContent>
              <TextField disabled fullWidth label='ARH Price' value={totalAmount} InputLabelProps={{ shrink: true }} />
              <Box
                sx={{
                  mt: 5,
                  padding: '10px 10px 10px 10px',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: 1.5
                }}
              >
                <Typography
                  sx={{ mt: 5, color: 'red', lineHeight: '.4em !important', fontWeight: '500' }}
                  variant='caption'
                >
                  Need Help or Looking for the Best Deal?
                  <br /> Call now at :
                  <span style={{ color: 'red', fontWeight: '700', fontSize: '15px' }}> +91-97841-89197</span>
                </Typography>
              </Box>
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

              {localStorage.getItem('createdQuoteClientId') &&
                !localStorage.getItem('createdQuoteClientId').includes('admin') && (
                  <TextField
                    disabled={clientType.current != 'admin'}
                    fullWidth
                    multiline
                    rows={3}
                    label='Comment'
                    sx={{ mt: 5 }}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                )}
            </CardContent>
            {/* {console.log("clientType: ", clientType)}
            {console.log("isIncludes: ", !localStorage.getItem('createdQuoteClientId').includes('admin'))}
            {console.log("quoteStatus: ", localStorage.getItem('quotationStatus') != 'approved')} */}
            {clientType.current == 'admin' &&
              localStorage.getItem('createdQuoteClientId') &&
              !localStorage.getItem('createdQuoteClientId').includes('admin') && (
                <CardActions>
                  <Button variant='contained' sx={{ mr: 2 }} onClick={() => saveQuotation('approved')}>
                    Approve
                  </Button>
                  <Button color='error' variant='outlined' onClick={() => saveQuotation('rejected')}>
                    Reject
                  </Button>
                </CardActions>
              )}
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
                // onClick={() => toPDF()}
                onClick={() => downloadPdf()}
                variant='outlined'
              >
                Download Pdf
              </Button>
              <Button
                fullWidth
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                startIcon={<Icon icon='mdi:custom-file-download' />}
                onClick={() => copyPdfTrackerUrl()}
                variant='outlined'
              >
                Copy PDF Tracker URL
              </Button>
              {clientType != 'admin' && (
                <Button
                  fullWidth
                  onClick={() => saveQuotation('pending')}
                  sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                  variant='outlined'
                  startIcon={<Icon icon='mdi:custom-send-quote' />}
                >
                  Send Quote For Approval
                </Button>
              )}
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
                onClick={() => saveQuotation('draft', true)}
                variant='outlined'
                sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
                startIcon={<Icon icon='mdi:custom-save-quote' />}
              >
                {quotationId.current.length > 0 ? 'Update' : 'Save'}
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  if (pdfUrl == undefined) {
                    toast.error('Kindly save pdf first.')
                    // return
                  } else if (pdfUrl.length == 0) {
                    toast.error('Kindly save pdf first.')
                  } else {
                    setIsShareDialogOpen(true)
                  }
                }}
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
      <ShareQuotation pdfUrl={pdfUrl} open={isShareDialogOpen} handleClose={handleCloseShareDialog} />
    </>
  )
}

// QutationPreview.getLayout = page => <BlankLayout>{page}</BlankLayout>
// QutationPreview.guestGuard = false

export default QutationPreview
