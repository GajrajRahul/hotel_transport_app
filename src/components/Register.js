import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

import { styled, useTheme } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import { UploadLogo } from 'src/utils/icons'
import Loader from 'src/components/common/Loader'
import { postRequest } from 'src/api-main-file/APIServices'
// import { SIGN_UP_REQUEST } from 'src/api-main-file/APIUrl'

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const CustomLinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none'
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: '90%',
  // height: '100%',
  borderRadius: 4,
  marginRight: theme.spacing(5),
  objectFit: 'contain'
}))

const Register = ({ registerUrl }) => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    setError,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      logo: '',
      name: '',
      email: '',
      password: '',
      address: '',
      companyName: '',
      mobile: '',
      referringAgent: ''
    }
  })

  const logo = watch('logo')

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
          // clearErrors(key)
          file.target.value = null
        }
      }
      reader.readAsDataURL(files[0])
    }
  }

  const onSubmit = async data => {
    // const { logo, name, email, password, address, companyName, mobile, referringAgent } = data
    const routes = registerUrl.split('/')

    setIsLoading(true)

    const api_url = `${BASE_URL}/${routes[routes.length - 1]}`
    const response = await postRequest(`${api_url}/login`, data)
    setIsLoading(false)
    if (response.status) {
      toast.success('Signup Successful')
      router.push('/login')
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Box className='content-right'>
      <Loader open={isLoading} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box sx={{ textAlign: 'center', mt: '20px' }}>
          <NextImage src='/../public/images/white_logo.png' width={250} height={85} alt='company_logo' />
        </Box>
        <Card className='inner-card' sx={{ mx: 10, p: 10, pb: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TypographyStyled color='white' variant='h4'>
              Create Account
            </TypographyStyled>
            <Typography color='white' variant='body2'>
              Have an account? <CustomLinkStyled href='/login'>Login</CustomLinkStyled>
            </Typography>
          </Box>
          <Grid component='form' onSubmit={handleSubmit(onSubmit)} container spacing={6} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={1.5}>
              <Card
                className='common-card'
                sx={{
                  height: '235px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                  cursor: 'pointer'
                }}
                component='label'
                htmlFor='logo'
              >
                <FormControl>
                  <Controller
                    name='logo'
                    control={control}
                    // rules={{ required: 'This field is required' }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <input
                          hidden
                          type='file'
                          // value={value}
                          accept='image/png, image/jpeg'
                          onChange={e => handleInputImageChange(e, onChange)}
                          id='logo'
                        />
                        {logo.length == 0 ? (
                          <>
                            <Box>{UploadLogo}</Box>
                            <Typography fontSize={17}>Upload Logo</Typography>
                          </>
                        ) : (
                          <ImgStyled src={logo} alt='Logo' />
                        )}
                      </>
                    )}
                  />
                </FormControl>
                {/* {UploadLogo}
                <Typography fontSize={17}>Upload Logo</Typography> */}
              </Card>
            </Grid>
            <Grid item xs={12} sm={3.5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7.5 }}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Name'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-name'
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: 'Address is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        multiline
                        rows={5}
                        value={value}
                        onBlur={onBlur}
                        placeholder='Address'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-address'
                        error={Boolean(errors.address)}
                      />
                    )}
                  />
                  {errors.address && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3.5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: 'Email is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Email'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-email'
                        error={Boolean(errors.email)}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name='companyName'
                    control={control}
                    rules={{ required: 'Company Name is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Company Name'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-companyName'
                        error={Boolean(errors.companyName)}
                      />
                    )}
                  />
                  {errors.companyName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name='referringAgent'
                    control={control}
                    rules={{ required: 'Referring agent is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Referring Agent'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-referringAgent'
                        error={Boolean(errors.referringAgent)}
                      />
                    )}
                  />
                  {errors.referringAgent && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.referringAgent.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3.5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FormControl fullWidth>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Password'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-password'
                        error={Boolean(errors.password)}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name='mobile'
                    control={control}
                    rules={{ required: 'Mobile is required' }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        placeholder='Mobile Number'
                        sx={{ background: 'rgba(234, 240, 247, 0.5)' }}
                        onChange={onChange}
                        id='auth-login-mobile'
                        error={Boolean(errors.mobile)}
                      />
                    )}
                  />
                  {errors.mobile && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>
                  )}
                </FormControl>
                <Button type='submit' sx={{ height: '56px', boxShadow: 'none' }} fullWidth variant='contained'>
                  <Typography color='white'>Sign Up</Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant='body2' color='white'>
              By creating an account, you accept the adventurerichaholidays.com
            </Typography>
            <Typography variant='body2' color='white'>
              <CustomLinkStyled href='/'>Terms & conditions</CustomLinkStyled>
               and 
              <CustomLinkStyled href='/'>Privacy statement</CustomLinkStyled>
            </Typography>
          </Box>
        </Card>
        <Box sx={{ mb: '20px', mx: 10 }}>
          <Card className='footer-card' sx={{ display: 'flex', alignItems: 'center', height: '45px' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography color='white' fontSize={17}>
                © 2019 - 2024 Adventure Richa Holidays. All rights reserved.
              </Typography>
              <IconButton size='small' sx={{ backgroundColor: theme => theme.palette.primary.main, color: 'white' }}>
                <Icon icon='mdi:help' />
              </IconButton>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

// Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
// Register.guestGuard = true

export default Register
