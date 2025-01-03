import React, { Fragment } from 'react'
import {
  DayNight,
  DropLocation,
  MealIcon,
  PersonCount,
  PickupLocation,
  RoomCount,
  RouteMap,
  TravelDate,
  vehicleType
} from 'src/utils/icons'

const Preview = ({ selectedTravelPackage }) => {
  return (
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
                  {console.log(hotelInfo)}
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
    </div>
  )
}

export default Preview
