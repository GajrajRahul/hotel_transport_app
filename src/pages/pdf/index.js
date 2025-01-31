import React from 'react'
import { Box, Button, Container, Grid, Typography, Link } from '@mui/material'
import Image from 'next/image'
import BlankLayout from 'src/@core/layouts/BlankLayout'
const PdfTracking = () => {
  return (
    <Box sx={{ backgroundColor: '#fff', height: '100vh' }}>
      <Container maxWidth='lg' sx={{ height: '100%', py: 6 }}>
        <Grid container spacing={4} alignItems='center' justifyContent='space-between' sx={{ height: '100%' }}>
          {/* Left side (Logo, Title, Subtitle, Buttons, Social Icons) */}
          <Grid item xs={12} md={6} >
            <Box sx={{  padding: { xs: '15px', md: '20px' } }}>
              <Typography variant='h2' sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: '900', color: '#333', mb: 2 }}>
              Unlock Your Perfect Travel Itinerary
              </Typography>
              <Typography variant='body1' sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: '#777', mb: 7 }}>
              Download or view your personalized travel plan in seconds. Everything you need for a smooth trip!
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button variant='contained' color='primary' sx={{ mr: 2 }}>
                  Download
                </Button>
                <Button variant='outlined' color='primary'>
                  View File
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right side (Hero Image) */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src='/images/download-pdf.jpg'
              alt='Hero Image'
              width={600}
              height={400}
              style={{ borderRadius: '10px', maxWidth: '90%', height: 'auto' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

PdfTracking.getLayout = page => <BlankLayout>{page}</BlankLayout>
PdfTracking.guestGuard = true

export default PdfTracking
