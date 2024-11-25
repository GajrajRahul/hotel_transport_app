import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

import { useJsApiLoader } from '@react-google-maps/api'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import { styled } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'
import Loader from 'src/views/common/Loader'
import axios from 'axios'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const SideDrawer = ({ open, toggle }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      source: '',
      checkpoints: [],
      destination: ''
    }
  })

  const [totalDistance, setTotalDistance] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    // libraries: ['places']
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'checkpoints'
  })

  const onSubmit = async data => {
    // setIsLoading(true)
    const { source, checkpoints, destination } = data
    const directionsService = new window.google.maps.DirectionsService()

    // const response = await axios.post(
    //   'https://routes.googleapis.com/directions/v2:computeRoutes',
    //   {
    //     origin: { address: 'Jaipur' },
    //     destination: { address: 'Mumbai' },
    //     travelMode: 'DRIVE',
    //     extraComputations: ['TOLLS']
    //     // routeModifiers: {
    //     //   vehicleInfo: {
    //     //     emissionType: 'GASOLINE'
    //     //   }
    //     // }
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    //       'X-Goog-FieldMask':
    //         'routes.duration,routes.distanceMeters,routes.travelAdvisory.tollInfo,routes.legs.travelAdvisory.tollInfo'
    //     }
    //   }
    // )
    // console.log(response)
    // return

    const waypoints =
      checkpoints.length > 0
        ? checkpoints.map((item, index) => {
            return { location: item, stopover: true }
          })
        : []
    const distanceObj = {
      origin: source,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
      // avoidTolls: false
    }

    directionsService.route(
      waypoints.length > 0
        ? {
            ...distanceObj,
            waypoints
          }
        : distanceObj,
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result)
          const totalDist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0)
          const dist = (totalDist / 1000).toFixed(2) + ' km'
          setTotalDistance(dist)
        } else {
          toast.error(`error fetching distance: ${result?.status}`)
        }
      }
    )
    setIsLoading(false)
  }

  const resetData = () => {}

  // if (!isLoaded) {
  //   return null
  // }

  return (
    <>
      <Loader open={isLoading} />
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={() => {
          setTotalDistance('')
          toggle(reset)
        }}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: {
              xs: '90%',
              sm: 500
            }
          }
        }}
      >
        <Header>
          <Typography variant='h6'>Distance Calculator</Typography>
          <IconButton size='small' onClick={toggle} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box component='form' sx={{ p: 5 }} onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 5 }}>
            <Controller
              name='source'
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Source'
                  fullWidth
                  value={value}
                  variant='outlined'
                  onChange={onChange}
                  error={Boolean(errors?.source)}
                />
              )}
            />
            {errors?.source && (
              <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                {errors?.source?.message}
              </FormHelperText>
            )}
          </FormControl>
          {fields.map((item, index) => (
            <Grid container spacing={6} key={item.id} sx={{ mb: 5 }}>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Controller
                    name={`checkpoints.${index}`}
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        // label='Referrals'
                        value={value}
                        variant='outlined'
                        onChange={onChange}
                        error={Boolean(errors?.checkpoints?.[index])}
                      />
                    )}
                  />
                  {errors?.checkpoints?.[index] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                      {errors?.checkpoints?.[index]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Fab
                  onClick={() => remove(index)}
                  // disabled={checkpoints.length == 1}
                  color='error'
                  aria-label='delete'
                  size='small'
                >
                  <Icon icon='mdi:delete' />
                </Fab>
              </Grid>
            </Grid>
          ))}
          <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} sx={{ px: 0 }}>
              <Button
                size='small'
                variant='contained'
                startIcon={<Icon icon='mdi:plus' fontSize={20} />}
                onClick={() => append('')}
              >
                Add Checkpoint
              </Button>
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mt: 5 }}>
            <Controller
              name='destination'
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Destination'
                  fullWidth
                  value={value}
                  variant='outlined'
                  onChange={onChange}
                  error={Boolean(errors?.destination)}
                />
              )}
            />
            {errors?.destination && (
              <FormHelperText sx={{ color: 'error.main' }} id='checkpoints-error'>
                {errors?.destination?.message}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
              Calculate Distance
            </Button>
            <Button
              size='large'
              variant='outlined'
              color='secondary'
              onClick={() => {
                setTotalDistance('')
                toggle(reset)
              }}
            >
              Cancel
            </Button>
          </Box>
          {totalDistance.length > 0 && (
            <Box sx={{ mt: 5 }}>
              <Divider variant='middle' />
              <Typography sx={{ mt: 5 }}>Distance: {totalDistance}</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default SideDrawer
