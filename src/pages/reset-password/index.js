import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import Link from 'next/link'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

import { styled, useTheme } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useSettings } from 'src/@core/hooks/useSettings'

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const CustomLinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ResetPassword = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = data => {
    // const { email, password } = data
    // auth.login({ email, password }, () => {
    //   setError('email', {
    //     type: 'manual',
    //     message: 'Email or Password is invalid'
    //   })
    // })
  }

  return (
    <Box className='content-right'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box sx={{ textAlign: 'center', mt: '20px' }}>
          <Image src='/../public/images/white_logo.png' width={250} height={85} alt='company_logo' />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card className='inner-card' sx={{ width: '600px' }}>
            <Box
              sx={{
                mb: 6,
                p: '40px 40px 0px 40px',
                height: '100%',
                textAlign: 'center'
              }}
            >
              <TypographyStyled color='white' variant='h4'>
                Set New Password
              </TypographyStyled>
              <Typography color='white' variant='body2'>
                A link to reset your password will be sent to your registered email address. Click the link to create a
                new password.
              </Typography>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl sx={{ mb: 3, mt: 10 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        sx={{ background: 'rgba(234, 240, 247, 0.5)', width: '350px' }}
                        onChange={onChange}
                        id='auth-login-password'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl sx={{ mb: 3 }}>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: 'ConfirmPassword is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        sx={{ background: 'rgba(234, 240, 247, 0.5)', width: '350px' }}
                        onChange={onChange}
                        id='auth-login-confirm-password'
                        error={Boolean(errors.confirmPassword)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <Icon
                                icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                fontSize={20}
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>
                  )}
                </FormControl>
                <Button type='submit' variant='contained' sx={{ width: '350px' }}>
                  Submit
                </Button>
              </form>
            </Box>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}>
          <Card className='footer-card' sx={{ display: 'flex', alignItems: 'center', width: '600px', height: '45px' }}>
            <CardContent>
              <Typography color='white' fontSize={17}>
                © 2019 - 2024 Adventure Richa Holidays. All rights reserved.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
