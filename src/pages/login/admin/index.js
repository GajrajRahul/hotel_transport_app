import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'

import Icon from 'src/@core/components/icon'
import { DarkHelpIcon, FAQsIcon, HandShake } from 'src/utils/icons'
import { CardContent, Typography, Tooltip, Popover, Button } from '@mui/material'

import { useRouter } from 'next/router'

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

const images = ['/images/login_slider1.png', '/images/login_slider2.png', '/images/login_slider3.png']

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const [background, setBackground] = useState('')

  const auth = useAuth()

  const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * urls.length)
    return urls[randomIndex]
  }

  useEffect(() => {
    // Set the initial random background
    setBackground(getRandomBackground())

    // Interval to change the background image (or other behavior) every 5 seconds
    const interval = setInterval(() => {
      setCurrentImage(prevImage => (prevImage + 1) % images.length)
    }, 5000)

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures this runs once on mount

  let urls = [
    '/images/bakcground-Images/background-arh-indiagate.jpeg',
    '/images/bakcground-Images/background-arh-tajmaha.jpeg',
    '/images/bakcground-Images/background-arh-dubai.jpeg',
    '/images/bakcground-Images/background-arh-dubaiburjkhalifa.jpeg',
    '/images/bakcground-Images/background-arh-dubaiskyview.jpeg',
    '/images/bakcground-Images/background-arh-hawamahal.jpeg',
    '/images/bakcground-Images/background-arh-himachalforest.jpeg',
    '/images/bakcground-Images/background-arh-himachalmountains.jpeg'
  ]

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    setOpen(!open) // Toggle the popover visibility
  }

  // Handle the close of the Popover
  const handleClose = () => {
    setOpen(false)
  }

  const handleFaqClick = () => {
    // Redirect to the FAQ page
    router.push('/faqs') // Make sure to replace '/faq' with your actual FAQ route
  }

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
      const response = await auth.login({ email, password, clientType: 'admin' })
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Box className='content-right'>
      <Box
        sx={{
          backgroundImage: `url(${background})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100vh',
          px: 10
        }}
      >
        <Box sx={{ textAlign: 'center', mt: '20px' }}>
          <Image src='/images/white_logo.png' width={250} height={85} alt='company_logo' />
        </Box>
        <Grid
          container
          spacing={6}
          alignItems={'center'}
        >
          {!hidden && (
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'none', borderRadius: '15px', lineHeight: '0px' }}>
                <img
                  src={images[currentImage]}
                  alt='carousel'
                  height={'auto'}
                  width={'100%'}
                  style={{ borderRadius: '10px' }}
                />
              </Card>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Card className='inner-card'>
              <Box
                sx={{
                  p: '3% 5% 7% 5%',
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
                      sx={{ typography: { xs: 'body2', laptopSm: 'body1' }, fontWeight: '500 !important' }}
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
                            placeholder='Email'
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
                            placeholder='Password'
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
                      <LinkStyled sx={{ color: '#ffffff', fontWeight: '500' }} href='/forgot-password'>
                        Recover Password?
                      </LinkStyled>
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
                        sx={{
                          fontSize: {
                            xs: '0.56rem',
                            sm: '0.75rem',
                            md: '0.56rem',
                            laptopSm: '0.75rem',
                            fontWeight: '500'
                          }
                        }}
                        variant='caption'
                        color='#ffffff'
                      >
                        By logging in, you accept the adventurerichaholidays.com
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: '0.56rem',
                            sm: '0.75rem',
                            md: '0.56rem',
                            laptopSm: '0.75rem',
                            fontWeight: '500'
                          }
                        }}
                        variant='caption'
                        color='white'
                      >
                        <CustomLinkStyled sx={{ color: 'blue' }} href='/'>
                          Terms & conditions
                        </CustomLinkStyled>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: '0.56rem',
                              sm: '0.75rem',
                              md: '0.56rem',
                              laptopSm: '0.75rem',
                              fontWeight: '500'
                            }
                          }}
                          variant='caption'
                          color='#ffffff'
                          marginLeft={'5px'}
                          marginRight={'5px'}
                        >
                          and
                        </Typography>
                        <CustomLinkStyled sx={{ color: 'blue' }} href='/'>
                          Privacy statement
                        </CustomLinkStyled>
                      </Typography>
                    </Box>
                  </form>
                </BoxWrapper>
              </Box>
            </Card>
          </Grid>
          {hidden && (
            <Grid item xs={12} md={6} sx={{ mb: 7 }}>
              <Card sx={{ background: 'none' }}>
                <img src={images[currentImage]} alt='carousel' width={'100%'} style={{ borderRadius: '10px' }} />
              </Card>
            </Grid>
          )}
        </Grid>
        <Card className='footer-card'>
          <CardContent
            sx={{
              pt: '15px !important',
              pb: '15px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '1rem', fontWeight: '500' } }}
              color='#ffffff'
              // fontSize={20}
            >
              © 2024 Adventure Richa Holidays
            </Typography>
            <Tooltip title='Need Help?' placement='left' arrow>
              <Box
                sx={{ backgroundColor: '#ffffff', borderRadius: '50px', display: 'flex', alignItems: 'center' }}
                onClick={handleClick}
              >
                {DarkHelpIcon}
              </Box>
            </Tooltip>
            {/* Popover for the FAQ and Chat options */}
            <Popover
              sx={{
                '& .MuiPopover-paper': {
                  backgroundColor: 'transparent', // Set background to transparent
                  boxShadow: 'none', // Remove shadow
                  padding: '0px', // Optional: remove padding if you want to minimize space
                  border: 'none', // Optional: Remove the border if you want no outline
                  left: '1275px !important',
                  top: '600px !important'
                }
              }}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <Box
                style={{
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'left',
                  background: '#ffffff00'
                }}
              >
                <Button
                  sx={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ff7b00',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffb76b', // Change the background color on hover
                      color: 'orange', // Change the text color on hover
                      transform: 'scale(1.05)', // Optional: add a slight scale effect on hover
                      boxShadow: 'none' // Optional: add a shadow on hover
                    }
                  }}
                  onClick={handleFaqClick} // Set the onClick handler
                >
                  {FAQsIcon}
                  <Typography sx={{ fontWeight: '600', marginLeft: '10px', color: 'White' }}>FAQs</Typography>
                </Button>

                <Button
                  sx={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ff7b00',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffb76b', // Change the background color on hover
                      color: 'orange', // Change the text color on hover
                      transform: 'scale(1.05)', // Optional: add a slight scale effect on hover
                      boxShadow: 'none' // Optional: add a shadow on hover
                    }
                  }}
                  onClick={() =>
                    window.open(
                      'https://wa.me/+919784189197?text=kindly%20describe%20your%20issue%20before%20starting%20the%20chat%20with%20our%20ARH%20support%20experts.%20Your%20details%20will%20help%20us%20assist%20you%20more%20efficiently!',
                      '_blank'
                    )
                  }
                >
                  {HandShake}
                  <Typography sx={{ fontWeight: '600', marginLeft: '10px', color: 'white' }}>Chat</Typography>
                </Button>
              </Box>
            </Popover>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
AdminLoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
AdminLoginPage.guestGuard = true

export default AdminLoginPage
