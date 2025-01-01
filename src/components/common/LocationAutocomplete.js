import React, { useState } from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { extractLocationDetails } from 'src/utils/function'

const LocationAutocomplete = ({ label, defaultValue, onChange }) => {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])
  const [placeDetails, setPlaceDetails] = useState(null)

  const handleInputChange = async (_, newInputValue) => {
    // console.log("newInputValue: ", newInputValue)
    setInputValue(newInputValue)

    if (newInputValue) {
      const service = new window.google.maps.places.AutocompleteService()
      service.getPlacePredictions({ input: newInputValue }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setOptions(predictions)
        } else {
          setOptions([])
        }
      })
    } else {
      setOptions([])
    }
  }

  const handlePlaceSelect = (_, value) => {
    if (value) {
      const selectedPrediction = options.find(option => option.description === value)

      if (selectedPrediction) {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'))
        const request = {
          placeId: selectedPrediction.place_id
        }

        service.getDetails(request, (placeDetails, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // console.log('placeDetails: ', placeDetails)
            const { city, state, country } = extractLocationDetails(placeDetails)
            onChange({ place: value, city, state, country })
          } else {
            onChange({
              place: '',
              city: '',
              state: '',
              country: ''
            })
          }
        })
      } else {
        onChange({
          place: '',
          city: '',
          state: '',
          country: ''
        })
      }
    } else {
      onChange({
        place: '',
        city: '',
        state: '',
        country: ''
      })
    }
  }

  return (
    <div>
      <Autocomplete
        options={options.map(option => option.description)}
        value={defaultValue}
        freeSolo
        getOptionLabel={option => (typeof option == 'object' ? option.place : option)}
        inputValue={inputValue}
        onInputChange={handleInputChange} // Handle input change here
        onChange={handlePlaceSelect} // Handle place selection here
        isOptionEqualToValue={(option, value) => option.place == value.place} // Compare option and value directly
        renderInput={params => <TextField {...params} label={label} variant='outlined' />}
      />
    </div>
  )
}

export default LocationAutocomplete
