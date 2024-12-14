import { useState } from 'react'
import Link from 'next/link'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import Icon from 'src/@core/components/icon'
import Loader from 'src/components/common/Loader'
import { postRequest } from 'src/api-main-file/APIServices'

const PreviewActions = () => {
  const [isLoading, setIsLoading] = useState(false)

  const saveQuotation = async () => {
    const travelInfoData = localStorage.getItem('travel') ? JSON.parse(localStorage.getItem('travel')) : null
    const cities = localStorage.getItem('citiesHotels') ? JSON.parse(localStorage.getItem('citiesHotels')) : []
    const transportData = localStorage.getItem('transport') ? JSON.parse(localStorage.getItem('transport')) : null
    const clientType = ['admin', 'partner', 'employee'].includes(localStorage.getItem('clientType'))
      ? localStorage.getItem('clientType')
      : 'admin'

    // const dataToSend = {
    //   transportInfo: travelInfoData
    //     ? {
    //         userName: travelInfoData.name,
    //         journeyStartDate: new Date(travelInfoData.dates[0]),
    //         journeyEndDate: new Date(travelInfoData.dates[1])
    //       }
    //     : null,
    //     citiesHotelsInfo: cities.map((city) => {
    //       return {
    //         cityName: city.label,
    //         hotelInfo: {

    //         }
    //       }
    //     })
    // }

    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    // const api_url = `${BASE_URL}/${clientType}`
    // const response = await postRequest(`${api_url}/create-quotation`, {})
  }

  return (
    <Card>
      <Loader open={isLoading} />
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-file-add' />}
        >
          Create New Quotation
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-file-edit' />}
        >
          Edit Quote
        </Button>
        <Button
          fullWidth
          //   target='_blank'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-file-download' />}
          //   component={Link}
          variant='outlined'

          //   href={'/'}
        >
          Download Pdf
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          //   component={Link}
          variant='outlined'
          startIcon={<Icon icon='mdi:custom-send-quote' />}
          //   href={'/'}
        >
          Send Quote For Approval
        </Button>
        <Button
          fullWidth
          variant='outlined'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-cancel-quote' />}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          onClick={saveQuotation}
          variant='outlined'
          sx={{ mb: 3.5, textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-save-quote' />}
        >
          Save
        </Button>
        <Button
          fullWidth
          variant='outlined'
          sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
          startIcon={<Icon icon='mdi:custom-share-quote' />}
        >
          Share
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
