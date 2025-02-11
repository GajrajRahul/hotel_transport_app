import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import axios from 'axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'

import { DataGrid } from '@mui/x-data-grid'

import { styled } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'
import Loader from 'src/views/common/Loader'

const defaultColumns = [
  {
    flex: 0.15,
    field: 'name',
    minWidth: 200,
    headerName: 'Monument Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'auto' }}>
          <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'normal', overflow: 'auto' }}>
            {row.names ? row.names.join(', ') : '-'}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'price',
    minWidth: 130,
    headerName: 'Price',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.price}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'days',
    minWidth: 200,
    headerName: 'Days Needed',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.days}
          </Typography>
        </Box>
      )
    }
  }
]

const TOTAL_DAYS = 2

const MonumentsDialog = ({
  open,
  onClose,
  selectedCitiesHotels,
  setSelectedCitiesHotels,
  selectedCity,
  isEdit,
  selectedMonumentsData
}) => {
  const hotelInfoReduxData = useSelector(state => state.hotelInfo)
  const hotelSheetData = useSelector(state => state.hotelRateData)
  // console.log('selectedCity: ', selectedCity)

  const [selectedRows, setSelectedRows] = useState([])
  const [remainingDays, setRemainingDays] = useState(0)
  const [monumentsData, setMonumentsData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const {
    reset,
    watch,
    setValue,
    setError,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      monuments: []
    }
  })

  useEffect(() => {
    if (selectedCity && open) {
      fetchMonumentsData()
    }
  }, [selectedCity])

  // const handleSelectionModelChange = selectionModel => {
  //   if(selectedRows.length < selectionModel.length) {
  //     // console.log('selectionModel: ', selectionModel)
  //     const selectedRowsData = selectionModel.map(id => monumentsData.find(row => row.id === id))
  //     // console.log('selectedRowsData: ', selectedRowsData)
  //     setSelectedRows(selectionModel)

  //     // Calculate remaining days
  //     const totalSelectedDays = selectedRowsData.reduce((sum, row) => sum + Number(row.days), 0)
  //     // console.log(totalSelectedDays)
  //     setRemainingDays(prev => prev - totalSelectedDays) // Assuming initial remaining days is 1
  //   }
  //   else {
  //     console.log("selectedRows: ", selectedRows)
  //     console.log("selectionModel: ", selectionModel)
  //     const removedSelectedRowIdx = selectedRows.map(id => selectionModel.find(idx => idx == id))
  //     console.log(removedSelectedRowIdx);
  //     // const selectedRowsData = selectionModel.map(id => monumentsData.find(row => row.id === id))
  //   }
  // }

  const handleRowSelectionModelChange = selectionModel => {
    // Find the newly selected and deselected rows
    const addedRows = selectionModel.filter(id => !selectedRows.includes(id))
    const removedRows = selectedRows.filter(id => !selectionModel.includes(id))

    // Calculate the change in remaining days
    let changeInDays = 0

    // Subtract days for newly selected rows
    addedRows.forEach(id => {
      const row = monumentsData.find(row => row.id === id)
      changeInDays -= Number(row.days)
    })

    // Add days for deselected rows
    removedRows.forEach(id => {
      const row = monumentsData.find(row => row.id === id)
      changeInDays += Number(row.days)
    })

    // Update the remaining days
    setRemainingDays(prevRemainingDays => prevRemainingDays + changeInDays)

    // Update the selected rows
    setSelectedRows(selectionModel)
  }

  const isRowSelectable = params => {
    return selectedRows.includes(params.row.id) || params.row.days <= remainingDays
  }

  const fetchMonumentsData = async () => {
    setIsLoading(true)
    const MONUMENTS_SHEET_ID = process.env.NEXT_PUBLIC_MONUMENTS_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const MONUMENTS_URL = `https://sheets.googleapis.com/v4/spreadsheets/1TyoSzVylI52W-XpxhrUyeCdQOYmPjx1Yyffcper88OQ/values/Sheet1?key=AIzaSyCCh7yOjE7-0p_3-8yIIfzSIzuE5H3cb74`

    try {
      const response = await axios.get(MONUMENTS_URL)
      //   console.log(response.data.values)
      const monuments = transformMonumentsData(response.data.values)
      // console.log(monuments)
      const monumentsInfo = monuments.filter(monument => monument.city == selectedCity.label.toLowerCase())
      // console.log(monumentsInfo)
      // console.log('selectedCity: ', selectedCity)
      const totalSelectedDays = selectedCity.info.reduce(
        (sum, hotel) => sum + Number(hotel.daysNights.split('& ')[1].split(' ')[0]),
        0
      )
      // console.log('totalSelectedDays: ', totalSelectedDays)
      setRemainingDays(totalSelectedDays)
      setMonumentsData(monumentsInfo)
      setSelectedRows(selectedMonumentsData.map(monument => monument.id))
    } catch (error) {
      toast.error('Failed fetching monuments data')
      console.error('Error fetching data:', error)
      // return []
    }
    setIsLoading(false)
  }

  const transformMonumentsData = data => {
    const headers = data[0]
    const result = []

    data.slice(1).forEach((row, idx) => {
      if (row.length > 0) {
        const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))

        const cityKey = `${
          rowData.city
            ? rowData.city
                .split(' ')
                .map(c => c.toLowerCase())
                .join('_')
            : rowData.city
        }`

        const monuments = rowData.monument_names ? `${rowData.monument_names}` : ''
        const inclusion = rowData.inclusion ? `${rowData.inclusion}` : ''
        const exclusion = rowData.exclusion ? `${rowData.exclusion}` : ''
        const know_before_you_go = rowData.know_before_you_go ? `${rowData.know_before_you_go}` : ''
        const price = rowData.price_in_rs ? `${rowData.price_in_rs}` : ''
        const days = rowData.trip_duration_in_days ? `${rowData.trip_duration_in_days}` : ''

        result.push({
          id: idx,
          price,
          days,
          names: monuments.length > 0 ? monuments.split('|').map(monument => monument.trim()) : [],
          inclusion: inclusion || '',
          exclusion: exclusion || '',
          city: cityKey,
          know_before_you_go: know_before_you_go || ''
        })
      }
    })

    // console.log('result: ', result)
    return result
  }

  const onSubmit = () => {
    // console.log(monumentsData)
    // console.log('selectedRows: ', selectedRows)
    const finalMonumemtsData = monumentsData.filter(monument => selectedRows.includes(monument.id))
    // console.log('finalMonumemtsData: ', finalMonumemtsData)

    const updatedMonuments = selectedCitiesHotels.map(city =>
      city.label == selectedCity.label
        ? {
            ...city,
            monuments: finalMonumemtsData
          }
        : city
    )

    setSelectedCitiesHotels(updatedMonuments)
    resetValues()
    return
  }

  const resetValues = () => {
    setSelectedRows([])
    setRemainingDays(0)
    setMonumentsData([])
    onClose()
  }

  return (
    <>
      <Loader open={isLoading} />
      <Dialog fullWidth maxWidth='lg' open={open} onClose={resetValues}>
        <DialogTitle
          sx={{
            '&.MuiDialogTitle-root': {
              pb: 3
            }
          }}
          textAlign='center'
        >
          Select Monuments
        </DialogTitle>
        <DialogContent>
          <Box sx={{height: '300px', overflow: 'auto'}}>
            <DataGrid
              autoHeight
              rows={monumentsData}
              columns={defaultColumns}
              getRowHeight={() => 'auto'}
              checkboxSelection
              onRowSelectionModelChange={handleRowSelectionModelChange}
              isRowSelectable={isRowSelectable}
              rowSelectionModel={selectedRows}
              sx={{
                '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                  display: 'none'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={resetValues}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MonumentsDialog
