// ** React Imports
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { putRequest } from 'src/api-main-file/APIServices'
import Loader from '../common/Loader'

// ** Icons Imports
// import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  // height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const UserBasicInfo = () => {
  // ** State
  const { user } = useAuth()
  const { name, email, mobile, gender, address, companyName, designation, tagline, title, about, logo } = user

  const [imgSrc, setImgSrc] = useState(logo ? logo : '')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: name ? name : '',
      email: email ? email : '',
      mobile: mobile ? mobile : '',
      gender: gender ? gender : 'male',
      address: address ? address : '',
      company: companyName ? companyName : '',
      designation: designation ? designation : '',
      tagline: tagline ? tagline : '',
      title: title ? title : '',
      about: about ? about : ''
    }
  })

  const resetForm = () => {
    reset()
    setImgSrc('/images/avatars/1.png')
  }

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    const baseUri = process.env.NEXT_PUBLIC_BASE_URL
    const clientType = localStorage.getItem('clientType') ? localStorage.getItem('clientType') : 'admin'
    const response = await putRequest(`${baseUri}/${clientType}/update-profile`, { ...data, logo: imgSrc })
    setIsLoading(false)

    if (response.status) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(response.error)
    }
  }

  return (
    <CardContent>
      <Loader open={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG, JPG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Name'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='email'
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Email'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.email)}
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='mobile'
                control={control}
                rules={{ required: 'Mobile is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Phone'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.mobile)}
                  />
                )}
              />
              {errors.mobile && <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='gender'
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
                    <RadioGroup
                      row
                      value={value}
                      onChange={onChange}
                      aria-label='gender'
                      name='account-settings-info-radio'
                    >
                      <FormControlLabel value='male' label='Male' control={<Radio />} />
                      <FormControlLabel value='female' label='Female' control={<Radio />} />
                      <FormControlLabel value='other' label='Other' control={<Radio />} />
                    </RadioGroup>
                  </>
                )}
              />
              {errors.gender && <FormHelperText sx={{ color: 'error.main' }}>{errors.gender.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='address'
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Address'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.address)}
                  />
                )}
              />
              {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='company'
                control={control}
                // rules={{ required: 'Company is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Company'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors.company)}
                  />
                )}
              />
              {/* {errors.company && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>} */}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='designation'
                control={control}
                // rules={{ required: 'Designation is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Designation'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors.designation)}
                  />
                )}
              />
              {/* {errors.designation && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.designation.message}</FormHelperText>
              )} */}
            </FormControl>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled>
              <InputLabel>Referring Agent Name</InputLabel>
              <Select label='Referring Agent Name' defaultValue='nehasharma'>
                <MenuItem value='nehasharma'>Neha Sharma</MenuItem>
                <MenuItem value='author'>Author</MenuItem>
                <MenuItem value='editor'>Editor</MenuItem>
                <MenuItem value='maintainer'>Maintainer</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='tagline'
                control={control}
                // rules={{ required: 'Tagline is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Tagline'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors.tagline)}
                  />
                )}
              />
              {/* {errors.tagline && <FormHelperText sx={{ color: 'error.main' }}>{errors.tagline.message}</FormHelperText>} */}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='title'
                control={control}
                // rules={{ required: 'Title is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Title'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors.title)}
                  />
                )}
              />
              {/* {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>} */}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='about'
                control={control}
                // rules={{ required: 'About is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='About'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors.about)}
                  />
                )}
              />
              {/* {errors.about && <FormHelperText sx={{ color: 'error.main' }}>{errors.about.message}</FormHelperText>} */}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={resetForm}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default UserBasicInfo
