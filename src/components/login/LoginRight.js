import { useForm, Controller } from 'react-hook-form'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Link from 'next/link'

import MuiTabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { styled } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { borderBottom } from '@mui/system'

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

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    // backgroundColor: 'transparent !important'
     backgroundColor: '#FB7601 !important'
  },
  '& .MuiTab-root': {
    minHeight: 38,
    // minWidth: 130,
    borderRadius: '8px 8px 0px 0px',
    // backgroundColor: 'rgba(61, 61, 61, 0.25)',
    color: `${theme.palette.common.white} !important`,
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    fontWeight : '700'
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const LoginRight = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [tabValue, setTabValue] = useState('partner')

  const auth = useAuth()

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      email: ''
    }
  })

  const handleTabValue = (event, newValue) => {
    reset()
    setTabValue(newValue)
  }

  const onSubmit = async data => {
    const { email, password } = data
    try {
      const response = await auth.login({ email, password, clientType: tabValue })
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <TabContext value={tabValue}>
      <TabList onChange={handleTabValue} aria-label='customized tabs example'>
        <Tab sx={{ minWidth: 1 / 2 }} value='partner' label='Partners' />
        <Tab sx={{ minWidth: 1 / 2 }} value='employee' label='Travel Experts' />
      </TabList>
      <TabPanel value='partner'>
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
            <TypographyStyled
                sx={{ typography: { xs: 'h4', laptopSm: 'h3' }, fontWeight: '700 !important' }}
                color='#ffffff'
              >
                Welcome Back!
              </TypographyStyled>
              <Typography
                sx={{ typography: { xs: 'body2', laptopSm: 'body1', fontWeight: '500 !important' } }}
                color='#ffffff'
              >
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
                      placeholder='Email'
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
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
                      placeholder='Password'
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
                <LinkStyled sx={{ color: '#ffffff !important', fontWeight: '500' }} href={`/forgot-password/${tabValue}`}>Recover Password?</LinkStyled>
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
                  sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                  variant='caption'
                  color='#ffffff'
                >
                  By logging in, you accept the adventurerichaholidays.com
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                  variant='caption'
                  color='#ffffff'
                >
                  <CustomLinkStyled sx={{color: 'blue'}} href='/'>
                    Terms & conditions
                  </CustomLinkStyled>
                  <Typography
                    sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                    variant='caption'
                    color='#ffffff'
                    marginLeft={'5px'}
                    marginRight={'5px'}
                  >
                    and
                  </Typography>
                  <CustomLinkStyled sx={{color: 'blue'}} href='/'>
                    Privacy statement
                  </CustomLinkStyled>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </TabPanel>
      <TabPanel value='employee'>
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
            <TypographyStyled
                sx={{ typography: { xs: 'h4', laptopSm: 'h3' }, fontWeight: '700 !important' }}
                color='#ffffff'
              >
                Welcome Back!
              </TypographyStyled>
              <Typography
                sx={{ typography: { xs: 'body2', laptopSm: 'body1', fontWeight: '500 !important' } }}
                color='#ffffff'
              >
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
                        // width: '350px',
                        borderRadius: '10px'
                      }}
                      placeholder='Email'
                      onChange={onChange}
                      id='auth-login-email'
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
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
                        // width: '350px',
                        borderRadius: '10px'
                      }}
                      onChange={onChange}
                      id='auth-login-v2-password'
                      placeholder='Password'
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
                <LinkStyled sx={{ color: '#ffffff !important', fontWeight: '500' }} href={`/forgot-password/${tabValue}`}>Recover Password?</LinkStyled>
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
                  sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                  variant='caption'
                  color='#ffffff'

                >
                  By logging in, you accept the adventurerichaholidays.com
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                  variant='caption'
                  color='white'

                >
                  <CustomLinkStyled sx={{color: 'blue'}} href='/'>
                    Terms & conditions
                  </CustomLinkStyled>
                  <Typography
                    sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem',fontWeight: '500' } }}
                    variant='caption'
                    color='#ffffff'
                    marginLeft={'5px'}
                    marginRight={'5px'}
                  >
                    and
                  </Typography>
                  <CustomLinkStyled sx={{color: 'blue'}} href='/'>
                    Privacy statement
                  </CustomLinkStyled>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </TabPanel>
    </TabContext>
  )
}

export default LoginRight
