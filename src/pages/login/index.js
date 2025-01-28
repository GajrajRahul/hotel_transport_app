import Image from 'next/image'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useTheme } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import LoginRight from 'src/components/login/LoginRight'
import { DarkHelpIcon, FAQsIcon, HandShake } from 'src/utils/icons'

import { CardContent, Typography, Tooltip, Popover, Button } from '@mui/material'

import { useRouter } from 'next/router'

const images = ['/images/login_slider1.jpeg', '/images/login_slider2.jpeg', '/images/login_slider3.jpeg']

const LoginPage = () => {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const [background, setBackground] = useState('')

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        // backgroundImage: `url(${getRandomBackground()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Box
        sx={{
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
          sx={{
            // border: '1px solid red',
            display: 'flex',
            lineHeight: '0px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {!hidden && (
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'none', borderRadius: '15px' }}>
                <img
                  src={images[currentImage]}
                  alt='carousel'
                  width={'100%'}
                  // height={'100%'}
                  style={{ borderRadius: '10px' }}
                />
              </Card>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Card className='inner-card'>
              <LoginRight />
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
              // fontSize={10}
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
                  left: {
                    xs: '62% !important', // Center for mobile
                    sm: '84% !important', // Center for tablet
                    md: '84% !important', // Position for desktop
                  },
                  top: {
                    xs: '81% !important', // Adjust top position for mobile
                    sm: '86% !important', // Adjust top position for tablet
                    md: '86% !important', // Fixed top position for desktop
                  },
                  transform: {
                    xs: 'translateX(-50%)', // Center horizontally for mobile
                    sm: 'translateX(-50%)', // Center horizontally for tablet
                    md: 'none', // No transform needed for desktop
                  },
                  maxWidth: '100%',
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
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Card className='inner-card' sx={{ width: '550px' }}></Card>
          <Card className='inner-card' sx={{ width: '550px' }}>
            <LoginRight />
          </Card>
        </Box> */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}>
          <Card className='footer-card' sx={{ display: 'flex', alignItems: 'center', width: '82%', height: '45px' }}>
            <CardContent>
              <Typography color='white' fontSize={20}>
                © 2019 - 2024 Adventure Richa Holidays. All rights reserved.
              </Typography>
            </CardContent>
          </Card>
        </Box> */}
      </Box>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
