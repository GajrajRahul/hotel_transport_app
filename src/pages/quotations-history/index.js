import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import { DataGrid } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import Loader from 'src/components/common/Loader'
import { deleteRequest, getRequest } from 'src/api-main-file/APIServices'
import CommonDialog from 'src/components/common/dialog'
import { getDayNightCount } from 'src/utils/function'

const defaultColumns = [
  //   {
  //     flex: 0.1,
  //     field: 'id',
  //     minWidth: 80,
  //     headerName: '#',
  //     renderCell: ({ row }) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  //   },
  {
    flex: 0.25,
    field: 'quotationName',
    minWidth: 200,
    headerName: 'Quotation Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.quotationName ? `${row.quotationName.slice(0, 17)}${row.quotationName.length > 17 ? '...' : ''}` : ''}
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.travellerName}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'travelDate',
    minWidth: 200,
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
    flex: 0.15,
    field: 'destination',
    minWidth: 200,
    headerName: 'Destination',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.destination}
          </Typography> */}
          <Typography>-</Typography>
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
            {/* {console.log(row)} */}
            {row.persons}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'hotel',
    minWidth: 150,
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
    flex: 0.15,
    field: 'transport',
    minWidth: 150,
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const columns = useMemo(
    () => [
      ...defaultColumns,
      {
        flex: 0.1,
        minWidth: 130,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Tooltip title='Delete Invoice'>
              <IconButton size='small' onClick={() => dispatch(deleteInvoice(row.id))}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='View'>
              <IconButton size='small' component={Link} href={`/apps/invoice/preview/${row.id}`}>
                <Icon icon='mdi:eye-outline' fontSize={20} />
              </IconButton>
            </Tooltip> */}
            <OptionsMenu
              iconProps={{ fontSize: 20 }}
              iconButtonProps={{ size: 'small' }}
              menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
              options={[
                {
                  text: 'Print PDF',
                  icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      // fetchCampaignDetail(row.id)
                    }
                  }
                },
                {
                  text: 'Edit',
                  icon: <Icon icon='mdi:pencil-outline' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      // console.log(row)
                      // setSelectedQuotation(row)
                      fetchQuotation(row)
                      // fetchCampaignDetail(row.id)
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
              ]}
            />
          </Box>
        )
      }
    ],
    []
  )

  useEffect(() => {
    fetchQuotationList()
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
        response.data.map(data => {
          const { quotationName, travelInfo, citiesHotelsInfo, transportInfo, id } = data
          const adult = citiesHotelsInfo?.cities[0]?.hotelInfo[0]?.adult || 0
          const child = citiesHotelsInfo?.cities[0]?.hotelInfo[0].child || 0
          return {
            id,
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
            isTransport: transportInfo.vehicleType ? 'Yes' : 'No'
          }
        })
      )
    } else {
      toast.error(response.error)
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
            persons,
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
            persons: '0'
          }
        })
      }
    })
    localStorage.setItem('citiesHotels', JSON.stringify(citiesData))

    const { vehicleType, from, to, checkpoints } = transport
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
        departureReturnDate: [new Date(), new Date()]
      })
    )

    router.push('/quotations')
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Loader open={isLoading} />
      <DataGrid
        autoHeight
        //   pagination
        rows={quotationHistory}
        columns={columns}
        //   checkboxSelection
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
