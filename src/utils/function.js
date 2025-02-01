export const getDayNightCount = dates => {
  if (dates[1] == null) {
    return
  }

  const date1 = new Date(dates[0])
  const date2 = new Date(dates[1])

  const diffInMs = date2 - date1

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays
}

export const transformHotelData = data => {
  // console.log('data: ', data)
  const headers = data[0]
  // console.log('headers: ', headers)
  const result = {}

  const matchingColumnIndices = headers
    .map((header, index) => (header?.startsWith('room_type_') && header?.endsWith('_tag') ? index : -1))
    .filter(index => index !== -1)
  // console.log('matchingColumnIndices: ', matchingColumnIndices)

  const filtered = data.slice(1).map(row => matchingColumnIndices.map(colIndex => row[colIndex] || ''))
  // console.log('filtered: ', filtered)

  let roomsList = []
  filtered.map(data =>
    data.map(item => {
      if (item.length > 0 && !roomsList.includes(item)) roomsList.push(item)
    })
  )
  // console.log('roomsList: ', roomsList)

  const stateList = []

  data.slice(1).forEach(row => {
    if (row.length > 0) {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))
      // console.log('rowData: ', rowData)

      const stateKey = `${
        rowData.destination
          ? rowData.destination
              .split(' ')
              .map(c => c.toLowerCase())
              .join('_')
          : rowData.destination
      }`

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

      if (!result[cityKey]) {
        const existingState = stateList.find(state => state.name == stateKey)
        if (existingState) {
          existingState.cities.push({ name: cityKey })
        } else {
          stateList.push({ name: stateKey, cities: [{ name: cityKey }] })
        }
        result[cityKey] = {}
      }

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
        [`${rowData.room_type_4_tag}`]: rowData.room_type_4 || '',
        // roomsType: [
        //   { roomType: rowData.room_type_1_tag, price: room_type_1 || '' },
        //   { roomType: rowData.room_type_2_tag, price: room_type_2 || '' },
        //   { roomType: rowData.room_type_3_tag, price: room_type_3 || '' },
        //   { roomType: rowData.room_type_4_tag, price: room_type_4 || '' }
        // ],
        minPrice: rowData.room_type_1
          ? rowData.room_type_1
          : rowData.room_type_2
          ? rowData.room_type_2
          : rowData.room_type_3
          ? rowData.room_type_3
          : rowData.room_type_4
          ? rowData.room_type_4
          : '',
        maxPrice: rowData.room_type_4
          ? rowData.room_type_4
          : rowData.room_type_3
          ? rowData.room_type_3
          : rowData.room_type_2
          ? rowData.room_type_2
          : rowData.room_type_1
          ? rowData.room_type_1
          : '',
        primeHotels: rowData.prime_hotels
      }
    }
  })
  // console.log("stateList: ", stateList)
  // console.log("hotelsRate: ", result)

  return { roomsList, hotelsRate: result, stateList }
}

export const transformTransportData = data => {
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

export const transformMonumentsData = data => {
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

  return result
}

export const generateItineraryCss = () => {
  let style =
    '.accommodation-section,.days-nights,.title-description{backdrop-filter:blur(10px);background-color:rgba(0,0,0,.8)}.date,.days-nights,.route,.traveller-name{border-radius:10px;background-color:rgba(0,0,0,.8);display:flex}.date,.days-nights,.description,.route,.tag-line,.title,.traveller-name{font-family:Montserrat,sans-serif;color:#fff;text-align:center}.tag-line,.title{letter-spacing:3pt;text-transform:uppercase}.Header{display:flex;justify-content:space-between;align-items:center}.logo{height:90px}.days-nights{-webkit-backdrop-filter:blur(50px);align-items:center;font-weight:500;justify-content:center;padding:15px 0;width:200px}.checkin-checkout span,.date span,.days-nights span,.drop-location span,.hotel-category span,.hotel-name span,.no-of-rooms span,.no-of-traveller span,.pick-up-location span,.route span,.traveller-name span,.vehicle-type span{padding-left:8px}.accommodation-section,.title-description{margin:40px auto;-webkit-backdrop-filter:blur(50px);text-align:center;padding:20px;border-radius:15px}.tag-line{font-weight:500;font-size:10px}.description{margin:0;font-weight:400;font-size:16px;line-height:1.6em;letter-spacing:.5px}.accommodation-title,.itinerary-title{letter-spacing:2pt;text-transform:uppercase}.basic-info{display:flex;width:100%;justify-content:space-between}.date,.route,.traveller-name{backdrop-filter:blur(10px);align-items:center;font-weight:500;padding:15px 0 15px 16px;-webkit-backdrop-filter:blur(50px)}.checkin-checkout,.hotel-name{background-color:rgba(0,0,0,.5);border-radius:10px;padding:15px;color:#fff}.date,.traveller-name{justify-content:flex-start;width:47%}.route{margin-top:2%;justify-content:flex-start}.accommodation-title{text-align:center;font-weight:800;color:#fff}.checkin-checkout,.hotel-name,.price-section-state{font-weight:500;font-family:Montserrat,sans-serif;text-align:center}.travel-basic-details{display:flex;align-items:center;margin-top:12px}.div-for-accomodations{display:flex;flex-direction:column;margin-right:10px}.drop-location,.hotel-category,.no-of-rooms,.no-of-traveller,.pick-up-location,.vehicle-type{display:flex;align-items:center;font-family:Montserrat,sans-serif;font-weight:500;text-align:center;background-color:rgba(0,0,0,.5);border-radius:10px;padding:15px;color:#fff}.drop-location,.no-of-rooms,.no-of-traveller,.pick-up-location{justify-content:left;margin-right:10px}.hotel-category,.vehicle-type{justify-content:left;}.daywise-itinerary,.hotel-name{display:flex;align-items:center;}.daywise-itinerary{margin:20px 0 0}.daywise-itinerary img{text-align:left;display:flex;border-radius:10px}.hotel-name{justify-content:left}.checkin-checkout,.price-section-state{align-items:center;display:flex}.checkin-checkout{justify-content:left;margin-top:20px}.textfield-container{width:48%;color:#fff}.textfield-container label{position:absolute;top:50%;left:12px;transform:translateY(-50%);backdrop-filter:blur(10px);border-radius:3px;padding:0 14px;color:#000;font-size:14px;pointer-events:none;transition:.2s ease-in-out}.textfield-container input:focus+label,.textfield-container input:not(:placeholder-shown)+label{top:-2px;font-size:12px;font-family:Montserrat,sans-serif;color:#fff;padding:3px 6px}.textfield-container input{padding:16px 12px 8px 40px;border:1px solid #ccc;border-radius:7px;font-size:16px;outline:0;box-sizing:border-box;color:#fff;background-color:#00000000}.icon-input{color:#fff;position:absolute;font-size:18px;top:35%;left:4%}.no-of-person-position{position:relative;bottom:200px;left:18px}.hotel-category-position{position:relative;bottom:244px;left:255px}.room-type-position{position:relative;bottom:288px;left:490px}.Included-meals-position{position:relative;bottom:259px;left:255px}.no-of-rooms-position{position:relative;bottom:303px;left:490px}.Extra-bed-position{position:relative;bottom:347px;left:18px}.price-section-state{position:relative;bottom:7em;left:32em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(50px);background-color:rgba(255,255,255,.8);border-radius:5px;justify-content:center;padding:5px 0;width:11em;color:#000;font-size:9px}.price-section-state i{display:flex;align-items:center;padding-right:5px;font-size:12px}.price-section-total{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(50px);background-color:rgba(0,0,0,.8);border-radius:50px;margin:0 auto;font-family:Arial,sans-serif;font-weight:100;text-align:center;justify-content:center;padding:10px 0;width:200px;color:#ff6f00;font-size:20px}.itinerary-section,.transportation-section{backdrop-filter:blur(10px);border-radius:15px;background-color:rgba(0,0,0,.8)}.itinerary-title,.travel-inclusive{font-family:Montserrat,sans-serif;color:#fff;font-weight:500}.transportation-section{margin:15px auto 40px;-webkit-backdrop-filter:blur(50px);text-align:center;padding:20px}.days-section,.itinerary-section{margin:40px auto;text-align:center}.pickup-location-position{position:relative;bottom:116px;left:18px}.drop-location-position{position:relative;bottom:160px;left:255px}.vehicle-type-position{position:relative;bottom:204px;left:490px}.itinerary-title{text-align:center}.itinerary-section{-webkit-backdrop-filter:blur(50px);padding:10px}.travel-inclusive{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(50px);background-color:rgba(0,0,0,.8);border-radius:10px;display:flex;align-items:center;justify-content:space-evenly;padding:15px}.bullet-points,.contact-info-last,.days-section{background-color:rgba(0,0,0,.8);border-radius:15px}.travel-inclusive i{display:flex;align-items:center;padding-right:10px;font-size:17px}.hotel-name-position{position:relative;bottom:500px;left:375px}.checkin-checkout-date-position{position:relative;bottom:480px;left:375px}.days-section{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(50px);padding:30px}.day-attraction-dexcription,.day-description{text-align:left;font-weight:300;color:#fff;font-family:Montserrat,sans-serif}.bullet-text,.bullet-title,.contact-info-title{font-family:Montserrat,sans-serif;font-weight:500;text-transform:uppercase;color:#fff}.day-description{line-height:1.5em}.day-attraction-dexcription{letter-spacing:.5pt;font-size:15px;margin:0 0 0 10px}.bullet-points,.contact-info-last{margin:40px auto;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(50px);text-align:center;padding:20px 20px 10px}.bullet-points-container{display:flex;justify-content:flex-start;margin-bottom:8px}.bullet-points-container img{padding:10px}.bullet-text{text-align:left;letter-spacing:1pt;font-size:12px;padding-left:8px}.bullet-title,.contact-info-title{letter-spacing:2pt}.bullet-title{text-align:left;font-size:18px;margin:0 0 20px}.svg-container{font-size:14px}.svg-icon{width:1em;height:1em;fill:white}.contact-info-title{text-align:center;font-size:18px;margin:0}.contact-info-designation{margin:0 0 10px;text-align:center;color:#fff}.contact-info-address{color:#fff;text-align:center;display:flex;align-items:center;justify-content:center;margin:0 0 10px}.contact-info-address span{padding-left:5px}.contact-info-emailphone,.follow-on-socialmedia{margin:0 0 10px;display:flex;align-items:center;justify-content:center;color:#fff}.contact-info-emailphone p{margin:0}.choose-us-points li{text-align:left;font-size:15px;color:#fff;padding:20px 0 0;margin:0}.contactinfo-icon-div{background-color:#ffffff80;border-radius:8px;width:35px;height:35px;display:flex;align-items:center;align-content:center;justify-content:center;padding:9px}'

  return style
}

export const extractLocationDetails = placeDetails => {
  if (!placeDetails) return {}
  const addressComponents = placeDetails.address_components || []

  let city = ''
  let state = ''
  let country = ''

  addressComponents.forEach(component => {
    if (component.types.includes('locality')) {
      city = component.long_name
    }
    if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    }
    if (component.types.includes('country')) {
      country = component.long_name
    }
  })

  return { city, state, country }
}

export const generateHotelData = hotelInfoData => {
  const { id, name, type, image, rooms, meals, daysNights, roomsPrice } = hotelInfoData
  const { adult, child, infant, extraBed, checkIn, checkOut } = hotelInfoData
  console.log(hotelInfoData)

  let dataToSend = { id, name, type, image, meals, id, daysNights, roomsPrice }
  dataToSend.rooms = rooms.map(room => {
    const { type, count, price } = room
    return { name: type, count }
  })

  if (adult) dataToSend.adult = adult
  if (child) dataToSend.child = child
  if (infant) dataToSend.infant = infant
  if (extraBed) dataToSend.extraBed = extraBed
  if (meals && meals.length > 0) dataToSend.meals = meals

  return { ...dataToSend, checkIn, checkOut }
}
