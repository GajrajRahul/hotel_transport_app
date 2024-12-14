import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

import PreviewCard from 'src/components/quotation/preview/PreviewCard'
import PreviewActions from 'src/components/quotation/preview/PreviewActions'

const QutationPreview = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  return (
    <Grid container spacing={6} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
      <Grid>
        <PreviewCard data={data} />
      </Grid>
      <Grid sx={{ '&.MuiGrid-item': { pt: 0 } }} item xl={3} md={4} xs={12}>
        <PreviewActions />
      </Grid>
    </Grid>
  )
}

export default QutationPreview
