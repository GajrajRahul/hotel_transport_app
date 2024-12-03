import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import Icon from 'src/@core/components/icon'

const CusomInputWithButttons = ({ name, hotelControl, isRequired, label, errors }) => {
  return (
    <FormControl>
      <Controller
        name={name}
        control={hotelControl}
        rules={{ required: isRequired }}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            label={label}
            sx={{
              '&.MuiFormControlLabel-root': {
                alignItems: 'flex-start',
                ml: 0
              }
            }}
            labelPlacement='top'
            control={
              <Box>
                <IconButton
                  edge='end'
                  onClick={e => {
                    e.stopPropagation()
                    if (Number(value) != 0) {
                      onChange(`${Number(value) - 1}`)
                    }
                  }}
                  aria-label='toggle minus visibility'
                  size='small'
                  sx={{
                    mr: 3,
                    backgroundColor: theme => theme.palette.primary.main,
                    color: 'white',
                    '&.MuiIconButton-root:hover': {
                      backgroundColor: theme => theme.palette.primary.main
                    }
                  }}
                >
                  <Icon icon='mdi:minus' />
                </IconButton>
                {value.length == 0 ? 0 : value}
                <IconButton
                  edge='end'
                  onClick={e => {
                    e.stopPropagation()
                    onChange(`${Number(value) + 1}`)
                  }}
                  aria-label='toggle plus visibility'
                  size='small'
                  sx={{
                    ml: 3,
                    backgroundColor: theme => theme.palette.primary.main,
                    color: 'white',
                    '&.MuiIconButton-root:hover': {
                      backgroundColor: theme => theme.palette.primary.main
                    }
                  }}
                >
                  <Icon icon='mdi:plus' />
                </IconButton>
              </Box>
            }
          />
        )}
      />
      {errors[name] && (
        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-rooms'>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default CusomInputWithButttons
