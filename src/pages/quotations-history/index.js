import React, { useMemo } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import OptionsMenu from '@mui/material/OptionsMenu'

import { DataGrid } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'

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
    field: 'name',
    minWidth: 300,
    headerName: 'Quotation Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.quotationName}
          </Typography>
        </Box>
      )
    }
  }
]

const QuotationsHistory = () => {
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
                  icon: <Icon icon='mdi:file-pdf-box' fontSize={20} />
                },
                {
                  text: 'Edit',
                  href: `/apps/invoice/edit/${row.id}`,
                  icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
                },
                {
                  text: 'Delete',
                  icon: <Icon icon='mdi:delete-outline' fontSize={20} />
                }
              ]}
            />
          </Box>
        )
      }
    ],
    []
  )

  return (
    <Card>
      <DataGrid
        autoHeight
        //   pagination
        rows={[]}
        columns={columns}
        //   checkboxSelection
        disableRowSelectionOnClick
        //   pageSizeOptions={[10, 25, 50]}
        //   paginationModel={paginationModel}
        //   onPaginationModelChange={setPaginationModel}
        //   onRowSelectionModelChange={rows => setSelectedRows(rows)}
      />
    </Card>
  )
}

export default QuotationsHistory
