import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useRouter } from 'next/router'
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

import Loader from 'src/views/common/Loader'
import { postRequest } from 'src/api-main-file/APIServices'

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const ResetPassword = ({ registerUrl }) => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmit = async data => {
    const { password, confirmPassword } = data

    if (password != confirmPassword) {
      toast.error('Password and Confirm Password must be same')
      return
    }

    const routes = registerUrl.split('/')
    console.log(routes)
    // console.log(router.query)
    // return;

    setIsLoading(true)

    const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/${routes[routes.length - 1]}`
    // const response = await postRequest(`${api_url}/reset-password`, { password, token: router.query.token })
    const response = await postRequest(`http://localhost:4000/api/${routes[routes.length - 1]}/reset-password`, {
      password,
      token: router.query.token
    })
    setIsLoading(false)
    if (response.status) {
      toast.success(typeof response.data != 'object' ? response.data : 'Password reset successfully')
      router.push('/login')
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Box className='content-right'>
      <Loader open={isLoading} />
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
                        placeholder='Password'
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
                        placeholder='Confirm Password'
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

// ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
// ResetPassword.guestGuard = true

export default ResetPassword
