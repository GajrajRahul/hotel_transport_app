import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

import { DataGrid } from '@mui/x-data-grid'
import { getRequest } from 'src/api-main-file/APIServices'

import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomChip from 'src/@core/components/mui/chip'

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'Sr.No.',
    renderCell: ({ row }) => <Typography>{row.idx}</Typography>
  },
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

const TaxisHistory = () => {
  const clientType = localStorage.getItem('clientType') || 'admin'
  const [apiTaxiHistoryList, setApiTaxiHistoryList] = useState([])
  const [taxiHistory, setTaxiHisotry] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // fetchTaxiList()
  }, [])

  const fetchTaxiList = async () => {
    console.log("loading")
    setIsLoading(true)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const api_url = `${BASE_URL}/${clientType}`

    const response = await getRequest(`${api_url}/fetch-taxis`)
    setIsLoading(false)

    if (response.status) {
      setTaxiHisotry(response.data)
      setApiTaxiHistoryList(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent></CardContent>
      <DataGrid
        autoHeight
        //   pagination
        rows={taxiHistory}
        columns={defaultColumns}
        checkboxSelection
        disableRowSelectionOnClick
        //   pageSizeOptions={[10, 25, 50]}
        //   paginationModel={paginationModel}
        //   onPaginationModelChange={setPaginationModel}
        //   onRowSelectionModelChange={rows => setSelectedRows(rows)}
      />
    </Card>
  )
}

export default TaxisHistory
