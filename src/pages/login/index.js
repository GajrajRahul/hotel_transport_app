import Image from 'next/image'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import LoginRight from 'src/components/login/LoginRight'
import { DarkHelpIcon } from 'src/utils/icons'


const images = ['/images/login_slider1.png', '/images/login_slider2.png', '/images/login_slider3.png']


const LoginPage = () => {
  const [currentImage, setCurrentImage] = useState(0)

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prevImage => (prevImage + 1) % images.length)
    }, 5000) // 5000ms = 5 seconds

    return () => clearInterval(interval) // Clean up on unmount
  }, [])

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
          {!hidden && (
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'none', height: '500px' }}>
                <img
                  src={images[currentImage]}
                  alt='carousel'
                  width={'100%'}
                  height={'100%'}
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
              sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '1rem' } }}
              color='black'
              // fontSize={20}
            >
             © 2024 Adventure Richa Holidays
            </Typography>
            {DarkHelpIcon}
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
