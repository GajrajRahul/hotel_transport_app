import Image from 'next/image'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import LoginRight from 'src/components/login/LoginRight'

const LoginPage = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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
          //   flexDirection: {
          //     xs: 'column',
          //     md: 'row'
          //   }
          // }}
        >
          <Grid item xs={12} md={6}>
            <Card className='inner-card'></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className='inner-card'>
              <LoginRight />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className='footer-card'>
              <CardContent>
                <Typography
                  sx={{ fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '0.75rem' } }}
                  color='white'
                  fontSize={20}
                >
                  © 2019 - 2024 Adventure Richa Holidays. All rights reserved.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
