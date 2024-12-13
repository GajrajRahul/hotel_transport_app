import React, { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

import { useTheme } from '@mui/material'

import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { BusTaxi, Coins, Meal, People, Track } from 'src/utils/icons'

const incredibles = [
  {
    id: 1,
    image: '/images/incredibles/incredible_1.jpg',
    location: 'Rajasthan Heritage Odyssey',
    description: 'Treasure Trail of Timeless Tales',
    isDay: false,
    isAfternoon: false,
    isNight: false,
    totalDay: '5',
    price: 'Rs 6,400',
    journey: ['Jaipur', 'Pushker', 'Ajmer', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    isDelux: true,
    isTransport: true,
    isMeal: true,
    isTrending: true
  },
  {
    id: 2,
    image: '/images/incredibles/incredible_1.jpg',
    location: 'Rajasthan Heritage Odyssey',
    description: 'Treasure Trail of Timeless Tales',
    isDay: false,
    isAfternoon: false,
    isNight: false,
    totalDay: '5',
    price: 'Rs 6,400',
    journey: ['Jaipur', 'Pushker', 'Ajmer', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    isDelux: true,
    isTransport: true,
    isMeal: true,
    isTrending: false
  },
  {
    id: 3,
    image: '/images/incredibles/incredible_2.jpg',
    location: 'Rajasthan Heritage Odyssey',
    description: 'Treasure Trail of Timeless Tales',
    isDay: false,
    isAfternoon: false,
    isNight: false,
    totalDay: '5',
    price: 'Rs 6,400',
    journey: ['Jaipur', 'Pushker', 'Ajmer', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    isDelux: true,
    isTransport: true,
    isMeal: true,
    isTrending: true
  },
  {
    id: 4,
    image: '/images/incredibles/incredible_3.jpg',
    location: 'Rajasthan Heritage Odyssey',
    description: 'Treasure Trail of Timeless Tales',
    isDay: false,
    isAfternoon: false,
    isNight: false,
    totalDay: '5',
    price: 'Rs 6,400',
    journey: ['Jaipur', 'Pushker', 'Ajmer', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    isDelux: true,
    isTransport: true,
    isMeal: true,
    isTrending: false
  }
]

const Dashboard = () => {
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')
  const theme = useTheme()

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 5,
            pb: 3,
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant='h4'>Your Gateway to Incredible Adventures</Typography>
          <Divider sx={{ width: '100px' }} />
          <Typography>
            Unlock a world of unforgettable travel experiences! Browse through captivating travel packages designed to
            suit every wanderlust dream. From serene escapes to thrilling expeditions, manage and showcase your
            offerings effortlessly.
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='role-select'>Select Role</InputLabel>
                <Select
                  fullWidth
                  value={role}
                  id='select-role'
                  label='Select Role'
                  labelId='role-select'
                  onChange={handleRoleChange}
                  inputProps={{ placeholder: 'Select Role' }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='author'>Author</MenuItem>
                  <MenuItem value='editor'>Editor</MenuItem>
                  <MenuItem value='maintainer'>Maintainer</MenuItem>
                  <MenuItem value='subscriber'>Subscriber</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='plan-select'>Select Plan</InputLabel>
                <Select
                  fullWidth
                  value={plan}
                  id='select-plan'
                  label='Select Plan'
                  labelId='plan-select'
                  onChange={handlePlanChange}
                  inputProps={{ placeholder: 'Select Plan' }}
                >
                  <MenuItem value=''>Select Plan</MenuItem>
                  <MenuItem value='basic'>Basic</MenuItem>
                  <MenuItem value='company'>Company</MenuItem>
                  <MenuItem value='enterprise'>Enterprise</MenuItem>
                  <MenuItem value='team'>Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='status-select'>Select Status</InputLabel>
                <Select
                  fullWidth
                  value={status}
                  id='select-status'
                  label='Select Status'
                  labelId='status-select'
                  onChange={handleStatusChange}
                  inputProps={{ placeholder: 'Select Role' }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                {incredibles.map(i => (
                  <Grid key={i.id} item xs={12} tablet={6} lg={4} desktopXs={3}>
                    <Card sx={{ borderRadius: '10px' }}>
                      <CardMedia sx={{ height: '11.25rem', position: 'relative' }} image={i.image}>
                        {i.isTrending && (
                          <Box
                            sx={{
                              height: '33px',
                              borderRadius: '0px 7px 7px 0px',
                              width: '120px',
                              background: 'linear-gradient(rgba(255, 233, 200, 1), rgba(255, 191, 117, 1))',
                              position: 'absolute',
                              top: '10px'
                              // px: '5px',
                              // pt: '2px'
                              // display: 'flex',
                              // alignItems: 'center'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', p: '3px' }}>
                              <Icon icon='mdi:fire' color={theme.palette.primary.main} />
                              <Typography sx={{ color: '#FB7601 !important' }}>Trending</Typography>
                            </Box>
                          </Box>
                        )}
                      </CardMedia>
                      <CardContent>
                        <Box sx={{ display: 'flex' }}>
                          <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, width: '4rem', height: '4rem' }}>
                            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontWeight: 200,
                                  lineHeight: 1.29,
                                  color: '#FB7601 !important',
                                  letterSpacing: '0.47px'
                                }}
                              >
                                Night
                              </Typography>
                              <Typography variant='h6' sx={{ mt: -0.75, fontWeight: 600, color: 'primary.main' }}>
                                5
                              </Typography>
                            </Box>
                          </CustomAvatar>
                          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>{i.location}</Typography>
                            <Typography variant='caption' sx={{ letterSpacing: '0.4px' }}>
                              {i.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider
                          sx={{
                            mb: theme => `${theme.spacing(4)} !important`,
                            mt: theme => `${theme.spacing(4.75)} !important`
                          }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              '& svg': { fontSize: '1.75rem' }
                            }}
                          >
                            {/* <Icon icon='mdi:star-outline' /> */}
                            <Typography sx={{ color: '#FB7601 !important' }}>{BusTaxi}</Typography>
                            <Typography sx={{ fontSize: '0.75rem' }}>Transport</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              '& svg': { fontSize: '1.75rem' }
                            }}
                          >
                            {/* <Icon icon='mdi:check-circle-outline' /> */}
                            <Typography sx={{ color: '#FB7601 !important' }}>{Meal}</Typography>
                            <Typography sx={{ fontSize: '0.75rem' }}>Meals</Typography>
                          </Box>
                          <Box
                            sx={{
                              color: 'primary.main',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              '& svg': { fontSize: '0.5rem' }
                            }}
                          >
                            {/* <Icon icon='mdi:account-outline' /> */}
                            <Typography sx={{ color: '#FB7601 !important' }}>{People}</Typography>
                            <Typography sx={{ fontSize: '0.75rem' }}>3</Typography>
                          </Box>
                        </Box>

                        <Divider
                          sx={{
                            mt: theme => `${theme.spacing(2.75)} !important`,
                            mb: theme => `${theme.spacing(3.25)} !important`
                          }}
                        />

                        <Box
                          sx={{
                            mb: 2,
                            display: 'flex',
                            '& svg': { mt: 1 },
                            alignItems: 'center',
                            gap: 3
                          }}
                        >
                          {/* <Icon icon='mdi:clock-time-three-outline' /> */}
                          <Typography sx={{ color: '#FB7601 !important' }}>{Coins}</Typography>
                          <Typography fontSize={18}>₹ 6,400</Typography>
                          <Typography
                            fontSize={18}
                            className='custom_strike_through'
                            sx={{
                              color: 'text.disabled',
                              // textDecoration: 'line-through',
                              textDecorationColor: theme => theme.palette.primary.main
                            }}
                          >
                            ₹ 7,999
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: theme => `${theme.palette.primary.main} !important`,
                              px: 2,
                              py: 0.5,
                              borderRadius: '5px',
                              //   height: '25px',
                              textAlign: 'center'
                              //   pt: 1
                            }}
                          >
                            <Typography fontSize={10} sx={{ color: 'white' }}>
                              Save 20%
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            '& svg': { mr: 3, mt: 1 }
                          }}
                        >
                          {/* <Icon icon='mdi:map-marker-outline' /> */}
                          <Typography sx={{ color: '#FB7601 !important' }}>{Track}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {i.journey.map((j, index) =>
                              index < 4 ? (
                                <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ fontSize: '0.875rem' }}>{j}</Typography>
                                  <Typography sx={{ mr: 1 }}>&#8674;</Typography>
                                </Box>
                              ) : (
                                index == 4 && (
                                  <Box
                                    key={index}
                                    sx={{
                                      backgroundColor: theme => `${theme.palette.primary.main} !important`,
                                      p: 3,
                                      borderRadius: '50%',
                                      height: '30px',
                                      pt: 1.5
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '0.75rem', color: 'white' }}>
                                      {i.journey.length - 4}
                                    </Typography>
                                  </Box>
                                )
                              )
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
