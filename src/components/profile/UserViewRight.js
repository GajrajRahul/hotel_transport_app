import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import Icon from 'src/@core/components/icon'

const UserViewRight = () => {
  const [isTitleDisabled, setIsTitleDisabled] = useState(true)

  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true)
  const [description, setDescription] = useState('')

  const [isTagLineDisabled, setIsTagLineDisabled] = useState(true)
  const [tagLine, setTagLine] = useState('')

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tagLine: ''
    }
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid component='form' container spacing={6} sx={{ alignItems: 'center' }}>
              <Grid item xs={12} sm={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Title:</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <FormControl fullWidth>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: 'Title is required' }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          fullWidth
                          disabled={isTitleDisabled}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          id='title-id'
                          error={Boolean(errors.title)}
                        />
                      )}
                    />
                    {errors.title && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>
                    )}
                  </FormControl>
                  <Icon
                    icon={`mdi:${isTitleDisabled ? 'pencil' : 'content-save'}`}
                    onClick={() => setIsTitleDisabled(prev => !prev)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <FormControl fullWidth>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: 'Title is required' }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          fullWidth
                          disabled={isDescriptionDisabled}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          multiline
                          rows={4}
                          id='description-id'
                          error={Boolean(errors.description)}
                        />
                      )}
                    />
                    {errors.description && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                    )}
                  </FormControl>
                  <Icon
                    icon={`mdi:${isDescriptionDisabled ? 'pencil' : 'content-save'}`}
                    onClick={() => setIsDescriptionDisabled(prev => !prev)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Tag Line:</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <FormControl fullWidth>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: 'Title is required' }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          fullWidth
                          disabled={isTagLineDisabled}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          multiline
                          rows={2}
                          id='tagLine-id'
                          error={Boolean(errors.tagLine)}
                        />
                      )}
                    />
                    {errors.tagLine && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.tagLine.message}</FormHelperText>
                    )}
                  </FormControl>
                  <Icon
                    icon={`mdi:${isTagLineDisabled ? 'pencil' : 'content-save'}`}
                    onClick={() => setIsTagLineDisabled(prev => !prev)}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewRight
