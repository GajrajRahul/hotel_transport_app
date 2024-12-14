import { forwardRef } from 'react'
import format from 'date-fns/format'

import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import { useTheme } from '@mui/material'

import Icon from 'src/@core/components/icon'

const CustomInput = forwardRef((props, ref) => {
  const { start, end, propserror } = props
  const startDate = start !== null ? format(start, 'dd MMM yyyy') : null
  const endDate = end !== null ? ` - ${format(end, 'dd MMM yyyy')}` : null
  const value = `${startDate !== null ? startDate : ''}${endDate !== null ? endDate : ''}`
  const theme = useTheme()

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor='stepper-linear-account-password' error={Boolean(propserror.dates || propserror.daysNights)}>
        {props.label || ''}
      </InputLabel>
      <OutlinedInput
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
        error={Boolean(propserror.dates || propserror.daysNights)}
        fullWidth
        startAdornment={
          <InputAdornment position='start'>
            <Icon icon='mdi:checkin-calendar' color={theme.palette.primary.main} />
          </InputAdornment>
        }
      />
      {(propserror.dates || propserror.daysNights) && (
        <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-password'>
          {/* {propserror.dates?.message || propserror.daysNights?.message} */}
          This field is required
        </FormHelperText>
      )}
    </FormControl>
  )
})

export default CustomInput
