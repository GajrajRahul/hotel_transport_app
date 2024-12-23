import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import axios from 'axios'

import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

import { DataGrid } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomChip from 'src/@core/components/mui/chip'

import Loader from 'src/components/common/Loader'
import { deleteRequest, getRequest } from 'src/api-main-file/APIServices'
import CommonDialog from 'src/components/common/dialog'
import { getDayNightCount } from 'src/utils/function'
import { transformHotelData } from '../quotations'

const defaultColumns = [
  {
    flex: 0.1,
    field: 'travelDate',
    minWidth: 150,
    headerName: 'Travel Date',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.travelDate}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'destination',
    minWidth: 150,
    headerName: 'Destination',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CustomChip
            skin='light'
            size='small'
            label={row.destination[0]}
            color='success'
            sx={{ textTransform: 'capitalize' }}
          />
          {row.destination.length > 1 ? (
            <CustomChip
              skin='light'
              size='small'
              label={row.destination.length - 1}
              color='success'
              sx={{ textTransform: 'capitalize' }}
            />
          ) : (
            ''
          )}
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'persons',
    minWidth: 200,
    headerName: 'No. of Person',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.persons}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'hotel',
    minWidth: 130,
    headerName: 'Hotel',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.isHotel}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'transport',
    minWidth: 130,
    headerName: 'Transport',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.isTransport}
          </Typography>
        </Box>
      )
    }
  }
]

const QuotationsHistory = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [quotationHistory, setQuotationsHisotry] = useState([])
  const [statesList, setStatesList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const adminColumns = useMemo(
    () => [
      {
        flex: 0.1,
        field: 'id',
        minWidth: 80,
        headerName: 'Sr.No.',
        renderCell: ({ row }) => <Typography>{row.idx}</Typography>
      },
      {
        flex: 0.05,
        minWidth: 80,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OptionsMenu
              iconProps={{ fontSize: 20 }}
              iconButtonProps={{ size: 'small' }}
              menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
              options={[
                {
                  text: 'Edit',
                  icon: <Icon icon='mdi:pencil-outline' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      fetchQuotation(row)
                    }
                  }
                },
                {
                  text: 'Delete',
                  icon: <Icon icon='mdi:delete-outline' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      openDeleteDialog(row)
                    }
                  }
                }
                // {
                //   text: 'Download',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // }
                // {
                //   text: 'Share',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // },
                // {
                //   text: 'Send For Approval',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // }
              ]}
            />
          </Box>
        )
      },
      {
        flex: 0.2,
        field: 'itineraryName',
        minWidth: 150,
        headerName: 'Itnierary Name',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.quotationName
                  ? `${row.quotationName.slice(0, 17)}${row.quotationName.length > 17 ? '...' : ''}`
                  : ''}
              </Typography>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'userName',
        minWidth: 200,
        headerName: 'User Name',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.userName}
              </Typography>
              {row.companyName && row.companyName.length > 0 && (
                <Typography noWrap variant='caption'>
                  {row.companyName}
                </Typography>
              )}
            </Box>
          )
        }
      },
      {
        flex: 0.1,
        field: 'role',
        minWidth: 130,
        headerName: 'Role',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomChip
                skin='light'
                size='small'
                label={row.clientType}
                color='success'
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          )
        }
      },
      ...defaultColumns
    ],
    []
  )

  const otherColumns = useMemo(
    () => [
      {
        flex: 0.1,
        field: 'id',
        minWidth: 80,
        headerName: 'Sr.No.',
        renderCell: ({ row }) => <Typography>{row.idx}</Typography>
      },
      {
        flex: 0.05,
        minWidth: 80,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OptionsMenu
              iconProps={{ fontSize: 20 }}
              iconButtonProps={{ size: 'small' }}
              menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
              options={[
                {
                  text: 'Edit',
                  icon: <Icon icon='mdi:pencil-outline' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      fetchQuotation(row)
                    }
                  }
                },
                {
                  text: 'Delete',
                  icon: <Icon icon='mdi:delete-outline' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      openDeleteDialog(row)
                    }
                  }
                }
                // {
                //   text: 'Download',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // }
                // {
                //   text: 'Share',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // },
                // {
                //   text: 'Send For Approval',
                //   icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                //   menuItemProps: {
                //     onClick: e => {
                //       // fetchCampaignDetail(row.id)
                //     }
                //   }
                // }
              ]}
            />
          </Box>
        )
      },
      {
        flex: 0.25,
        field: 'quotationName',
        minWidth: 200,
        headerName: 'Quotation Name',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.quotationName
                  ? `${row.quotationName.slice(0, 17)}${row.quotationName.length > 17 ? '...' : ''}`
                  : ''}
              </Typography>
            </Box>
          )
        }
      },
      {
        flex: 0.25,
        field: 'travellerName',
        minWidth: 200,
        headerName: 'Traveller Name',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.travellerName
                  ? `${row.travellerName.slice(0, 17)}${row.travellerName.length > 17 ? '...' : ''}`
                  : ''}
              </Typography>
            </Box>
          )
        }
      },
      ...defaultColumns
    ],
    []
  )

  useEffect(() => {
    fetchQuotationList()
    fetchHotelData()
  }, [])

  const openDeleteDialog = row => {
    setSelectedQuotation(row)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedQuotation(null)
    setIsDeleteDialogOpen(false)
  }

  const deleteQuotation = async () => {
    setIsLoading(true)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const clientType = localStorage.getItem('clientType') || 'admin'
    const api_url = `${BASE_URL}/${clientType}`

    const response = await deleteRequest(`${api_url}/delete-quotation`, {
      id: selectedQuotation.id
    })
    setIsLoading(false)
    closeDeleteDialog()

    if (response.status) {
      fetchQuotationList()
      toast.success('Success')
    } else {
      toast.error(response.error)
    }
  }

  const fetchQuotationList = async () => {
    setIsLoading(true)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const clientType = localStorage.getItem('clientType') || 'admin'
    const api_url = `${BASE_URL}/${clientType}`

    const response = await getRequest(`${api_url}/fetch-quotations`)
    setIsLoading(false)

    if (response.status) {
      setQuotationsHisotry(
        response.data.map((data, idx) => {
          const { quotationName, travelInfo, citiesHotelsInfo, transportInfo, id, userName, companyName } = data
          const adult = citiesHotelsInfo?.cities[0]?.hotelInfo[0]?.adult || 0
          const child = citiesHotelsInfo?.cities[0]?.hotelInfo[0].child || 0
          return {
            id,
            idx: idx + 1,
            quotationName: quotationName && quotationName.length != 0 ? quotationName : '-',
            travel: travelInfo,
            citiesHotels: citiesHotelsInfo,
            transport: transportInfo,
            travellerName: travelInfo.userName,
            travelDate: format(new Date(travelInfo.journeyStartDate), 'dd MMM yyyy'),
            destination: citiesHotelsInfo?.cities.map(city => city.cityName),
            persons:
              Number(adult) == 0 && Number(child) == 0
                ? ''
                : Number(adult) != 0 && Number(child) != 0
                ? `${adult} Adults & ${child} Childs`
                : Number(adult) == 0
                ? `${child} Childs`
                : `${adult} Adults`,
            isHotel: citiesHotelsInfo?.cities[0]?.hotelInfo?.length > 0 ? 'Yes' : 'No',
            isTransport: transportInfo.vehicleType ? 'Yes' : 'No',
            clientType: data.adminId ? 'Admin' : data.employeeId ? 'Employee' : 'Partner',
            userName,
            companyName
          }
        })
      )
    } else {
      toast.error(response.error)
    }
  }

  const fetchHotelData = async () => {
    const HOTEL_SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const HOTEL_URL = `https://sheets.googleapis.com/v4/spreadsheets/${HOTEL_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    setIsLoading(true)
    try {
      const response = await axios.get(HOTEL_URL)
      setIsLoading(false)
      const finalData = transformHotelData(response.data.values)
      setStatesList(finalData.stateList)
    } catch (error) {
      setIsLoading(false)
      toast.error('Failded fetching quotation data')
    }
  }

  const fetchQuotation = data => {
    const { quotationName, travel, citiesHotels, transport, id } = data
    localStorage.setItem('quotationId', id)
    localStorage.setItem('quotationName', quotationName)
    const dayNightCount = getDayNightCount([travel.journeyStartDate, travel.journeyEndDate]) + 1
    localStorage.setItem(
      'travel',
      JSON.stringify({
        name: travel.userName,
        dates: [new Date(travel.journeyStartDate), new Date(travel.journeyEndDate)],
        ['days-nights']:
          travel.journeyEndDate == null
            ? '1 Day'
            : `${dayNightCount} ${dayNightCount < 2 ? 'Day' : 'Days'} & ${dayNightCount - 1} ${
                dayNightCount < 3 ? 'Night' : 'Nights'
              }`
      })
    )

    const cityLabels = citiesHotels.cities.map(item => item.cityName)
    const selectedStates = statesList
      .map(state => {
        const filteredCities = state.cities.filter(city => cityLabels.includes(city.name))
        return {
          ...state,
          cities: filteredCities
        }
      })
      .filter(state => state.cities.length > 0)

    localStorage.setItem('selectedStates', JSON.stringify(selectedStates))

    const citiesData = citiesHotels.cities.map(city => {
      const { id, cityName, hotelInfo } = city
      return {
        id,
        label: cityName,
        info: hotelInfo.map(hotel => {
          const {
            isBreakfast,
            isLunch,
            isDinner,
            rooms,
            adult,
            child,
            extraBed,
            roomType,
            checkIn,
            checkOut,
            hotelName,
            hotelType,
            price
          } = hotel
          const dayNight = getDayNightCount([checkIn, checkOut]) + 1
          return {
            id: hotel.id,
            checkInCheckOut: [checkIn, checkOut],
            breakfast: isBreakfast,
            lunch: isLunch,
            dinner: isDinner,
            rooms,
            child,
            daysNights:
              checkOut == null
                ? '1 Day'
                : `${dayNight} ${dayNight < 2 ? 'Day' : 'Days'} & ${dayNight - 1} ${dayNight < 3 ? 'Night' : 'Nights'}`,
            extraBed,
            hotel: {
              id: Date.now(),
              name: hotelName,
              location: cityName,
              image: 'singapore',
              price,
              selected: false,
              type: hotelType,
              'Base Catagory': roomType[0]
            },
            adult,
            persons:
              Number(adult) == 0 && Number(child) == 0
                ? ''
                : Number(adult) != 0 && Number(child) != 0
                ? `${adult} Adults & ${child} Childs`
                : Number(adult) == 0
                ? `${child} Childs`
                : `${adult} Adults`
          }
        })
      }
    })
    localStorage.setItem('citiesHotels', JSON.stringify(citiesData))

    const { vehicleType, from, to, checkpoints, transportStartDate, transportEndDate } = transport
    localStorage.setItem(
      'transport',
      JSON.stringify({
        vehicleType,
        from: { description: from },
        to: { description: to },
        additionalStops: checkpoints.map(checkpoint => {
          return {
            description: checkpoint
          }
        }),
        departureReturnDate: [new Date(transportStartDate), new Date(transportEndDate)]
      })
    )

    router.push('/quotations')
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Loader open={isLoading} />
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Button variant='contained' startIcon={<Icon icon='mdi:plus' />}>
            Create Itinerary
          </Button>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size='small'
              // value={value}
              sx={{ mr: 4, mb: 2 }}
              placeholder='Search Quote'
              // onChange={e => handleFilter(e.target.value)}
            />
            <FormControl>
              <InputLabel size='small'>Role</InputLabel>
              <Select
                size='small'
                value=''
                sx={{ mr: 4, mb: 2 }}
                label='Role'
                // disabled={selectedRows && selectedRows.length === 0}
                // renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Admin'>Admin</MenuItem>
                <MenuItem value='Partner'>Partner</MenuItem>
                <MenuItem value='Employee'>Employee</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel size='small'>Status</InputLabel>
              <Select
                size='small'
                value=''
                sx={{ mr: 4, mb: 2 }}
                label='Status'
                // disabled={selectedRows && selectedRows.length === 0}
                // renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Approved'>Approved</MenuItem>
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Rejected'>Rejected</MenuItem>
                <MenuItem value='Draft'>Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        //   pagination
        rows={quotationHistory}
        columns={
          localStorage.getItem('clientType')
            ? localStorage.getItem('clientType') == 'admin'
              ? adminColumns
              : otherColumns
            : otherColumns
        }
        checkboxSelection
        disableRowSelectionOnClick
        //   pageSizeOptions={[10, 25, 50]}
        //   paginationModel={paginationModel}
        //   onPaginationModelChange={setPaginationModel}
        //   onRowSelectionModelChange={rows => setSelectedRows(rows)}
      />
      <CommonDialog
        open={isDeleteDialogOpen}
        onCancel={closeDeleteDialog}
        onSuccess={deleteQuotation}
        description={'Are you sure you want to delete this quotation?'}
      />
    </Card>
  )
}

export default QuotationsHistory
