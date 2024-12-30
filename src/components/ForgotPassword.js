import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

import { styled, useTheme } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import Loader from './common/Loader'
import { postRequest } from 'src/api-main-file/APIServices'

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const CustomLinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ForgotPassword = ({ registerUrl }) => {
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async data => {
    const { email } = data
    const routes = registerUrl.split('/')

    setIsLoading(true)

    const api_url = `${process.env.NEXT_PUBLIC_BASE_URL}/${routes[routes.length - 1]}`
    const response = await postRequest(`${api_url}/forgot-password`, { email })
    // const response = await postRequest(`http://localhost:4000/api/${routes[routes.length - 1]}/forgot-password`, { email })
    setIsLoading(false)
    if (response.status) {
      toast.success('Email Send Successfully')
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
                Recover Your Account
              </TypographyStyled>
              <Typography color='white' variant='body2'>
                A link to reset your password will be sent to your registered email address. Click the link to create a
                new password.
              </Typography>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl sx={{ mb: 3, mt: 10 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: 'Email is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        sx={{ background: 'rgba(234, 240, 247, 0.5)', width: '350px' }}
                        onChange={onChange}
                        id='auth-login-email'
                        placeholder='Email'
                        error={Boolean(errors.email)}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <Button type='submit' variant='contained' sx={{ width: '350px' }}>
                  Submit
                </Button>
              </form>
              <Divider sx={{ mb: 10, mt: 10, backgroundColor: 'white' }} />
              <Typography variant='body2' color='white'>
                Go to <CustomLinkStyled href='/login'>Login Page</CustomLinkStyled>
              </Typography>
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

// ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
// ForgotPassword.guestGuard = true

export default ForgotPassword
