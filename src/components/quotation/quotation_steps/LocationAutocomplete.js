import { useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

import Icon from 'src/@core/components/icon'

import parse from 'autosuggest-highlight/parse'
import { debounce } from '@mui/material/utils'
import { extractLocationDetails } from 'src/utils/function'

const autocompleteService = { current: null }

const LocationAutocomplete = ({ label, name, value, disabled, onChange }) => {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])

  // const fetch = useMemo(
  //   () =>
  //     debounce((request, callback) => {
  //       autocompleteService.current.getPlacePredictions(request, callback)
  //     }, 400),
  //   []
  // )

  // useEffect(() => {
  //   let active = true

  //   if (!autocompleteService.current && window.google && window.google.maps.places) {
  //     autocompleteService.current = new window.google.maps.places.AutocompleteService()
  //   }
  //   if (!autocompleteService.current) {
  //     return undefined
  //   }

  //   if (inputValue === '') {
  //     setOptions(value ? [value] : [])
  //     return undefined
  //   }

  //   fetch({ input: inputValue }, results => {
  //     if (active) {
  //       let newOptions = []

  //       if (value) {
  //         newOptions = [value]
  //       }

  //       if (results) {
  //         newOptions = [...newOptions, ...results]
  //       }

  //       setOptions(newOptions)
  //     }
  //   })

  //   return () => {
  //     active = false
  //   }
  // }, [inputValue, fetch])

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
            // onChange(value)
          } else {
            onChange({
              place: '',
              city: '',
              state: '',
              country: ''
            })
            // onChange('')
          }
        })
      } else {
        onChange({
          place: '',
          city: '',
          state: '',
          country: ''
        })
        // console.log('')
      }
    } else {
      onChange({
        place: '',
        city: '',
        state: '',
        country: ''
      })
      // console.log('')
    }
  }

  return (
    // <Autocomplete
    //   id='google-map-demo'
    //   disabled={cities.length == 1 && (name == 'from' || name == 'to')}
    //   getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
    //   isOptionEqualToValue={option => (typeof option === 'string' ? option : option.description)}
    //   filterOptions={x => x}
    //   freeSolo
    //   options={options}
    //   autoComplete
    //   includeInputInList
    //   filterSelectedOptions
    //   value={value}
    //   noOptionsText='No locations'
    //   onChange={(event, newValue) => {
    //     setOptions(newValue ? [newValue, ...options] : options)
    //     // console.log(newValue)
    //     console.log(newValue)
    //     onChange(newValue)
    //   }}
    //   onInputChange={(event, newInputValue) => {
    //     setInputValue(newInputValue)
    //   }}
    //   renderInput={params => (
    //     <TextField
    //       {...params}
    //       label={label}
    //       fullWidth
    //       disabled={cities.length == 1 && (name == 'from' || name == 'to')}
    //       error={Boolean(error)}
    //       //   InputProps={{
    //       //     startAdornment: (
    //       //       <InputAdornment position='start'>
    //       //         <Icon icon={`mdi:${icon}-outline`} color={theme.palette.primary.main} />
    //       //       </InputAdornment>
    //       //     )
    //       //   }}
    //     />
    //   )}
    //   renderOption={(props, option) => {
    //     const { key, ...optionProps } = props
    //     const matches = option?.structured_formatting?.main_text_matched_substrings || []

    //     const parts = parse(
    //       option?.structured_formatting?.main_text || '',
    //       matches?.map(match => [match?.offset, match?.offset + match?.length]) || []
    //     )
    //     return (
    //       <li key={key} {...optionProps}>
    //         <Grid container sx={{ alignItems: 'center' }}>
    //           <Grid item sx={{ display: 'flex', width: 44 }}>
    //             <Icon icon='mdi:location-outline' color={theme.palette.primary.main} />
    //           </Grid>
    //           <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
    //             {parts.map((part, index) => (
    //               <Box key={index} component='span' sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}>
    //                 {part.text}
    //               </Box>
    //             ))}
    //             <Typography variant='body2' color='text.secondary'>
    //               {option?.structured_formatting?.secondary_text || ''}
    //             </Typography>
    //           </Grid>
    //         </Grid>
    //       </li>
    //     )
    //   }}
    // />
    <Autocomplete
      disabled={disabled}
      options={options.map(option => option.description)}
      value={value}
      freeSolo
      getOptionLabel={option => (typeof option == 'object' ? option.place : option)}
      inputValue={inputValue}
      onInputChange={handleInputChange} // Handle input change here
      onChange={handlePlaceSelect} // Handle place selection here
      isOptionEqualToValue={(option, value) => option.place == value.place} // Compare option and value directly
      renderInput={params => <TextField {...params} label={label} variant='outlined' />}
    />
  )
}

export default LocationAutocomplete
