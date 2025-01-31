import React, { Fragment, useCallback, useEffect, useState } from 'react'
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

const Dashboard = () => {
  const travelPackageReduxData = useSelector(state => state.travelPackageData)
  // console.log(travelPackageReduxData)
  const [travelPackageData, setTravelPackageData] = useState(travelPackageReduxData.travelPackage)
  const [selectedTravelPackage, setSelectedTravelPackage] = useState(null)
  const clientType = localStorage.getItem('clientType') ?? 'admin'

  const [states, setStates] = useState('')
  const [nights, setNights] = useState('')
  const [persons, setPersons] = useState('')
  const theme = useTheme()

  useEffect(() => {
    handleFilter()
  }, [states, nights, persons])

  useEffect(() => {
    setTravelPackageData(travelPackageReduxData.travelPackage)
  }, [travelPackageReduxData])

  const handleFilter = () => {
    setTravelPackageData(
      travelPackageReduxData.travelPackage
        .filter(travelPackage => travelPackage.state.includes(states))
        .filter(travelPackage => travelPackage['package_duration'].split('Nights')[0].includes(nights))
        .filter(travelPackage => travelPackage['no_of_person'].includes(persons))
    )
  }

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
            <Typography
              variant='h4'
              sx={{ fontWeight: '900', mt: 4, mb: 2, textTransform: 'uppercase', letterSpacing: '3px' }}
            >
              Your Gateway to Incredible Adventures
            </Typography>
            <Divider sx={{ width: '100px', mt: 2, mb: 4, backgroundColor: 'orange', height: '3px' }} />
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
                  <InputLabel id='states-select'>State</InputLabel>
                  <Select
                    fullWidth
                    value={states}
                    id='select-states'
                    label='State'
                    labelId='states-select'
                    onChange={e => setStates(e.target.value)}
                    inputProps={{ placeholder: 'State' }}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {travelPackageReduxData.states.map(state => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='nights-select'>No of Nights</InputLabel>
                  <Select
                    fullWidth
                    value={nights}
                    id='select-nights'
                    label='No of Nights'
                    labelId='nights-select'
                    onChange={e => setNights(e.target.value)}
                    inputProps={{ placeholder: 'No of Nights' }}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {travelPackageReduxData.nights.map(night => (
                      <MenuItem key={night} value={night}>
                        {night}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='persons-select'>No of Persons</InputLabel>
                  <Select
                    fullWidth
                    value={persons}
                    id='select-persons'
                    label='No of Persons'
                    labelId='persons-select'
                    onChange={e => setPersons(e.target.value)}
                    inputProps={{ placeholder: 'No of Persons' }}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {travelPackageReduxData.persons.map(person => (
                      <MenuItem key={person} value={person}>
                        {person}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  {travelPackageData.map((travelPackage, index) => (
                    <Grid key={index} item xs={12} tablet={6} lg={4} desktopXs={3}>
                      <Card sx={{ cursor: 'pointer' }} onClick={() => setSelectedTravelPackage(travelPackage)}>
                        {/* {console.log(travelPackage)} */}
                        <CardMedia
                          sx={{ height: '11.25rem', position: 'relative' }}
                          image={travelPackage.images_url || '/images/incredibles/incredible_3.jpg'}
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
                              // <Typography key={idx} fontSize={18}>
                              //   ₹{' '}
                              //   {clientType == 'partner'
                              //     ? Math.floor(Number(hotelPackage[`package_${idx + 1}_price_per_person`]) * 1.11)
                              //     : Number(hotelPackage[`package_${idx + 1}_price_per_person`])}
                              // </Typography>
                              <Typography key={idx} fontSize={18}>
                                ₹{' '}
                                {clientType === 'partner'
                                  ? Math.floor(Number(hotelPackage[`package_${idx + 1}_price_per_person`]) * 1.11)
                                  : clientType === 'employee'
                                  ? Math.floor(Number(hotelPackage[`package_${idx + 1}_price_per_person`]) * 1.3) 
                                  : Number(hotelPackage[`package_${idx + 1}_price_per_person`])}
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
