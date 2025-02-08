import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import DialogContentText from '@mui/material/DialogContentText'
import FormHelperText from '@mui/material/FormHelperText'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import Autocomplete from '@mui/material/Autocomplete'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { styled, useTheme } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'
import { UploadLogo } from 'src/utils/icons'
import { createFilterOptions } from '@mui/material'
import { postRequest } from 'src/api-main-file/APIServices'
import toast from 'react-hot-toast'
import Loader from 'src/views/common/Loader'

const defaultValues = { image: '', title: '', description: '', link: '', users: [] }

const ImgStyled = styled('img')(({ theme }) => ({
  // width: '90%',
  // height: '100%',
  borderRadius: 4,
  marginRight: theme.spacing(5),
  objectFit: 'contain'
}))

const CustomNotificationDialog = ({ open, handleClose }) => {
  const usersData = useSelector(state => state.usersData)
  const [isLoading, setIsLoading] = useState(false)
  // console.log(usersData)

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  const image = watch('image')

  const options = useMemo(() => {
    // return usersData.map(option => {
    //   const firstLetter = option.name[0].toUpperCase()
    //   return {
    //     firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //     ...option
    //   }
    // })
    return usersData.map(user => {
      return user
    })
  }, [usersData])

  const handleInputImageChange = (file, onImageChange) => {
    const reader = new FileReader()
    const { files } = file.target

    if (files && files.length !== 0) {
      reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          // canvas.width = 64
          // canvas.height = 64
          const ctx = canvas.getContext('2d')

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          const resizedImage = canvas.toDataURL()

          onImageChange(resizedImage)
          file.target.value = null
        }
      }
      reader.readAsDataURL(files[0])
    }
  }

  const onSubmit = async data => {
    const { image, title, description, link, users } = data

    const selectedUsers = users.map((user, idx) => {
      const { partnerId, employeeId, name, email } = user
      return { userId: partnerId ?? employeeId, name, email }
    })

    setIsLoading(true)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    // const BASE_URL = 'http://localhost:4000/api'
    const response = await postRequest(`${BASE_URL}/admin/send-notification`, {
      title,
      description,
      link,
      logo: image,
      users: selectedUsers
    })
    setIsLoading(false)

    if (response.status) {
      toast.success('Notification Send')
      resetFields()
    } else {
      toast.error(response.error)
    }
  }

  const resetFields = () => {
    handleClose()
    reset()
  }

  return (
    <>
      <Loader open={isLoading} />
      <Dialog fullWidth maxWidth='sm' open={open} onClose={resetFields}>
        <DialogTitle
          sx={{
            '&.MuiDialogTitle-root': {
              pb: 1
            }
          }}
          textAlign='center'
        >
          Select Room Type
        </DialogTitle>
        <form
          style={{ display: 'flex', flexDirection: 'column' }}
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent sx={{ '&.MuiDialogContent-root': { mt: '0px' } }}>
            <DialogContentText textAlign='center'>Custom Notification</DialogContentText>
            <Grid container spacing={6} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <Card
                  // className='common-card'
                  component='label'
                  htmlFor='image'
                  sx={{
                    height: '235px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FormControl>
                    <Controller
                      name='image'
                      control={control}
                      // rules={{ required: 'This field is required' }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <input
                            hidden
                            type='file'
                            accept='image/png, image/jpeg'
                            onChange={e => handleInputImageChange(e, onChange)}
                            id='image'
                          />
                          {image.length == 0 ? (
                            <>
                              <Box>{UploadLogo}</Box>
                              <Typography fontSize={17}>Upload Image</Typography>
                            </>
                          ) : (
                            <ImgStyled src={image} alt='Logo' />
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='title'
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        fullWidth
                        onChange={onChange}
                        id='title'
                        label='Title'
                        error={Boolean(errors.title)}
                      />
                    )}
                  />
                  {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        fullWidth
                        onChange={onChange}
                        id='description'
                        error={Boolean(errors.description)}
                        label='Description'
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }} id='description'>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='link'
                    control={control}
                    rules={{ required: 'Link is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        fullWidth
                        onChange={onChange}
                        id='link'
                        error={Boolean(errors.link)}
                        label='Link'
                      />
                    )}
                  />
                  {errors.link && (
                    <FormHelperText sx={{ color: 'error.main' }} id='link'>
                      {errors.link.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='users'
                    control={control}
                    rules={{ required: 'Link is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Autocomplete
                        multiple
                        limitTags={1}
                        id='checkboxes-tags-source'
                        disableCloseOnSelect
                        value={value}
                        onChange={(e, newInput) => {
                          // console.log(e)
                          console.log(newInput)
                          onChange(newInput)
                        }}
                        // options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        options={options.sort((a, b) => -b.name.localeCompare(a.name))}
                        groupBy={option => option.designation}
                        getOptionLabel={option => option.name}
                        renderInput={params => <TextField {...params} label='Users' error={Boolean(errors.users)} />}
                      />
                    )}
                  />
                  {errors.users && (
                    <FormHelperText sx={{ color: 'error.main' }} id='users'>
                      {errors.users.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button size='small' variant='outlined' onClick={resetFields}>
              Cancel
            </Button>
            <Button type='submit' size='small' variant='contained'>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default CustomNotificationDialog
