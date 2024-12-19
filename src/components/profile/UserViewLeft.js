import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
// import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
// import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'

const data = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const UserViewLeft = () => {
  const [openEdit, setOpenEdit] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { logout, user } = useAuth()
  const { name, email, address, mobile } = user

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: name,
      email,
      mobile,
      address
    }
  })

  const updateProfile = async data => {}

  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {data.avatar ? (
              <CustomAvatar
                src={data.avatar}
                variant='rounded'
                alt={data.fullName}
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
              >
                {getInitials(user.name)}
              </CustomAvatar>
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={data.avatarColor}
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(user.name)}
              </CustomAvatar>
            )}
            <Typography variant='h6' sx={{ mb: 4 }}>
              {user.name}
            </Typography>
            <CustomChip
              skin='light'
              size='small'
              label={data.role}
              color={roleColors[data.role]}
              sx={{ textTransform: 'capitalize' }}
            />
          </CardContent>

          <CardContent>
            {/* <Typography variant='h6'>Details</Typography> */}
            <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Username:</Typography>
                <Typography variant='body2'>{user.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Email:</Typography>
                <Typography variant='body2'>{user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Role:</Typography>
                <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                  {data.role}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Contact:</Typography>
                <Typography variant='body2'>{user.mobile}</Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Edit
            </Button>
            <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
              Suspend
            </Button>
          </CardActions>

          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            aria-describedby='user-view-edit-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              Edit User Information
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Updating user details will receive a privacy audit.
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='username'
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            fullWidth
                            label='Username'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            id='username-id'
                            error={Boolean(errors.username)}
                          />
                        )}
                      />
                      {errors.username && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                      )}
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
                            type='email'
                            label='Email'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            id='email-id'
                            error={Boolean(errors.email)}
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='mobile'
                        control={control}
                        rules={{ required: 'Contact is required' }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            fullWidth
                            label='Contact'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            id='mobile-id'
                            error={Boolean(errors.mobile)}
                          />
                        )}
                      />
                      {errors.mobile && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>
                      )}
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
                            onBlur={onBlur}
                            onChange={onChange}
                            id='address-id'
                            error={Boolean(errors.address)}
                          />
                        )}
                      />
                      {errors.address && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} /> */}
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewLeft
