import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { useLoadScript } from '@react-google-maps/api'

import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'

import Icon from 'src/@core/components/icon'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import LocationAutocomplete from './LocationAutocomplete'
import CustomInput from 'src/components/common/CustomInput'

const libraries = ['places']

const TransportInfoStep = ({ handleBack, onSubmit }) => {
  const transportSheetData = useSelector(state => state.transportRateData)

  const cities = localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
  const transportData = localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null
  const travelBasicData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const {
    reset: transportReset,
    setValue: setTransportValue,
    getValues: getTransportValues,
    control: transportControl,
    watch: transportWatch,
    handleSubmit: handleTransportSubmit,
    formState: { errors: transportErrors }
  } = useForm({
    defaultValues: transportData
      ? {
          ...transportData,
          departureReturnDate: [
            new Date(transportData.departureReturnDate[0]),
            new Date(transportData.departureReturnDate[1])
          ]
        }
      : {
          vehicleType: '',
          departureReturnDate: travelBasicData
            ? [new Date(travelBasicData.dates[0]), new Date(travelBasicData.dates[1])]
            : [new Date(), addDays(new Date(), 45)],
          from: { place: '', city: '', state: '' },
          isLocal: false,
          additionalStops: [],
          to: { place: '', city: '', state: '' }
        }
  })

  const isLocal = transportWatch('isLocal')

  const { fields, append, remove } = useFieldArray({
    control: transportControl,
    name: 'additionalStops'
  })
  const theme = useTheme()

  if (!isLoaded) return <div>Loading...</div>

  return (
    <DatePickerWrapper>
      <form key={2} onSubmit={handleTransportSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={5} sx={{ width: '600px' }}>
            <Grid item xs={12}>
              {transportSheetData && (
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(transportErrors.vehicleType)}>
                    Select type of vehicle
                  </InputLabel>
                  <Controller
                    name='vehicleType'
                    control={transportControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={value}
                        label='Select type of vehicle'
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:car-outline' color={theme.palette.primary.main} />
                          </InputAdornment>
                        }
                        onChange={onChange}
                      >
                        {Object.keys(transportSheetData).map(transport => (
                          <MenuItem key={transport} value={transport}>
                            {transport.split('_').join(' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {transportErrors.vehicleType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                      {transportErrors.vehicleType?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='departureReturnDate'
                control={transportControl}
                rules={{ required: 'Both start and end date required' }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selectsRange
                    monthsShown={2}
                    endDate={value[1]}
                    selected={value[0]}
                    startDate={value[0]}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={onChange}
                    popperPlacement='bottom-start'
                    customInput={
                      <CustomInput
                        label='Depature & Return Date'
                        end={value[1]}
                        start={value[0]}
                        propserror={transportErrors}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='from'
                  control={transportControl}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    <LocationAutocomplete
                      label='From'
                      name='from'
                      value={value}
                      disabled={isLocal}
                      onChange={onChange}
                    />
                  )}
                />
                {transportErrors.from && (
                  <FormHelperText sx={{ color: 'error.main' }} id='from-error'>
                    {transportErrors.from?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='isLocal'
                control={transportControl}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    checked={value}
                    onChange={e => {
                      if (e.target.checked) {
                        setTransportValue('to', getTransportValues('from'))
                      }
                      onChange(e.target.checked)
                    }}
                    control={<Checkbox size='small' />}
                    label='Book Taxi for local sight seeing'
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '13px', mobileMd: '1 rem' }
                      },
                      '& .MuiFormControlLabel-root': {
                        ml: 0,
                        mr: 0
                      }
                    }}
                  />
                )}
              />
            </Grid>
            {fields.length > 0 && (
              <Grid item xs={12}>
                {fields.map((item, index) => (
                  <Grid container spacing={5} key={item.id}>
                    <Grid item xs={10.75} sx={{ mb: index != fields.length - 1 ? 5 : 0 }}>
                      <FormControl fullWidth>
                        <Controller
                          name={`additionalStops.${index}`}
                          control={transportControl}
                          rules={{ required: 'This field is required' }}
                          render={({ field: { value, onChange } }) => (
                            <LocationAutocomplete
                              label='Stop Added'
                              name={`additionalStops.${index}`}
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                        {transportErrors.additionalStops?.[index] && (
                          <FormHelperText sx={{ color: 'error.main' }} id='additionalStops-error'>
                            {transportErrors.additionalStops?.[index]?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={1.25} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Fab
                        onClick={() => remove(index)}
                        // disabled={additionalStops.length == 1}
                        // color='error'
                        sx={{
                          backgroundColor: theme => theme.palette.primary.main,
                          color: 'white',
                          '&.MuiFab-root:hover': {
                            backgroundColor: theme => theme.palette.primary.main
                          }
                        }}
                        aria-label='delete'
                        size='small'
                      >
                        <Icon fontSize='1.3rem' icon='mdi:delete' />
                      </Fab>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <IconButton
                  edge='end'
                  onClick={e => {
                    e.stopPropagation()
                    // append('')
                    append(null)
                  }}
                  aria-label='toggle plus visibility'
                  size='small'
                  sx={{
                    backgroundColor: theme => theme.palette.primary.main,
                    color: 'white',
                    '&.MuiIconButton-root:hover': {
                      backgroundColor: theme => theme.palette.primary.main
                    }
                  }}
                >
                  <Icon icon='mdi:plus' />
                </IconButton>
                <Typography fontSize={15}>Add Stops</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='to'
                  control={transportControl}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    <LocationAutocomplete label='To' name='to' value={value} disabled={isLocal} onChange={onChange} />
                  )}
                />
                {transportErrors.to && (
                  <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                    {transportErrors.to?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                Back
              </Button>
              <Button size='large' type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </DatePickerWrapper>
  )
}

export default TransportInfoStep
