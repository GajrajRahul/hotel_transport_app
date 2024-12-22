import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { useTheme } from '@mui/material'

import Icon from 'src/@core/components/icon'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import LocationAutocomplete from './LocationAutocomplete'
import CustomInput from 'src/components/common/CustomInput'

const TransportInfoStep = ({ transportRate, handleBack, onSubmit }) => {
  const cities = localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
  const transportData = localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null
  const travelBasicData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null

  const {
    reset: transportReset,
    setValue: setTransportValue,
    getValues: getTransportValues,
    control: transportControl,
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
          from:
            cities.length > 1 || cities.length == 0
              ? ''
              : `${cities[0].label[0].toUpperCase()}${cities[0].label.slice(1)}`,
          additionalStops: [],
          to:
            cities.length > 1 || cities.length == 0
              ? ''
              : `${cities[0].label[0].toUpperCase()}${cities[0].label.slice(1)}`
        }
  })

  const { fields, append, remove } = useFieldArray({
    control: transportControl,
    name: 'additionalStops'
  })
  const theme = useTheme()

  return (
    <DatePickerWrapper>
      <form key={2} onSubmit={handleTransportSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={5} sx={{ width: '600px' }}>
            <Grid item xs={12}>
              {transportRate && (
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
                        {Object.keys(transportRate).map(transport => (
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
                {/* <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(transportErrors.from)}>
                From
              </InputLabel> */}
                <Controller
                  name='from'
                  control={transportControl}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    // <OutlinedInput
                    //   label='From'
                    //   fullWidth
                    //   value={value}
                    //   disabled={cities.length == 1}
                    //   variant='outlined'
                    //   onChange={onChange}
                    //   startAdornment={
                    //     <InputAdornment position='start'>
                    //       <Icon icon='mdi:location-outline' color={theme.palette.primary.main} />
                    //     </InputAdornment>
                    //   }
                    //   error={Boolean(transportErrors.from)}
                    // />
                    <LocationAutocomplete
                      label='From'
                      name='from'
                      value={value}
                      cities={cities}
                      onChange={onChange}
                      error={transportErrors.to}
                      theme={theme}
                      icon='location'
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
            {fields.length > 0 && (
              <Grid item xs={12}>
                {fields.map((item, index) => (
                  <Grid container spacing={5} key={item.id}>
                    <Grid item xs={10.75} sx={{ mb: index != fields.length - 1 ? 5 : 0 }}>
                      <FormControl fullWidth>
                        {/* <InputLabel
                        htmlFor='stepper-linear-account-name'
                        error={Boolean(transportErrors.additionalStops?.[index])}
                      >
                        Stop Added
                      </InputLabel> */}
                        <Controller
                          name={`additionalStops.${index}`}
                          control={transportControl}
                          rules={{ required: 'This field is required' }}
                          render={({ field: { value, onChange } }) => (
                            // <OutlinedInput
                            //   label='Stop Added'
                            //   value={value}
                            //   variant='outlined'
                            //   onChange={onChange}
                            //   startAdornment={
                            //     <InputAdornment position='start'>
                            //       <Icon icon='mdi:location-add-outline' color={theme.palette.primary.main} />
                            //     </InputAdornment>
                            //   }
                            //   error={Boolean(transportErrors.additionalStops?.[index])}
                            // />
                            <LocationAutocomplete
                              label='Stop Added'
                              name={`additionalStops.${index}`}
                              value={value}
                              cities={cities}
                              onChange={onChange}
                              error={transportErrors.additionalStops?.[index]}
                              theme={theme}
                              icon='location-add'
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
                {/* <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(transportErrors.to)}>
                To
              </InputLabel> */}
                <Controller
                  name='to'
                  control={transportControl}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    // <OutlinedInput
                    //   label='To'
                    //   fullWidth
                    //   value={value}
                    //   disabled={cities.length == 1}
                    //   variant='outlined'
                    //   onChange={onChange}
                    //   startAdornment={
                    //     <InputAdornment position='start'>
                    //       <Icon icon='mdi:flag-outline' color={theme.palette.primary.main} />
                    //     </InputAdornment>
                    //   }
                    //   error={Boolean(transportErrors.to)}
                    // />
                    <LocationAutocomplete
                      label='To'
                      name='to'
                      value={value}
                      cities={cities}
                      onChange={onChange}
                      error={transportErrors.to}
                      theme={theme}
                      icon='flag'
                    />
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
