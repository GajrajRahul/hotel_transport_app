import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

import { DataGrid } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import Loader from 'src/components/common/Loader'
import { getRequest, putRequest } from 'src/api-main-file/APIServices'
import UserDetail from 'src/components/user-management/UserDetail'
import { replaceUserData } from 'src/store/UserDataSlice'

const defaultColumns = [
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
    field: 'userName',
    minWidth: 200,
    headerName: 'User Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.name ? `${row.name.slice(0, 17)}${row.name.length > 17 ? '...' : ''}` : ''}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    field: 'companyName',
    minWidth: 200,
    headerName: 'Company Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.companyName ? `${row.companyName.slice(0, 17)}${row.companyName.length > 17 ? '...' : ''}` : ''}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'role',
    minWidth: 150,
    headerName: 'Role',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CustomChip skin='light' size='small' label={row.role} color='success' sx={{ textTransform: 'capitalize' }} />
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    field: 'mobile',
    minWidth: 200,
    headerName: 'Mobile',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.mobile ? `${row.mobile.slice(0, 17)}${row.mobile.length > 17 ? '...' : ''}` : ''}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    field: 'email',
    minWidth: 200,
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.email ? `${row.email.slice(0, 17)}${row.email.length > 17 ? '...' : ''}` : ''}
          </Typography>
        </Box>
      )
    }
  }
]

const UserManagement = () => {
  const clientType = localStorage.getItem('clientType') || 'admin'
  const usersData = useSelector(state => state.usersData)

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [usersList, setUsersList] = useState([])
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const router = useRouter()
  const dispatch = useDispatch()

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
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => handleOpenUserDetail(row)}>
                <Icon icon='mdi:pencil' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
      ...defaultColumns
    ],
    []
  )

  useEffect(() => {
    if (clientType != 'admin') {
      router.push('/')
    } else {
      fetchUsersList()
    }
  }, [])

  useEffect(() => {
    handleFilter()
  }, [role, status])

  const fetchUsersList = async () => {
    setIsLoading(true)
    const response = await getRequest(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/fetch-users`)
    // const response = await getRequest(`http://localhost:4000/api/admin/fetch-users`)
    setIsLoading(false)

    if (response.status) {
      let responseData = response.data.map((user, idx) => {
        return { idx: idx + 1, ...user }
      })
      dispatch(replaceUserData(responseData))
      const filter = router.query.filter
      if (filter) {
        const { email } = JSON.parse(filter)
        responseData = responseData.filter(user => user.email == email).map((user, idx) => ({ ...user, idx: idx + 1 }))
      }
      setUsersList(responseData)
    } else {
      toast.error(response.error)
    }
    router.replace('/user-management', undefined, { shallow: true })
  }

  const handleCopyLink = userType => {
    navigator.clipboard
      .writeText(`https://crm.adventurerichaholidays.com/register/${userType}`)
      .then(() => {
        toast.success('Copied to clipboard')
      })
      .catch(err => {
        toast.error('Unable to copy text to clipboard')
      })
  }

  const handleFilter = () => {
    const updatedUserData = usersData
      .filter(user => user.role.includes(role))
      .filter(user => user.status.includes(status))
    setUsersList(updatedUserData)
  }

  const handleOpenUserDetail = user => {
    setSelectedUser(user)
    setIsUserDialogOpen(true)
  }

  const handleCloseUserDetail = () => {
    setIsUserDialogOpen(false)
    setSelectedUser(null)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Loader open={isLoading} />
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              sx={{ mb: 2, mr: 4 }}
              variant='outlined'
              startIcon={<Icon icon='mdi:content-copy' />}
              onClick={() => handleCopyLink('employee')}
            >
              Sign-up Url For Employee
            </Button>
            <Button
              sx={{ mb: 2 }}
              variant='outlined'
              startIcon={<Icon icon='mdi:content-copy' />}
              onClick={() => handleCopyLink('partner')}
            >
              Sign-up Url For Partner
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
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
                <MenuItem value='Partner'>Partner</MenuItem>
                <MenuItem value='Employee'>Employee</MenuItem>
              </Select>
            </FormControl>
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
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='approved'>Approved</MenuItem>
                <MenuItem value='blocked'>Blocked</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        //   pagination
        rows={usersList}
        columns={otherColumns}
        checkboxSelection
        disableRowSelectionOnClick
        //   pageSizeOptions={[10, 25, 50]}
        //   paginationModel={paginationModel}
        //   onPaginationModelChange={setPaginationModel}
        //   onRowSelectionModelChange={rows => setSelectedRows(rows)}
      />
      <UserDetail
        show={isUserDialogOpen}
        onClose={handleCloseUserDetail}
        selectedUserDetail={selectedUser}
        fetchUsersList={fetchUsersList}
      />
    </Card>
  )
}

export default UserManagement
