import React, { useEffect, useMemo, useState } from 'react'

import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

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
import { deleteRequest, getRequest, putRequest } from 'src/api-main-file/APIServices'
import CommonDialog from 'src/components/common/dialog'
import { generateHotelData, getDayNightCount } from 'src/utils/function'
import ShareQuotation from '../quotation/dialog/ShareQuotation'

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
  },
  {
    flex: 0.1,
    field: 'view',
    minWidth: 130,
    headerName: 'View',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {row.view}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    field: 'download',
    minWidth: 130,
    headerName: 'Download',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {row.download}
        </Typography>
      )
    }
  }
]

const QuotationsHistory = () => {
  const clientType = localStorage.getItem('clientType') || 'admin'
  const quotationHistoryReduxData = useSelector(state => state.quotationHistoryData)

  const [pdfUrl, setPdfUrl] = useState('')
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [apiQuotationHistoryList, setApiQuotationHistoryList] = useState([])
  const [quotationHistory, setQuotationsHisotry] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [statesList, setStatesList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const router = useRouter()
  const dispatch = useDispatch()

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
            {/* {console.log(row)} */}
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
                      fetchQuotation(row, '/quotations')
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
                },
                {
                  text: 'Download',
                  icon: <Icon icon='mdi:custom-file-download' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      downloadPdf(row)
                      // fetchCampaignDetail(row.id)
                    }
                  }
                },
                {
                  text: 'Share',
                  icon: <Icon icon='mdi:custom-share-quote' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      handleOpenShareDialog(row.pdfUrl)
                      // fetchCampaignDetail(row.id)
                    }
                  }
                },
                row.clientType != 'Admin'
                  ? {
                      text: 'Edit Status',
                      icon: <Icon icon='mdi:pencil' fontSize={20} />,
                      menuItemProps: {
                        onClick: e => {
                          fetchQuotation(row, '/quotations/preview')
                          // fetchCampaignDetail(row.id)
                        }
                      }
                    }
                  : {}
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
        minWidth: 200,
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
        flex: 0.1,
        field: 'status',
        minWidth: 130,
        headerName: 'Status',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomChip
                skin='light'
                size='small'
                label={row.status}
                color='success'
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        field: 'userName',
        minWidth: 150,
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
                      fetchQuotation(row, '/quotations')
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
                },
                {
                  text: 'Download',
                  icon: <Icon icon='mdi:custom-file-download' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      downloadPdf(row)
                      // fetchCampaignDetail(row.id)
                    }
                  }
                },
                {
                  text: 'Share',
                  icon: <Icon icon='mdi:custom-share-quote' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      handleOpenShareDialog(row.pdfUrl)
                      // fetchCampaignDetail(row.id)
                    }
                  }
                },
                row.status != 'pending'
                  ? {
                      text: 'Send For Approval',
                      icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                      menuItemProps: {
                        onClick: e => {
                          updateQuotation(row)
                          // fetchCampaignDetail(row.id)
                        }
                      }
                    }
                  : {}
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
        flex: 0.1,
        field: 'status',
        minWidth: 130,
        headerName: 'Status',
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomChip
                skin='light'
                size='small'
                label={row.status}
                color='success'
                sx={{ textTransform: 'capitalize' }}
              />
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
  }, [])

  useEffect(() => {
    handleFilter()
  }, [role, status])

  const handleCloseShareDialog = () => {
    setIsShareDialogOpen(false)
    setPdfUrl('')
  }

  const handleOpenShareDialog = url => {
    setPdfUrl(url)
    setIsShareDialogOpen(true)
  }

  const handleSearchQuotation = newValue => {
    setSearchValue(newValue)
    if (newValue.length == 0) {
      setQuotationsHisotry(apiQuotationHistoryList)
    } else {
      const filteredData = quotationHistory.filter(data =>
        data.quotationName.toLowerCase().includes(newValue.toLowerCase())
      )
      setQuotationsHisotry(filteredData)
    }
  }

  const handleFilter = () => {
    // console.log(apiQuotationHistoryList)
    const filteredData = apiQuotationHistoryList
      .filter(quote => quote.clientType.includes(role))
      .filter(quote => quote.status.includes(status))
    // console.log(filteredData)
    setQuotationsHisotry(filteredData)
  }

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
    // const BASE_URL = 'http://localhost:4000/api'
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
    // const BASE_URL = 'http://localhost:4000/api'
    const api_url = `${BASE_URL}/${clientType}`

    const response = await getRequest(`${api_url}/fetch-quotations`)
    setIsLoading(false)

    if (response.status) {
      // console.log(response.data)
      let responseData = response.data.map((data, idx) => {
        const {
          citiesHotelsInfo,
          transportInfo,
          quotationName,
          companyName,
          travelInfo,
          userName,
          download,
          userId,
          pdfUrl,
          status,
          view,
          comment,
          id
        } = data
        // console.log(citiesHotelsInfo)

        const hotel = citiesHotelsInfo?.cities[0]?.hotelInfo[0]
        const persons = hotel?.adult + hotel?.child + hotel?.infant || 0

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
          isHotel: citiesHotelsInfo?.cities[0]?.hotelInfo?.length > 0 ? 'Yes' : 'No',
          isTransport: transportInfo.vehicleType ? 'Yes' : 'No',
          clientType: userId.includes('admin') ? 'Admin' : userId.includes('employee') ? 'Employee' : 'Partner',
          persons,
          userName,
          companyName,
          pdfUrl,
          status,
          createdQuoteClientId: userId,
          view,
          download,
          comment
        }
      })
      const filter = router.query.filter
      if (filter) {
        const { quotationId } = JSON.parse(filter)
        responseData = responseData
          .filter(quotation => quotation.id == quotationId)
          .map((quotation, idx) => ({ ...quotation, idx: idx + 1 }))
      }
      router.replace('/quotations-history', undefined, { shallow: true })
      setQuotationsHisotry(responseData)
      setApiQuotationHistoryList(responseData)
    } else {
      toast.error(response.error)
    }
  }

  const updateQuotation = async data => {
    const { quotationName, travel, citiesHotels, transport, id, pdfUrl, status, createdQuoteClientId } = data

    const { vehicleType, from, to, checkpoints, transportStartDate, transportEndDate } = transport

    let dataToSend = {
      quotationName,
      willGenerateNewPdf: false,
      travelInfo: {
        userName: travel.userName,
        journeyStartDate: new Date(travel.journeyStartDate),
        journeyEndDate: new Date(travel.journeyEndDate)
      },
      citiesHotelsInfo: {
        cities: citiesHotels.cities.map(city => {
          const { id, cityName, hotelInfo } = city
          return {
            id: id,
            cityName,
            hotelInfo: hotelInfo.map(hotelDetails => generateHotelData(hotelDetails))
          }
        })
      },
      transportInfo: {
        vehicleType,
        from,
        to,
        checkpoints,
        transportStartDate: new Date(transportStartDate),
        transportEndDate: new Date(transportEndDate)
      },
      ...data,
      status: 'pending'
    }

    const createdClientType = createdQuoteClientId.split('_')[0]

    if (createdClientType == 'employee' || createdClientType == 'partner') {
      dataToSend = { ...dataToSend, userId: createdQuoteClientId }
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    // const BASE_URL = 'http://localhost:4000/api'
    const api_url = `${BASE_URL}/${createdClientType}`
    setIsLoading(true)
    let response = await putRequest(
      `${api_url}/update-quotation`,
      { id, ...dataToSend },
      {
        [`${createdClientType}id`]: createdQuoteClientId
      }
    )
    setIsLoading(false)

    if (response.status) {
      toast.success(typeof response.data == 'object' ? 'Success' : response.data)
      fetchQuotationList()
      // resetLocalStorage()
      // router.push('/')
    } else {
      toast.error(response.error)
    }
  }

  const fetchQuotation = (data, routeUrl) => {
    const { quotationName, travel, citiesHotels, transport, id, pdfUrl, status, createdQuoteClientId, comment } = data

    localStorage.setItem('quotationStatus', status)
    localStorage.setItem('createdQuoteClientId', createdQuoteClientId)
    localStorage.setItem('pdfUrl', pdfUrl)
    localStorage.setItem('quotationId', id)
    localStorage.setItem('quotationName', quotationName)
    localStorage.setItem('comment', comment)
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
          const { meals, rooms, adult, child, infant, extraBed, checkIn, checkOut, roomsPrice, name, type, id, image } =
            hotel
          // console.log('rooms: ', rooms)

          const dayNight = getDayNightCount([checkIn, checkOut]) + 1
          return {
            id,
            name,
            type,
            image,
            rooms: rooms.map(room => ({ ...room, type: room.name })),
            roomsPrice,
            meals,
            checkInCheckOut: [checkIn, checkOut],
            daysNights:
              checkOut == null
                ? '1 Day'
                : `${dayNight} ${dayNight < 2 ? 'Day' : 'Days'} & ${dayNight - 1} ${dayNight < 3 ? 'Night' : 'Nights'}`,
            adult,
            child,
            infant,
            extraBed
          }
        })
      }
    })
    localStorage.setItem('citiesHotels', JSON.stringify(citiesData))

    const { vehicleType, from, to, checkpoints, transportStartDate, transportEndDate, isLocal } = transport
    localStorage.setItem(
      'transport',
      JSON.stringify({
        vehicleType,
        from,
        isLocal,
        to,
        additionalStops: checkpoints,
        departureReturnDate: [new Date(transportStartDate), new Date(transportEndDate)]
      })
    )

    router.push(routeUrl)
  }

  const resetLocalStorage = () => {
    localStorage.removeItem('selectedStates')
    localStorage.removeItem('citiesHotels')
    localStorage.removeItem('quotationId')
    localStorage.removeItem('quotationName')
    localStorage.removeItem('transport')
    localStorage.removeItem('travel')
    localStorage.removeItem('pdfUrl')
    router.push('/quotations')
  }

  const downloadPdf = row => {
    const { quotationName, pdfUrl } = row
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${quotationName}.pdf` // The file name for the downloaded file
    link.target = '_blank' // Ensures it's downloaded, not opened in a new tab
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Loader open={isLoading} />
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Button sx={{ mb: 2 }} variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={resetLocalStorage}>
            Create Itinerary
          </Button>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* <TextField
              size='small'
              value={searchValue}
              sx={{ mr: 4, mb: 2 }}
              placeholder='Search Quote'
              onChange={e => handleSearchQuotation(e.target.value)}
            /> */}
            {clientType == 'admin' && (
              <FormControl>
                <InputLabel size='small'>Role</InputLabel>
                <Select
                  size='small'
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  sx={{ mr: 4, mb: 2 }}
                  label='Role'
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='Admin'>Admin</MenuItem>
                  <MenuItem value='Partner'>Partner</MenuItem>
                  <MenuItem value='Employee'>Employee</MenuItem>
                </Select>
              </FormControl>
            )}
            <FormControl>
              <InputLabel size='small'>Status</InputLabel>
              <Select
                size='small'
                value={status}
                onChange={e => setStatus(e.target.value)}
                sx={{ mr: 4, mb: 2 }}
                label='Status'
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='approved'>Approved</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='rejected'>Rejected</MenuItem>
                <MenuItem value='draft'>Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        //   pagination
        rows={quotationHistory}
        columns={clientType == 'admin' ? adminColumns : otherColumns}
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
      {pdfUrl.length > 0 && (
        <ShareQuotation pdfUrl={pdfUrl} open={isShareDialogOpen} handleClose={handleCloseShareDialog} />
      )}
    </Card>
  )
}

export default QuotationsHistory
