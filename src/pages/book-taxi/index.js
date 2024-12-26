import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import axios from 'axios'
import { useRouter } from 'next/router'

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
import CustomInput from 'src/components/common/CustomInput'
import LocationAutocomplete from 'src/components/quotation/quotation_steps/LocationAutocomplete'

const transformTransportData = data => {
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

const BookTaxi = () => {
  const [transportRate, setTransportRate] = useState(null)
  const router = useRouter();

  const {
    reset,
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      vehicleType: '',
      departureReturnDate: [new Date(), addDays(new Date(), 45)],
      from: '',
      additionalStops: [],
      to: ''
    }
  })

  useEffect(() => {
    fetchTransportData()
  }, [])

  const fetchTransportData = async () => {
    const TRANSPORT_SHEET_ID = process.env.NEXT_PUBLIC_TRANSPORT_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const TRANSPORT_URL = `https://sheets.googleapis.com/v4/spreadsheets/${TRANSPORT_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      const response = await axios.get(TRANSPORT_URL)
      const finalData = transformTransportData(response.data.values)
      setTransportRate(finalData)
    } catch (error) {
      toast.error('Failed fetching transport data')
      console.error('Error fetching data:', error)
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'additionalStops'
  })
  const theme = useTheme()

  const onSubmit = data => {}

  const onCancel = () => {
    router.push('/')
  }

  return (
    <DatePickerWrapper>
      <form key={2} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={5} sx={{ width: '600px' }}>
            <Grid item xs={12}>
              {transportRate && (
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.vehicleType)}>
                    Select type of vehicle
                  </InputLabel>
                  <Controller
                    name='vehicleType'
                    control={control}
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
                  {errors.vehicleType && (
                    <errors sx={{ color: 'error.main' }} id='checkpoints-error'>
                      {errors.vehicleType?.message}
                    </errors>
                  )}
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='departureReturnDate'
                control={control}
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
                      <CustomInput label='Depature & Return Date' end={value[1]} start={value[0]} propserror={errors} />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                {/* <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.from)}>
                From
              </InputLabel> */}
                <Controller
                  name='from'
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    <LocationAutocomplete
                      label='From'
                      name='taxi-from'
                      value={value}
                      cities={[]}
                      onChange={onChange}
                      error={errors.to}
                      theme={theme}
                      icon='location'
                    />
                  )}
                />
                {errors.from && (
                  <FormHelperText sx={{ color: 'error.main' }} id='from-error'>
                    {errors.from?.message}
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
                        error={Boolean(errors.additionalStops?.[index])}
                      >
                        Stop Added
                      </InputLabel> */}
                        <Controller
                          name={`additionalStops.${index}`}
                          control={control}
                          rules={{ required: 'This field is required' }}
                          render={({ field: { value, onChange } }) => (
                            <LocationAutocomplete
                              label='Stop Added'
                              name={`additionalStops.${index}`}
                              value={value}
                              cities={[]}
                              onChange={onChange}
                              error={errors.additionalStops?.[index]}
                              theme={theme}
                              icon='location-add'
                            />
                          )}
                        />
                        {errors.additionalStops?.[index] && (
                          <FormHelperText sx={{ color: 'error.main' }} id='additionalStops-error'>
                            {errors.additionalStops?.[index]?.message}
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
                {/* <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.to)}>
                To
              </InputLabel> */}
                <Controller
                  name='to'
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => (
                    <LocationAutocomplete
                      label='To'
                      name='taxi-to'
                      value={value}
                      cities={[]}
                      onChange={onChange}
                      error={errors.to}
                      theme={theme}
                      icon='flag'
                    />
                  )}
                />
                {errors.to && (
                  <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                    {errors.to?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
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

export default BookTaxi
