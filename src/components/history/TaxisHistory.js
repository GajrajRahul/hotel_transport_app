import React, { Fragment, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

import { DataGrid } from '@mui/x-data-grid'
import { getRequest } from 'src/api-main-file/APIServices'

import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomChip from 'src/@core/components/mui/chip'
import Loader from '../common/Loader'

const defaultColumns = [
  {
    flex: 0.1,
    field: 'tripDate',
    minWidth: 150,
    headerName: 'Trip Date',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.tripDate ? format(new Date(row.tripDate), 'dd MMM yyyy') : '-'}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'days',
    minWidth: 150,
    headerName: 'No of Days',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.tripDays}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'vehicleType',
    minWidth: 150,
    headerName: 'Vehicle Type',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.vehicleType}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    field: 'pickup',
    minWidth: 250,
    headerName: 'Pick up',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.pickup.place}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    field: 'drop',
    minWidth: 250,
    headerName: 'Drop',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.drop.place}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'stops',
    minWidth: 180,
    headerName: 'Add Stops',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.route.length > 2 ? (
            <>
              <CustomChip
                skin='light'
                size='small'
                label={row.route[1].city}
                color='success'
                sx={{ textTransform: 'capitalize' }}
              />
              {row.route.length > 3 ? (
                <CustomChip
                  skin='light'
                  size='small'
                  label={`+${row.route.length - 3}`}
                  color='success'
                  sx={{ textTransform: 'capitalize' }}
                />
              ) : (
                ''
              )}
            </>
          ) : (
            <>-</>
          )}
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
                }
              ]}
            />
          </Box>
        )
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
                label={row.role}
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

  const partnerColumns = useMemo(
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
                  text: 'Share',
                  icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />,
                  menuItemProps: {
                    onClick: e => {
                      // fetchCampaignDetail(row.id)
                    }
                  }
                }
              ]}
            />
          </Box>
        )
      },
      ...defaultColumns
    ],
    []
  )

  useEffect(() => {
    fetchTaxiList()
  }, [])

  const fetchTaxiList = async () => {
    setIsLoading(true)
    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const BASE_URL = 'http://localhost:4000/api'
    const api_url = `${BASE_URL}/${clientType}`

    const response = await getRequest(`${api_url}/fetch-taxis`)
    setIsLoading(false)

    if (response.status) {
      setTaxiHisotry(
        response.data.map((data, idx) => {
          return {
            ...data,
            idx: idx + 1
          }
        })
      )
      setApiTaxiHistoryList(
        response.data.map((data, idx) => {
          return {
            ...data,
            idx: idx + 1
          }
        })
      )
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Loader open={isLoading} />
      <CardContent></CardContent>
      <DataGrid
        autoHeight
        //   pagination
        rows={taxiHistory}
        columns={clientType == 'admin' ? adminColumns : partnerColumns}
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
