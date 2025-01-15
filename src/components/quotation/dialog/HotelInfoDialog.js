import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { addDays } from 'date-fns'

import DialogContentText from '@mui/material/DialogContentText'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import CardMedia from '@mui/material/CardMedia'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { styled, useTheme } from '@mui/material/styles'

import { useMediaQuery } from '@mui/material'

import Icon from 'src/@core/components/icon'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/components/common/CustomInput'
import CusomInputWithButttons from 'src/components/common/CusomInputWithButttons'
import { getDayNightCount } from 'src/utils/function'

const HotelInfoDialog = ({ open, onClose, defaultHotelInfoValues, selectedHotel, hotelInfo, setHotelInfo }) => {
  const isBelowTablet = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const theme = useTheme()
  //   console.log(selectedHotel)

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      checkInCheckOut: [new Date(), addDays(new Date(), 45)],
      daysNights: '',
      meals: [],
      persons: [
        { type: 'Adult', count: 0 },
        { type: 'Child', count: 0 },
        { type: 'Infants', count: 0 }
      ],
      rooms: [],
      extraBed: 0
    }
  })

  const rooms = watch('rooms')
  const meals = watch('meals')

  useEffect(() => {
    if (selectedHotel && !hotelInfo.name) {
      let dataToSet = {
        checkInCheckOut: [new Date(), addDays(new Date(), 45)],
        daysNights: '',
        persons: [
          { type: 'Adult', count: 0 },
          { type: 'Child', count: 0 },
          { type: 'Infants', count: 0 }
        ],
        extraBed: 0
      }

      const rooms = []
      selectedHotel.rooms.map(room => {
        if (room) {
          rooms.push({ ...room, count: 0 })
        }
      })
      const meals = []
      selectedHotel.meals.map(meal => {
        if (meal) {
          meals.push({ ...meal, isSelected: false })
        }
      })

      reset({ ...dataToSet, meals, rooms })
    } else if (selectedHotel && hotelInfo.name) {
      const { name, image, type, rooms, meals, persons, checkInCheckOut, daysNights, extraBed } = hotelInfo

      const personsArr = [
        { type: 'Adult', count: 0 },
        { type: 'Child', count: 0 },
        { type: 'Infants', count: 0 }
      ].map(item2 => {
        const match = persons.find(item1 => item1.type === item2.type)
        return match ? { ...item2, count: match.count } : item2
      })

      const mealsArr = [
        {
          meal: 'Breakfast',
          isSelected: false
        },
        {
          meal: 'Lunch',
          isSelected: false
        },
        {
          meal: 'Dinner',
          isSelected: false
        }
      ].map(meal => {
        meals.includes(meal.meal) ? { ...meal, isSelected: true } : meal
      })

      const roomsArr = selectedHotel.rooms.map(room => {
        console.log('room: ', room)
        const match = rooms.find(currRoom => currRoom.type === room.type)
        console.log('match: ', match)
        return match ? { ...room, count: match.count } : { ...room, count: 0 }
      })

      let dataToSet = {
        checkInCheckOut: [new Date(checkInCheckOut[0]), new Date(checkInCheckOut[1])],
        daysNights,
        persons: personsArr,
        extraBed
      }

      //   selectedHotel.rooms.map(room => {
      //     if (room) {
      //       rooms.push({ ...room, count: 0 })
      //     }
      //   })
      //   selectedHotel.meals.map(meal => {
      //     if (meal) {
      //       meals.push({ ...meal, isSelected: false })
      //     }
      //   })

      reset({ ...dataToSet, meals: mealsArr, rooms: roomsArr })
    }
  }, [selectedHotel, hotelInfo])

  const onSubmit = data => {
    console.log('selectedHotel: ', selectedHotel)
    console.log('data: ', data)
    const { name, image, type } = selectedHotel
    const { checkInCheckOut, daysNights, extraBed } = data
    const rooms = []
    const meals = []
    const persons = []
    data.rooms.map(room => {
      if (room.count > 0) {
        rooms.push({ type: room.type, count: room.count })
      }
    })
    data.meals.map(meal => {
      if (meal.isSelected) {
        meals.push(meal.meal)
      }
    })
    data.persons.map(person => {
      if (person.count > 0) {
        persons.push({ type: person.type, count: person.count })
      }
    })

    setHotelInfo({ name, image, type, rooms, meals, persons, checkInCheckOut, daysNights, extraBed })
    resetFields()
  }

  const resetFields = () => {
    reset()
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth='laptopSm' open={open} onClose={resetFields}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 0
          }
        }}
      >
        Select Room Type
        <DialogContentText>Select Cities where you want to book your stay</DialogContentText>
      </DialogTitle>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <DatePickerWrapper sx={{ p: 2, pt: 5 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} tablet={6}>
                <Controller
                  name='checkInCheckOut'
                  control={control}
                  rules={{ required: 'Both start and end date required' }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DatePicker
                        selectsRange
                        minDate={new Date()}
                        maxDate={addDays(new Date(), 45)}
                        monthsShown={2}
                        endDate={value[1] ? new Date(value[1]) : null}
                        selected={value[0] ? new Date(value[0]) : null}
                        startDate={value[0] ? new Date(value[0]) : null}
                        shouldCloseOnSelect={false}
                        id='date-range-picker-months'
                        onChange={e => {
                          onChange(e)
                          const dayCount = getDayNightCount(e) + 1
                          setValue(
                            'daysNights',
                            e[1] == null
                              ? '1 Day'
                              : `${dayCount} ${dayCount < 2 ? 'Day' : 'Days'} & ${dayCount - 1} ${
                                  dayCount < 3 ? 'Night' : 'Nights'
                                }`
                          )
                        }}
                        popperPlacement='bottom-start'
                        customInput={
                          <CustomInput
                            label='Check-In & Check-Out'
                            end={value[1]}
                            start={value[0]}
                            propserror={errors}
                          />
                        }
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} tablet={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-daysNights'>Days and Nights</InputLabel>
                  <Controller
                    name='daysNights'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        value={value}
                        disabled
                        label='Days and Nights'
                        id='stepper-linear-account-daysNights'
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:night-day' />
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} mobileMd={6} tablet={4}>
                <Box
                  sx={{
                    border: '1px solid #9A9A9A',
                    borderRadius: '6px',
                    position: 'relative',
                    height: '55.7px',
                    display: 'flex',
                    alignItems: 'center',
                    px: 3
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      top: -11.5,
                      left: 10,
                      background: 'white',
                      px: 1
                    }}
                  >
                    Adult
                  </Typography>
                  <CusomInputWithButttons
                    name='persons.0.count'
                    hotelControl={control}
                    isRequired={false}
                    errors={errors}
                    icon='curtains-open'
                    theme={theme}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} mobileMd={6} tablet={4}>
                <Box
                  sx={{
                    border: '1px solid #9A9A9A',
                    borderRadius: '6px',
                    position: 'relative',
                    height: '55.7px',
                    display: 'flex',
                    alignItems: 'center',
                    px: 3
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      top: -11.5,
                      left: 10,
                      background: 'white',
                      px: 1
                    }}
                  >
                    Child
                  </Typography>
                  <CusomInputWithButttons
                    name='persons.1.count'
                    hotelControl={control}
                    isRequired={false}
                    errors={errors}
                    icon='curtains-open'
                    theme={theme}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} mobileMd={6} tablet={4}>
                <Box
                  sx={{
                    border: '1px solid #9A9A9A',
                    borderRadius: '6px',
                    position: 'relative',
                    height: '55.7px',
                    display: 'flex',
                    alignItems: 'center',
                    px: 3
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      top: -11.5,
                      left: 10,
                      background: 'white',
                      px: 1
                    }}
                  >
                    Infant
                  </Typography>
                  <CusomInputWithButttons
                    name='persons.2.count'
                    hotelControl={control}
                    isRequired={false}
                    errors={errors}
                    icon='curtains-open'
                    theme={theme}
                  />
                </Box>
              </Grid>

              {rooms.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={5}>
                    {/* {console.log('rooms: ', rooms)} */}
                    {rooms.map(
                      (room, idx) =>
                        room.count != undefined && (
                          <Grid key={idx} item xs={12} sm={4}>
                            <Card>
                              <CardMedia
                                sx={{ height: '9.375rem' }}
                                image={room.image || '/images/hotels/jaipur.jpg'}
                              />
                              <CardContent
                                sx={{
                                  p: theme => `${theme.spacing(3, 5, 4)} !important`
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    // flexWrap: 'wrap',
                                    mb: 2
                                  }}
                                >
                                  <Typography fontSize={15} fontWeight={600}>
                                    {room.type}
                                  </Typography>
                                  {room.count != undefined && (
                                    <Box sx={{ width: '35%' }}>
                                      <CusomInputWithButttons
                                        name={`rooms.${idx}.count`}
                                        hotelControl={control}
                                        isRequired={false}
                                        errors={errors}
                                        theme={theme}
                                      />
                                    </Box>
                                  )}
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box
                                  sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'baseline'
                                  }}
                                >
                                  <Typography variant='h6'>
                                    <sup>₹</sup>
                                    {room.price}
                                  </Typography>

                                  <Typography variant='caption'>/Room</Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12} mobileMd={6} tablet={4}>
                <Box
                  sx={{
                    border: '1px solid #9A9A9A',
                    borderRadius: '6px',
                    position: 'relative',
                    height: '55.7px',
                    display: 'flex',
                    alignItems: 'center',
                    px: 3
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      top: -11.5,
                      left: 10,
                      background: 'white',
                      px: 1
                    }}
                  >
                    ExtraBed
                  </Typography>
                  <CusomInputWithButttons
                    name='extraBed'
                    hotelControl={control}
                    isRequired={false}
                    errors={errors}
                    icon='double-bed'
                    theme={theme}
                    rooms={rooms}
                  />
                </Box>
              </Grid>
              {console.log("meals: ", meals)}
              {meals.length > 0 && meals[0] != undefined && meals[0].isSelected != undefined && (
                <Grid item xs={12} mobileMd={6} tablet={4}>
                  <Box
                    sx={{
                      border: '1px solid #9A9A9A',
                      borderRadius: '6px',
                      position: 'relative',
                      height: '56px'
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        position: 'absolute',
                        top: -11.5,
                        left: 10,
                        background: 'white',
                        px: 1
                      }}
                    >
                      Meals
                    </Typography>
                    <FormGroup
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        height: '100%',
                        alignItems: 'center',
                        '&.MuiFormGroup-root': {
                          flexWrap: 'nowrap'
                        },
                        pl: 2
                      }}
                    >
                      {!isBelowTablet && <Icon icon='mdi:plate-eating' color={theme.palette.primary.main} />}
                      {meals.map((meal, index) => (
                        <Box key={index}>
                          {/* {console.log(meal)} */}
                          <Controller
                            //   key={index}
                            name={`meals.${index}.isSelected`}
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                value={value}
                                checked={value || false}
                                onChange={onChange}
                                control={<Checkbox key={index} size='small' />}
                                label={meal.meal}
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
                        </Box>
                      ))}
                    </FormGroup>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DatePickerWrapper>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={resetFields}>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default HotelInfoDialog
