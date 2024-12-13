import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'

import { styled } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(2)
}))

const CitiesDialog = ({
  open,
  handleClose,
  hotelRate,
  selectedCitiesHotels,
  setSelectedCitiesHotels
}) => {
  const hotelInfoReduxData = useSelector(state => state.hotelInfo)
  const dispatch = useDispatch()

  const {
    reset,
    watch,
    setValue,
    setError,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      city: ''
    }
  })

  const city = watch('city')
  const [chipData, setChipData] = useState(selectedCitiesHotels)

  useEffect(() => {
    setChipData(selectedCitiesHotels)
  }, [open])

  const onSubmit = () => {
    const isCityExist = Object.keys(hotelRate).find(
      cityHotel =>
        cityHotel ==
        city
          .split(' ')
          .map(c => `${c.trim()[0]?.toLowerCase()}${c.trim()?.slice(1)}`)
          .join('_')
    )
    if (isCityExist) {
      setChipData(prev => [
        ...prev,
        {
          id: Date.now(),
          label: city
            .split(' ')
            .map(c => c.toLowerCase())
            .join('_'),
          info: []
        }
      ])
      setValue('city', '')
    } else {
      setError('city', { message: 'City not available' })
    }
  }

  const handleDelete = chipToDelete => () => {
    const remainingCities = chipData.filter(city => city.id !== chipToDelete.id)
    setChipData(remainingCities)
  }

  const onFinalSubmit = () => {
    setSelectedCitiesHotels(chipData)
    resetValues()
  }

  const resetValues = () => {
    reset()
    handleClose()
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={resetValues}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 3
          }
        }}
        textAlign='center'
      >
        Select Locations
      </DialogTitle>
      <DialogContent>
        <DialogContentText textAlign='center'>Select locations where you want to book your stay.</DialogContentText>
        <Box sx={{ mt: 5 }}>
          <Typography>Add New City</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor='stepper-linear-account-name' error={Boolean(errors.city)}>
              City
            </InputLabel>
            <Controller
              name='city'
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label='City'
                  onChange={onChange}
                  id='stepper-linear-personal-city'
                  error={Boolean(errors.city)}
                  endAdornment={
                    <InputAdornment
                      position='end'
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: theme => theme.palette.primary.main,
                        height: '45px',
                        p: '3px',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                      onClick={handleSubmit(onSubmit)}
                    >
                      <Icon icon='mdi:add' />
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.city && (
              <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-first-name'>
                {errors.city.message}
              </FormHelperText>
            )}
          </FormControl>
          <Typography sx={{ mt: 5 }} fontWeight={600}>
            Selected Locations
          </Typography>
          <Box
            sx={{
              display: 'flex',
              //   justifyContent: 'center',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0.5,
              m: 0,
              mt: 3
            }}
            component='ul'
          >
            {chipData.map(data => {
              return (
                <ListItem key={data.id}>
                  <Chip
                    sx={{
                      '&.MuiChip-root': {
                        backgroundColor: theme => theme.palette.primary.main
                      },
                      '& .MuiChip-deleteIcon, .MuiChip-label, .MuiChip-deleteIcon:hover': {
                        color: 'white'
                      }
                    }}
                    label={
                      data.label
                        ? data.label
                            .split('_')
                            .map(c => `${c[0].toUpperCase()}${c.slice(1)}`)
                            .join(' ')
                        : ''
                    }
                    onDelete={handleDelete(data)}
                  />
                </ListItem>
              )
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={resetValues}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onFinalSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CitiesDialog
