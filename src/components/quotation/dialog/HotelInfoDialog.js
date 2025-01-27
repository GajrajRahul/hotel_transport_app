import React, { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { addDays } from 'date-fns'
import toast from 'react-hot-toast'

import DialogContentText from '@mui/material/DialogContentText'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import CardMedia from '@mui/material/CardMedia'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { styled, useTheme } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/components/common/CustomInput'
import CusomInputWithButttons from 'src/components/common/CusomInputWithButttons'
import { getDayNightCount } from 'src/utils/function'
import { Tooltip, useMediaQuery } from '@mui/material'
import { InfoTootipIcon } from 'src/utils/icons'

const defaultValues = {
  checkInCheckOut: [null, null],
  daysNights: '',
  meals: [],
  rooms: [],
  adult: 0,
  child: 0,
  infant: 0,
  extraBed: 0
}

const HotelInfoDialog = ({ open, onClose, selectedHotel, hotelInfo, setHotelInfo, selectedDates }) => {
  const travelInfoData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null

  const isBelowTablet = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [openMenuList, setOpenMenuList] = useState(false)

  const paperRef = useRef(null)
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
    defaultValues
  })

  const infant = watch('infant')
  const adult = watch('adult')
  const child = watch('child')
  const rooms = watch('rooms')
  const meals = watch('meals')

  // const minMaxDate = useMemo(() => {
  //   // console.log("selectedDates: ", selectedDates)
  //   if (selectedDates.current.length > 0) {
  //     // return [selectedDates.current[selectedDates.current.length - 1], travelInfoData.dates[1]]
  //     return selectedDates.current
  //   }

  //   return [{ start: new Date(travelInfoData.dates[0]), end: new Date(travelInfoData.dates[1]) }]
  // }, [selectedDates.current])

  useEffect(() => {
    let dataToSet = defaultValues

    if (selectedHotel && !hotelInfo.name) {
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
      const { name, image, type, rooms, meals, checkInCheckOut, daysNights, extraBed, adult, child, infant } = hotelInfo
      // console.log('hotelInfo: ', hotelInfo)

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
      ].map(meal => (meals.includes(meal.meal) ? { ...meal, isSelected: true } : meal))

      const roomsArr = selectedHotel.rooms.map(room => {
        // console.log('room: ', room)
        const match = rooms.find(currRoom => currRoom.type === room.type)
        // console.log('match: ', match)
        return match ? { ...room, count: match.count } : { ...room, count: 0 }
      })
      // console.log('mealsArr: ', mealsArr)

      reset({
        ...dataToSet,
        adult: adult ?? 0,
        child: child ?? 0,
        infant: infant ?? 0,
        meals: mealsArr,
        rooms: roomsArr,
        checkInCheckOut: [new Date(checkInCheckOut[0]), new Date(checkInCheckOut[1])],
        daysNights,
        extraBed
      })
    }
  }, [selectedHotel, hotelInfo])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {}), [selectedDates.current]

  const handleClickOutside = event => {
    if (paperRef.current && !paperRef.current.contains(event.target)) {
      setOpenMenuList(false)
    }
  }

  const onSubmit = data => {
    // console.log('selectedHotel: ', selectedHotel)
    // console.log('data: ', data)
    const { name, image, type } = selectedHotel
    const { checkInCheckOut, daysNights, extraBed, adult, child, infant } = data
    let finalData = {
      name,
      image,
      type,
      checkInCheckOut,
      daysNights
    }

    const rooms = []
    const meals = []
    data.rooms.map(room => {
      // console.log('room: ', room)
      if (room.count > 0) {
        rooms.push({ type: room.type, count: room.count, price: room.price })
      }
    })
    if (rooms.length == 0) {
      toast.error('Please select atleast one room')
      return
    }

    data.meals.map(meal => {
      if (meal.isSelected) {
        meals.push(meal.meal)
      }
    })
    if (extraBed > 0) finalData.extraBed = extraBed
    if (adult > 0) finalData.adult = adult
    if (child > 0) finalData.child = child
    if (child > 0) finalData.infant = infant

    // console.log('finalData: ', finalData)
    // return;
    setHotelInfo({ ...finalData, rooms, meals })
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
            padding: '20px 10px 0 30px'
          }
        }}
      >
        Room Details & Preferences
        <DialogContentText>Choose your room, add traveler details, select meal plan, and set check-in/check-out dates. Optionally, request an extra bed.</DialogContentText>
      </DialogTitle>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <DatePickerWrapper sx={{ p: 2, pt: 5 }}>
            <Grid container spacing={6}>
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
                                    {room.price[0]}xxx
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

              <Grid item xs={12} tablet={4}>
                <Controller
                  name='checkInCheckOut'
                  control={control}
                  rules={{ required: 'Both start and end date required' }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DatePicker
                        autoComplete='off'
                        selectsRange
                        minDate={new Date(travelInfoData.dates[0])}
                        maxDate={new Date(travelInfoData.dates[1])}
                        excludeDateIntervals={selectedDates.current}
                        monthsShown={2}
                        endDate={value[1] ? new Date(value[1]) : null}
                        // selected={value[0] ? new Date(value[0]) : null}
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

              <Grid item xs={12} tablet={3.1}>
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

              {/* {console.log("meals: ", meals)} */}
              {meals.length > 0 && meals[0] != undefined && meals[0].isSelected != undefined && (
                <Grid item xs={12} tablet={4.7}>
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
                        justifyContent: 'start', // Space between the icon and checkboxes
                        alignItems: 'center', // Align items vertically
                        height: '100%',
                        padding: '16px 16px', // Adjust padding for overall space
                        '&.MuiFormGroup-root': {
                          flexWrap: 'nowrap'
                        }
                      }}
                    >
                      {!isBelowTablet && (
                        <Box sx={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>
                          <Icon icon='mdi:plate-eating' color={theme.palette.primary.main} />
                        </Box>
                      )}

                      <Box sx={{ lineHeight: '10px', display: 'flex', width: '100%' }}>
                        {meals.map((meal, index) => (
                          <Controller
                            key={index}
                            name={`meals.${index}.isSelected`}
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => (
                              <FormControlLabel
                                value={value}
                                checked={value || false}
                                onChange={onChange}
                                control={<Checkbox size='small' />}
                                label={meal.meal}
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    fontSize: { xs: '13px', mobileMd: '1rem' }
                                  },
                                  '& .MuiFormControlLabel-root': {
                                    ml: 0,
                                    mr: 0
                                  }
                                }}
                              />
                            )}
                          />
                        ))}
                      </Box>
                    </FormGroup>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} tablet={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='stepper-linear-account-person'>No. of Persons</InputLabel>
                  <Controller
                    name='adult'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        autoComplete='off'
                        value={`${adult + child + infant == 0 ? '' : `${adult + child + infant} Travelers`}`}
                        label='No. of Persons'
                        id='stepper-linear-account-person'
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:double-user' color={theme.palette.primary.main} />
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
                        mt: { xs: '57px' }
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
                          <span style={{ marginRight: '30px' }}>Adult</span>
                          <Box>
                            <CusomInputWithButttons
                              name='adult'
                              hotelControl={control}
                              isRequired={true}
                              errors={errors}
                              theme={theme}
                            />
                          </Box>
                          <Tooltip
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            title='13+ years. Max 2 adults/room, 1 more with an extra bed.'
                            placement='top'
                            arrow
                          >
                            <svg
                              style={{
                                margin: '7px 0px 0px 13px',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '100%',
                                alignItems: 'center'
                              }}
                              xmlns='http://www.w3.org/2000/svg'
                              id='Layer_1'
                              data-name='Layer 1'
                              viewBox='0 0 24 24'
                              width='1.5em'
                              height='1.5em'
                              aria-label='13+ years. Max 2 adults/room, 1 more with an extra bed.'
                            >
                              <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16'></path>
                              <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0'></path>
                            </svg>
                          </Tooltip>
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
                          <span style={{ marginRight: '29px' }}>Child</span>
                          <Box>
                            <CusomInputWithButttons
                              name='child'
                              hotelControl={control}
                              isRequired={false}
                              errors={errors}
                              theme={theme}
                            />
                          </Box>
                          <Tooltip
                            title='Ages 6-13. Food charged. No bed unless added as an adult with an extra bed.'
                            placement='top'
                            arrow
                          >
                            <svg
                              style={{
                                margin: '7px 0px 0px 13px',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '100%',
                                alignItems: 'center'
                              }}
                              xmlns='http://www.w3.org/2000/svg'
                              id='Layer_1'
                              data-name='Layer 1'
                              viewBox='0 0 24 24'
                              width='1.5em'
                              height='1.5em'
                              aria-label='13+ years. Max 2 adults/room, 1 more with an extra bed.'
                            >
                              <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16'></path>
                              <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0'></path>
                            </svg>
                          </Tooltip>
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
                          <span style={{ marginRight: '25px' }}>Infant</span>
                          <Box>
                            <CusomInputWithButttons
                              name='infant'
                              hotelControl={control}
                              isRequired={false}
                              errors={errors}
                              theme={theme}
                            />
                          </Box>
                          <Tooltip
                            title='Below 6 years. No food charges. No bed unless added as an adult with an extra bed.'
                            placement='top'
                            arrow
                          >
                            <svg
                              style={{
                                margin: '7px 0px 0px 13px',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '100%',
                                alignItems: 'center'
                              }}
                              xmlns='http://www.w3.org/2000/svg'
                              id='Layer_1'
                              data-name='Layer 1'
                              viewBox='0 0 24 24'
                              width='1.5em'
                              height='1.5em'
                              aria-label='13+ years. Max 2 adults/room, 1 more with an extra bed.'
                            >
                              <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16'></path>
                              <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0'></path>
                            </svg>
                          </Tooltip>
                        </MenuItem>
                      </MenuList>
                    </Paper>
                  )}
                  {errors.adult && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-adult'>
                      {errors.adult?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} mobileMd={6} tablet={2.5}>
                <Box
                  sx={{
                    border: '1px solid #9A9A9A',
                    borderRadius: '6px',
                    justifyContent: 'start',
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
                  <Tooltip
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    title='Adding an extra bed will also include the same meal plan .'
                    placement='top'
                    arrow
                  >
                    <svg
                      style={{
                        margin: '7px 0px 0px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100%',
                        alignItems: 'center'
                      }}
                      xmlns='http://www.w3.org/2000/svg'
                      id='Layer_1'
                      data-name='Layer 1'
                      viewBox='0 0 24 24'
                      width='1.5em'
                      height='1.5em'
                      aria-label='13+ years. Max 2 adults/room, 1 more with an extra bed.'
                    >
                      <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16'></path>
                      <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0'></path>
                    </svg>
                  </Tooltip>
                </Box>
              </Grid>
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
