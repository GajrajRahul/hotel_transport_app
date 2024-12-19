import React, { useState } from 'react'

import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import Icon from 'src/@core/components/icon'

const UserViewRight = () => {
  const [isTitleDisabled, setIsTitleDisabled] = useState(true)
  const [title, setTitle] = useState('')

  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true)
  const [description, setDescription] = useState('')

  const [isTagLineDisabled, setIsTagLineDisabled] = useState(true)
  const [tagLine, setTagLine] = useState('')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Title:</Typography>
              <TextField disabled={isTitleDisabled} value={title} onChange={e => setTitle(e.target.value)} />
              <Icon
                fontSize='small'
                icon={`mdi:${isTitleDisabled ? 'pencil' : 'content-save'}`}
                onClick={() => setIsTitleDisabled(prev => !prev)}
              />
            </Box>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  disabled={isDescriptionDisabled}
                  value={description}
                  multiline
                  rows={4}
                  onChange={e => setDescription(e.target.value)}
                />
                <Icon
                  fontSize='small'
                  icon={`mdi:${isDescriptionDisabled ? 'pencil' : 'content-save'}`}
                  onClick={() => setIsDescriptionDisabled(prev => !prev)}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tag Line:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  multiline
                  rows={2}
                  disabled={isTagLineDisabled}
                  value={tagLine}
                  onChange={e => setTagLine(e.target.value)}
                />
                <Icon
                  fontSize='small'
                  icon={`mdi:${isTagLineDisabled ? 'pencil' : 'content-save'}`}
                  onClick={() => setIsTagLineDisabled(prev => !prev)}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewRight
