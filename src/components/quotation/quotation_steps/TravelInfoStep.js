import { forwardRef, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material'

import format from 'date-fns/format'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon'

const CustomInput = forwardRef((props, ref) => {
  const { start, end, propserror } = props
  const startDate = start !== null ? format(start, 'dd MMM yyyy') : null
  const endDate = end !== null ? ` - ${format(end, 'dd MMM yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  const theme = useTheme()

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor='stepper-linear-account-password' error={Boolean(propserror.dates)}>
        {props.label || ''}
      </InputLabel>
      <OutlinedInput
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
        error={Boolean(propserror.dates)}
        fullWidth
        startAdornment={
          <InputAdornment position='start'>
            <Icon icon='mdi:outline-date-range' color={theme.palette.primary.main} />
          </InputAdornment>
        }
      />
      {propserror.dates && (
        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-password'>
          {propserror.dates?.message}
        </FormHelperText>
      )}
    </FormControl>
  )
})

const getDayNightCount = dates => {
  if (dates[1] == null) {
    return
  }

  const date1 = new Date(dates[0])
  const date2 = new Date(dates[1])

  const diffInMs = date2 - date1

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays
}

const TravelInfoStep = props => {
  const { travelErrors, travelControl, adult, child, persons, travelDates, setTravelValue, setTransportValue } = props

  const [openMenuList, setOpenMenuList] = useState(false)

  const theme = useTheme()
  const paperRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClickOutside = event => {
    if (paperRef.current && !paperRef.current.contains(event.target)) {
      setOpenMenuList(false)
    }
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
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
          <FormControl fullWidth>
            <InputLabel htmlFor='stepper-linear-account-person' error={travelErrors.persons?.message}>
              No. of Persons
            </InputLabel>
            <Controller
              name='persons'
              control={travelControl}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={
                    Number(adult) == 0 && Number(child) == 0
                      ? ''
                      : Number(adult) != 0 && Number(child) != 0
                      ? `${adult} Adults & ${child} Childs`
                      : Number(adult) == 0
                      ? `${child} Childs`
                      : `${adult} Adults`
                  }
                  label='No. of Persons'
                  id='stepper-linear-account-person'
                  error={travelErrors.persons?.message}
                  startAdornment={
                    <InputAdornment position='start'>
                      <Icon icon='mdi:emoji-people' color={theme.palette.primary.main} />
                    </InputAdornment>
                  }
                  onFocus={() => {
                    setOpenMenuList(true)
                  }}
                />
              )}
            />
            {openMenuList && (
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  position: 'absolute',
                  zIndex: 2,
                  marginTop: '11%'
                }}
                ref={paperRef}
              >
                <MenuList>
                  <MenuItem
                    sx={{
                      '&.MuiMenuItem-root': {
                        backgroundColor: 'transparent'
                      },
                      '&.MuiMenuItem-root:hover': {
                        backgroundColor: 'transparent'
                      },
                      cursor: 'default'
                    }}
                    disableRipple
                  >
                    Adult{' '}
                    <Controller
                      name='adult'
                      control={travelControl}
                      rules={{ required: 'This field is required' }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <IconButton
                            edge='end'
                            onClick={e => {
                              e.stopPropagation()
                              if (Number(adult) != 0) {
                                onChange(`${Number(adult) - 1}`)
                              }
                              const newValue =
                                Number(adult) == 0 && Number(child) == 0
                                  ? ''
                                  : Number(adult) != 0 && Number(child) != 0
                                  ? `${Number(adult) - 1} Adults & ${child} Childs`
                                  : Number(adult) == 0
                                  ? `${child} Childs`
                                  : `${Number(adult) - 1} Adults`
                              setTravelValue('persons', newValue)
                            }}
                            aria-label='toggle minus visibility'
                            size='small'
                            sx={{
                              mx: 3,
                              backgroundColor: theme => theme.palette.primary.main,
                              color: 'white',
                              '&.MuiIconButton-root:hover': {
                                backgroundColor: theme => theme.palette.primary.main
                              }
                            }}
                          >
                            <Icon icon='mdi:minus' />
                          </IconButton>
                          {value}
                          <IconButton
                            edge='end'
                            onClick={e => {
                              e.stopPropagation()
                              const newValue =
                                Number(child) == 0
                                  ? `${Number(adult) + 1} Adults`
                                  : `${Number(adult) + 1} Adults & ${child} Childs`
                              setTravelValue('persons', newValue)
                              onChange(`${Number(adult) + 1}`)
                            }}
                            aria-label='toggle plus visibility'
                            size='small'
                            sx={{
                              mx: 3,
                              backgroundColor: theme => theme.palette.primary.main,
                              color: 'white',
                              '&.MuiIconButton-root:hover': {
                                backgroundColor: theme => theme.palette.primary.main
                              }
                            }}
                          >
                            <Icon icon='mdi:plus' />
                          </IconButton>
                        </>
                      )}
                    />
                  </MenuItem>
                  <MenuItem
                    sx={{
                      '&.MuiMenuItem-root': {
                        backgroundColor: 'transparent'
                      },
                      '&.MuiMenuItem-root:hover': {
                        backgroundColor: 'transparent'
                      },
                      cursor: 'default'
                    }}
                    disableRipple
                  >
                    Child
                    <Controller
                      name='child'
                      control={travelControl}
                      rules={{ required: 'This field is required' }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <IconButton
                            edge='end'
                            onClick={e => {
                              e.stopPropagation()
                              if (Number(child) != 0) {
                                onChange(`${Number(child) - 1}`)
                              }
                              const newValue =
                                Number(adult) == 0 && Number(child) == 0
                                  ? ''
                                  : Number(adult) != 0 && Number(child) != 0
                                  ? `${adult} Adults & ${Number(child) - 1} Childs`
                                  : Number(child) == 0
                                  ? `${adult} Adults`
                                  : `${Number(child) - 1} Childs`
                              setTravelValue('persons', newValue)
                            }}
                            aria-label='toggle minus visibility'
                            size='small'
                            sx={{
                              mx: 3,
                              backgroundColor: theme => theme.palette.primary.main,
                              color: 'white',
                              '&.MuiIconButton-root:hover': {
                                backgroundColor: theme => theme.palette.primary.main
                              }
                            }}
                          >
                            <Icon icon='mdi:minus' />
                          </IconButton>
                          {value}
                          <IconButton
                            edge='end'
                            onClick={e => {
                              e.stopPropagation()
                              const newValue =
                                Number(adult) == 0
                                  ? `${Number(child) + 1} Childs`
                                  : `${adult} Adults & ${Number(child) + 1} Childs`
                              setTravelValue('persons', newValue)
                              onChange(`${Number(child) + 1}`)
                            }}
                            aria-label='toggle plus visibility'
                            size='small'
                            sx={{
                              mx: 3,
                              backgroundColor: theme => theme.palette.primary.main,
                              color: 'white',
                              '&.MuiIconButton-root:hover': {
                                backgroundColor: theme => theme.palette.primary.main
                              }
                            }}
                          >
                            <Icon icon='mdi:plus' />
                          </IconButton>
                        </>
                      )}
                    />
                  </MenuItem>
                </MenuList>
              </Paper>
            )}
            {travelErrors.persons && (
              <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-person'>
                {travelErrors.persons?.message ?? 'This field is required'}
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
