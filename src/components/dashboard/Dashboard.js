import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

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
import Preview from './Preview'

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
  const travelPackageReduxData = useSelector(state => state.travelPackageData)
  const [travelPackageData, setTravelPackageData] = useState(travelPackageReduxData)
  const [selectedTravelPackage, setSelectedTravelPackage] = useState(null)

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

  const resetSelectedTravelPackage = useCallback(() => {
    setSelectedTravelPackage(null)
  }, [])

  return (
    <>
      {!selectedTravelPackage ? (
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
            <Typography variant='h4' sx={{fontWeight: '900', mt: 4, mb: 2, textTransform:'uppercase', letterSpacing: '3px'}}>Your Gateway to Incredible Adventures</Typography>
            <Divider sx={{ width: '100px',  mt: 2, mb: 4, backgroundColor: 'orange', height: '3px' }} />
            <Typography>
              Unlock a world of unforgettable travel experiences! Browse through captivating travel packages designed to
              suit every wanderlust dream. From serene escapes to thrilling expeditions, manage and showcase your
              offerings effortlessly.
            </Typography>
          </Box>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
                  {travelPackageReduxData.map((travelPackage, index) => (
                    <Grid key={index} item xs={12} tablet={6} lg={4} desktopXs={3}>
                      <Card sx={{ cursor: 'pointer' }} onClick={() => setSelectedTravelPackage(travelPackage)}>
                        <CardMedia
                          sx={{ height: '11.25rem', position: 'relative' }}
                          image='/images/incredibles/incredible_3.jpg'
                        >
                          {travelPackage['mark_as_hot'] == 'TRUE' && (
                            <Box
                              sx={{
                                height: '33px',
                                borderRadius: '0px 7px 7px 0px',
                                width: '120px',
                                background: 'linear-gradient(rgba(255, 233, 200, 1), rgba(255, 191, 117, 1))',
                                position: 'absolute',
                                top: '10px'
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
                              <Box
                                sx={{
                                  mt: 1.5,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center'
                                }}
                              >
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
                                  {travelPackage['package_duration'].split('Nights')[0]}
                                </Typography>
                              </Box>
                            </CustomAvatar>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 1
                              }}
                            >
                              <Typography sx={{ fontWeight: 600 }}>{travelPackage['title']}</Typography>
                              <Typography variant='caption' sx={{ letterSpacing: '0.4px' }}>
                                {travelPackage['sub_title']}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider
                            sx={{
                              mb: theme => `${theme.spacing(4)} !important`,
                              mt: theme => `${theme.spacing(4.75)} !important`
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              width: '100%'
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                '& svg': { fontSize: '1.75rem' }
                              }}
                            >
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
                              <Typography sx={{ color: '#FB7601 !important' }}>{People}</Typography>
                              <Typography sx={{ fontSize: '0.75rem' }}>{travelPackage['no_of_person']}</Typography>
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
                            <Typography sx={{ color: '#FB7601 !important' }}>{Coins}</Typography>
                            {travelPackage['packages'].map((hotelPackage, idx) => (
                              <Typography key={idx} fontSize={18}>
                                ₹ {hotelPackage[`package_${idx + 1}_price_per_person`]}
                              </Typography>
                            ))}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              '& svg': { mr: 3, mt: 1 }
                            }}
                          >
                            <Typography sx={{ color: '#FB7601 !important' }}>{Track}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {travelPackage['tour_route'].slice(0, 4).map((route, k) => (
                                <Fragment key={k}>
                                  <Typography sx={{ fontSize: '0.875rem' }}>{route}</Typography>
                                  {k < travelPackage['tour_route'].slice(0, 4).length - 1 && (
                                    <Typography sx={{ mr: 1 }}>&#8674;</Typography>
                                  )}
                                </Fragment>
                              ))}
                              {travelPackage['tour_route'].slice(4).length > 0 && (
                                <>
                                  <Typography sx={{ mr: 1 }}>&#8674;</Typography>
                                  <Box
                                    sx={{
                                      backgroundColor: theme => `${theme.palette.primary.main} !important`,
                                      p: 2.5,
                                      borderRadius: '50%',
                                      height: '30px',
                                      pt: 1.5
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '0.75rem', color: 'white' }}>
                                      +{travelPackage['tour_route'].slice(4).length}
                                    </Typography>
                                  </Box>
                                </>
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
      ) : (
        <Preview selectedTravelPackage={selectedTravelPackage} onClose={() => setSelectedTravelPackage(false)} />
      )}
    </>
  )
}

export default Dashboard
