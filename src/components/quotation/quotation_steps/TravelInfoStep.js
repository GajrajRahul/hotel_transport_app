import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon'
import { getDayNightCount } from 'src/utils/function'
import CustomInput from 'src/components/common/CustomInput'



const TravelInfoStep = props => {
  const { travelErrors, travelControl, setTravelValue, setTransportValue } = props

  const theme = useTheme()

  return (
    <DatePickerWrapper>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(travelErrors.name)}>
              Name
            </InputLabel>
            <Controller
              name='name'
              control={travelControl}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label='Name'
                  onChange={onChange}
                  id='stepper-linear-account-name'
                  error={Boolean(travelErrors.name)}
                  startAdornment={
                    <InputAdornment position='start'>
                      <Icon icon='mdi:twotone-supervisor-account' color={theme.palette.primary.main} />
                    </InputAdornment>
                  }
                />
              )}
            />
            {travelErrors.name && (
              <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-name'>
                {travelErrors.name?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='dates'
            control={travelControl}
            rules={{ required: 'Both start and end date required' }}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                selectsRange
                monthsShown={2}
                minDate={new Date()}
                endDate={value[1]}
                selected={value[0]}
                startDate={value[0]}
                shouldCloseOnSelect={false}
                id='date-range-picker-months'
                onChange={e => {
                  onChange(e)
                  // setTransportValue('depatureReturnDate', e)
                  const dayCount = getDayNightCount(e) + 1
                  setTravelValue(
                    'days-nights',
                    e[1] == null
                      ? '1 Day'
                      : `${dayCount} ${dayCount < 2 ? 'Day' : 'Days'} & ${dayCount - 1} ${
                          dayCount < 3 ? 'Night' : 'Nights'
                        }`
                  )
                }}
                popperPlacement='bottom-start'
                customInput={
                  <CustomInput label='Travel Date' end={value[1]} start={value[0]} propserror={travelErrors} />
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor='stepper-linear-account-days-nights'>Days and Nights</InputLabel>
            <Controller
              name='days-nights'
              control={travelControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  disabled
                  label='Days and Nights'
                  id='stepper-linear-account-days-nights'
                  startAdornment={
                    <InputAdornment position='start'>
                      <Icon icon='mdi:sun-moon-stars' color={theme.palette.primary.main} />
                    </InputAdornment>
                  }
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button type='submit' variant='contained'>
            Next
          </Button>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TravelInfoStep
