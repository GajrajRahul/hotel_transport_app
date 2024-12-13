import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'

import Icon from 'src/@core/components/icon'

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
  // fontSize: '0.875rem',
  textDecoration: 'none',
  color: 'white'
}))

const CustomLinkStyled = styled(Link)(({ theme }) => ({
  // fontSize: '0.75rem',
  textDecoration: 'none'
}))

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const auth = useAuth()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      email: ''
    }
  })

  const onSubmit = async data => {
    const { email, password } = data
    try {
      const response = await auth.login({ email, password, clientType: tabValue })
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Box className='content-right'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          px: 10
        }}
      >
        <Box sx={{ textAlign: 'center', mt: '20px' }}>
          <Image src='/images/white_logo.png' width={250} height={85} alt='company_logo' />
        </Box>
        <Grid
          container
          spacing={6}
          // sx={{
          //   border: '1px solid red'
          // }}
        >
          <Grid item xs={12} md={6}>
            <Card className='inner-card'></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className='inner-card'>
              <Box
                sx={{
                  p: '0px 40px 0px 40px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <BoxWrapper>
                  <Box sx={{ mb: 6, mt: 5 }}>
                    <TypographyStyled sx={{ typography: { xs: 'h4', laptopSm: 'h3' } }} color='white'>
                      Welcome Back!
                    </TypographyStyled>
                    <Typography sx={{ typography: { xs: 'body2', laptopSm: 'body1' } }} color='white'>
                      Let's Plan Journey's Together!
                    </Typography>
                  </Box>
                  <form
                    style={{ display: 'flex', flexDirection: 'column' }}
                    noValidate
                    autoComplete='off'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <FormControl sx={{ mb: 3, mt: 0 }}>
                      <Controller
                        name='email'
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            onBlur={onBlur}
                            fullWidth
                            sx={{
                              background: 'rgba(234, 240, 247, 0.5)',
                              // width: { mobileMd: '270px', sm: '350px', md: '270px', laptopSm: '350px' },
                              borderRadius: '10px'
                            }}
                            onChange={onChange}
                            id='auth-login-email'
                            error={Boolean(errors.email)}
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl>
                      <Controller
                        name='password'
                        control={control}
                        rules={{ required: 'Password is required' }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            onBlur={onBlur}
                            fullWidth
                            sx={{
                              background: 'rgba(234, 240, 247, 0.5)',
                              // width: { mobileMd: '270px', sm: '350px', md: '270px', laptopSm: '350px' },
                              borderRadius: '10px'
                            }}
                            onChange={onChange}
                            id='auth-login-v2-password'
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
                        <FormHelperText sx={{ color: 'error.main' }} id='password'>
                          {errors.password.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <Typography
                      sx={{
                        mt: 1,
                        mb: 1,
                        fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem' },
                        textAlign: 'end'
                      }}
                    >
                      <LinkStyled href='/forgot-password'>Recover Password?</LinkStyled>
                    </Typography>
                    <Button
                      type='submit'
                      variant='contained'
                      fullWidth
                      sx={{
                        // width: { mobileMd: '270px', sm: '350px', md: '270px', laptopSm: '350px' },
                        borderRadius: '10px'
                      }}
                    >
                      Sign In
                    </Button>
                    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem' } }}
                        variant='caption'
                        color='white'
                      >
                        By logging in, you accept the adventurerichaholidays.com
                      </Typography>
                      <Typography
                        sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem' } }}
                        variant='caption'
                        color='white'
                      >
                        <CustomLinkStyled color='blue' href='/'>
                          Terms & conditions
                        </CustomLinkStyled>
                         and 
                        <CustomLinkStyled color='blue' href='/'>
                          Privacy statement
                        </CustomLinkStyled>
                      </Typography>
                    </Box>
                  </form>
                </BoxWrapper>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Card className='footer-card'>
          <CardContent sx={{ pt: '15px !important', pb: '15px !important' }}>
            <Typography
              sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '1rem' } }}
              color='white'
              // fontSize={20}
            >
              © 2019 - 2024 Adventure Richa Holidays. All rights reserved.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
AdminLoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
AdminLoginPage.guestGuard = true

export default AdminLoginPage
