import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import Button from '@mui/material/Button'

import { useAuth } from 'src/hooks/useAuth'

import {
  CallIcon,
  DayNight,
  DropLocation,
  EmailIcon,
  ExclusionIcon,
  FacebookIcon,
  InclusionIcon,
  InstagramIcon,
  KnowBeforeYouGo,
  LocationIcon,
  MealIcon,
  PersonCount,
  PickupLocation,
  RoomCount,
  RouteMap,
  SeightSeeing,
  TravelDate,
  vehicleType,
  YoutubeIcon
} from 'src/utils/icons'

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

const getDayWiseItinerary = (selectedTravelPackage, monuments) => {
  const dayWiseItinerary = []
  let cityInclusions = []
  let cityInclusionText = ''
  let cityExclusions = []
  let cityExclusionText = ''
  let cityKnowBefores = []
  let cityKnowBeforeText = ''

  const citiesWithNights = selectedTravelPackage['stay_info'].trim().split(',')
  // console.log('citiesWithNights: ', citiesWithNights)
  const stayData = []

  const { no_of_person, food, vehicle } = selectedTravelPackage
  const meals = food.split(',').map(food => {
    if (food == 'BB') return 'Breakfast'
    if (food == 'HB') return 'Lunch'
    if (food == 'FB') return 'Dinner'
  })

  for (let i = 0; i < citiesWithNights.length; i++) {
    const cityWithNights = citiesWithNights[i].trim().split(' ')
    let nights = cityWithNights[0].split('N')[0]
    // console.log('nights: ', nights)
    let cityName = cityWithNights[1].trim().toLowerCase()

    let attractions = monuments[cityName] ? monuments[cityName].cityAttractions.split('|') : []

    cityInclusionText += monuments[cityName] ? monuments[cityName].cityInclusion : ''
    cityExclusionText += monuments[cityName] ? monuments[cityName].cityExclusion : ''
    cityKnowBeforeText += monuments[cityName] ? monuments[cityName].know_before_you_go : ''

    let attractionsPerDay = Math.floor(attractions.length / Number(nights))
    let remainingAttractions = attractions.length % Number(nights)
    let currentAttractionIndex = 0

    while (Number(nights) > 0) {
      let dailyAttractionsCount = attractionsPerDay + (remainingAttractions > 0 ? 1 : 0)
      if (remainingAttractions > 0) remainingAttractions--

      const dayAttractions = attractions.slice(currentAttractionIndex, currentAttractionIndex + dailyAttractionsCount)
      currentAttractionIndex += dailyAttractionsCount

      stayData.push({ city: cityWithNights[1], nights: 1, attractions: dayAttractions })
      nights--
    }
  }

  let prevCity = ''
  for (let i = 0; i < stayData.length; i++) {
    let cityName = stayData[i].city.toLowerCase()

    let description = ''
    let footer = ''
    let title = ''
    if (i == 0) {
      title = `Day ${i + 1} | Arrival In ${stayData[i].city}`

      description = `Upon your arrival in ${stayData[i].city}, ${
        monuments[cityName]?.cityIntro ?? ''
      } you will be transferred to your hotel in a comfortable ${vehicle} Vehicle. Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${
        stayData[i].city
      }`

      if (meals.includes('Lunch')) {
        description += ` Return to the hotel for a delightful lunch, experiencing authentic flavors.`
      }
      if (meals.includes('Dinner')) {
        footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
      } else {
        footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
      }

      prevCity = stayData[i].city
    } else if (prevCity == stayData[i].city) {
      title = `Day ${i + 1} | Continue Exploring ${stayData[i].city}`

      description = "Dive deeper into the city's charm"

      if (meals.includes('Breakfast')) {
        description += 'Enjoy a delicious breakfast at the hotel.'
      }

      if (meals.includes('Lunch')) {
        description += ` Return to the hotel for a delightful lunch, experiencing authentic flavors.`
      }
      if (meals.includes('Dinner')) {
        footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
      } else {
        footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
      }
    } else {
      title = `Day ${i + 1} | ${prevCity} to ${stayData[i].city}`

      if (meals.includes('Breakfast')) {
        description += 'Enjoy a delicious breakfast at the hotel.'
      }

      description += `Complete the check-out formalities and proceed to your onward journey. Upon your arrival in ${
        stayData[i].city
      }, ${
        monuments[cityName]?.cityIntro ?? ''
      } you will be transferred to your hotel in a comfortable ${vehicle} Vehicle. Once at the hotel, complete the check-in and verification formalities as per hotel policy. After settling into your accommodations, take some time to relax and rejuvenate before heading out to explore the enchanting sights and sounds of ${
        stayData[i].city
      }`

      if (meals.includes('Lunch')) {
        description += ` Return to the hotel for a delightful lunch, experiencing authentic flavors.`
      }
      if (meals.includes('Dinner')) {
        footer += 'Return to the hotel in the evening and enjoy a sumptuous dinner, specially prepared for you.'
      } else {
        footer += 'End your day with a delightful dinner at the local restaurant & Head back to the hotel.'
      }

      prevCity = stayData[i].city
    }

    dayWiseItinerary.push({
      title,
      persons: no_of_person,
      meals,
      description,
      attractions: stayData[i].attractions,
      footer
    })
  }

  cityInclusions = [
    ...inclusionItems.map(inclusion => {
      return {
        text: inclusion.text.includes('Included meals:') ? `${inclusion.text}${meals.join(', ')}` : inclusion.text,
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

  return { itineraries: dayWiseItinerary, cityInclusions, cityExclusions, cityKnowBefores }
}

const Preview = ({ selectedTravelPackage, onClose }) => {
  const monumentSheetData = useSelector(state => state.monumentRateData)
  const [dayWiseItinerary, setDayWiseItinerary] = useState(
    getDayWiseItinerary(selectedTravelPackage, monumentSheetData)
  )

  const { user } = useAuth()
  // console.log(dayWiseItinerary)

  return (
    <>
    <Button sx={{mb: 10}} variant='contained' onClick={onClose}>Back</Button>
      <div
        style={{
          backgroundImage: 'url(/images/pdf-image/jaipur/jaipur002.jpg), url(/images/pdf-image/jaipur/jaipur002.jpg)',
          backgroundPosition: '0px 0px, 0px 1120px',
          backgroundSize: '100%, 100%',
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
          <img className='logo' src='https://arh-cms-doc-storage.s3.ap-south-1.amazonaws.com/images/logo_full.png' />
          <div className='days-nights'>
            {DayNight}
            <span>{selectedTravelPackage['package_duration']}</span>
          </div>
        </div>

        <div className='title-description'>
          <div className='tag-line'>Your Gateway to Memorable Journeys</div>
          <h1 className='title'>Vaibhav and travel company</h1>
          <p className='description'>
            Travel with Vaibhav and travel company! Offering tailored domestic and international tours for individuals,
            groups, and corporate clients. Adventure and relaxation, all perfectly planned.
          </p>
        </div>

        <div className='route'>
          {RouteMap}
          {selectedTravelPackage['tour_route'].map((city, index) => (
            <span key={index}>
              {`${city[0].toUpperCase()}${city.slice(1)}`}
              {index != selectedTravelPackage['tour_route'].length - 1 ? ' - ' : ''}
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
                  <span>{selectedTravelPackage['no_of_person']}</span>
                </div>
              </div>

              <div className='div-for-accomodations' style={{ width: '50%' }}>
                <label
                  style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                  htmlFor='traveller-count'
                >
                  Valid Till
                </label>

                <div className='hotel-category'>
                  {TravelDate}
                  <span>{selectedTravelPackage['validity']}</span>
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
                  <span>{selectedTravelPackage['no_of_room']}</span>
                </div>
              </div>
            </div>

            <div className='travel-basic-details'>
              <div className='div-for-accomodations' style={{ width: '50%' }}>
                <label
                  style={{ textAlign: 'left', color: 'white', padding: '0px 0px 5px 10px' }}
                  htmlFor='traveller-count'
                >
                  Meals
                </label>
                <div className='hotel-category'>
                  {MealIcon}
                  <span>{selectedTravelPackage['food']}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '180px', color: '#ffffff' }}>
          <div className='transportation-section'>
            <h3 className='accommodation-title'>{selectedTravelPackage['title']}</h3>
            <h6 className='accommodation-title'>{selectedTravelPackage['sub_title']}</h6>
          </div>
        </div>

        <div
          className='price-section'
          style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%', marginTop: '20px' }}
        >
          <div
            style={{
              backdropFilter: 'blur(10px)',
              //   ['-webkit-backdrop-filter']: 'blur(50px)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50px',
              margin: '0 auto',
              fontFamily: "'Arial', sans-serif",
              fontWeight: 100,
              textAlign: 'center',
              justifyContent: 'center',
              padding: '10px 0px 10px 0px',
              width: '500px',
              color: '#ff6f00',
              fontSize: '20px'
            }}
          >
            <span className='total-amount'>
              Total : ₹
              {selectedTravelPackage['packages'].map((amount, j) => (
                <Fragment key={j}>
                  <span>{amount[`package_${j + 1}_price_per_person`]}</span>
                  {j != selectedTravelPackage['packages'].length - 1 && <span> - </span>}
                </Fragment>
              ))}
            </span>
          </div>

          <div className='price-section-state'>
            <div>{selectedTravelPackage['state']}</div>
            <span className='no-of-nights'>{` | ${selectedTravelPackage['package_duration'].split(' ')[0]}N`}</span>
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
                  <span>{selectedTravelPackage['pickup']}</span>
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
                  <span>{selectedTravelPackage['drop_point']}</span>
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
                  <span>{selectedTravelPackage['vehicle']}</span>
                </div>
              </div>
            </div>
          </div>
          {/* {console.log(selectedTravelPackage)} */}
        </div>

        {selectedTravelPackage['packages'].map((packageData, index) => (
          <div key={index}>
            {packageData[`package_${index + 1}_name`] && (
              <div style={{ textAlign: 'center' }} className='days-section'>
                <h3 className='itinerary-title'>{packageData[`package_${index + 1}_name`]}</h3>
                {packageData[`package_${index + 1}_hotels`].map((hotelInfo, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 20,
                      marginBottom: '20px'
                    }}
                  >
                    <span style={{ fontSize: 13 }} className='hotel-name'>
                      {hotelInfo['city']}
                    </span>
                    {/* {console.log(hotelInfo)} */}
                    <span style={{ color: '#ffffff' }}>{hotelInfo['hotels'].split(',').join(' | ')}</span>
                  </div>
                ))}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ width: '200px' }} className='hotel-name'>
                    ₹ {packageData[`package_${index + 1}_price_per_person`]} / Person
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className='itinerary-section'>
          <h3 className='itinerary-title'>Day Wise Itinerary</h3>
        </div>

        {dayWiseItinerary.itineraries.map((itinerary, index) => (
          <div key={index}>
            <div className='days-section'>
              <h3 className='itinerary-title'>{itinerary.title}</h3>
              <div className='travel-inclusive'>
                {PersonCount}
                <span>{itinerary.persons}</span>
                <span>|</span>
                {SeightSeeing}
                <span>Sightseeing</span>
                <span>|</span>
                {itinerary.meals.length > 0 && (
                  <>
                    {MealIcon}
                    <span>{itinerary.meals.join(', ')}</span>
                  </>
                )}
              </div>

              <div>
                <p className='day-description'>{itinerary.description}</p>
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

        {dayWiseItinerary.itineraries.length > 0 && (
          <div>
            <div className='days-section'>
              <h3 className='itinerary-title'>Departure Day | A Sweet Farewell</h3>
              <p className='day-description'>
                {dayWiseItinerary['itineraries'][dayWiseItinerary['itineraries'].length - 1].meals.includes('Breakfast')
                  ? 'Begin your day with a delightful breakfast at the hotel before checking out. If you’ve hired a vehicle with us, our driver will ensure a smooth and timely transfer to your next destination or departure point. Double-check your belongings and cherish the memories of this incredible adventure.'
                  : 'Start your day by checking out of the hotel as your journey concludes. Please ensure all your belongings are packed and ready. If you’ve arranged your own transport, we wish you safe and pleasant travels ahead. Thank you for choosing us to be a part of your journey.'}
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
                <h3 style={{ fontSize: '10px', color: '#ffffff', padding: '0px', margin: '0px' }}>Phone Number</h3>
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
                {user.address || 'G -22, Pushp Enclave, Sanganer, Sector 11, Pratap Nagar, Jaipur, Rajasthan - 302033'}
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
                <strong>Tailored Experiences:</strong> We create customized itineraries that match your interests,
                preferences, and budget, ensuring your trip is uniquely yours.
              </li>
              <li>
                <strong>Expert Knowledge:</strong> With years of industry experience, our team offers expert advice and
                insider knowledge to help you discover the best destinations, activities, and hidden gems.
              </li>
              <li>
                <strong>End-to-End Service:</strong> From planning to execution, we handle every detail—flights,
                accommodation, transportation, and local experiences—so you can focus on enjoying your trip.
              </li>
              <li>
                <strong>Global Reach, Local Expertise:</strong> Whether you’re traveling domestically or
                internationally, we offer local insights and trusted partnerships to enhance your travel experience.
              </li>
              <li>
                <strong>Customer Satisfaction:</strong> Your satisfaction is our top priority. We are dedicated to
                providing exceptional customer service, ensuring a smooth and stress-free journey every time.
              </li>
              <li>
                <strong>Affordable Luxury:</strong> Enjoy premium services at competitive prices, ensuring you get the
                most value for your travel investment.
              </li>
              <li>
                <strong>24/7 Support:</strong> Our dedicated support team is always available to assist you before,
                during, and after your trip, ensuring peace of mind throughout your journey.
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
    </>
  )
}

export default Preview
