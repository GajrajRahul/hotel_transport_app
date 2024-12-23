// ** React Imports
import { useState } from 'react'
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import { EyeOpen, EyeClose, TwoFactorAuth } from 'src/utils/icons'

// import EyeOutline from 'mdi-material-ui/EyeOutline'
// import KeyOutline from 'mdi-material-ui/KeyOutline'
// import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
// import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

const UserSecurityInfo = () => {
    // ** States
    const [values, setValues] = useState({
        newPassword: '',
        currentPassword: '',
        showNewPassword: false,
        confirmNewPassword: '',
        showCurrentPassword: false,
        showConfirmNewPassword: false
    })

    // Handle Current Password
    const handleCurrentPasswordChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowCurrentPassword = () => {
        setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
    }

    const handleMouseDownCurrentPassword = event => {
        event.preventDefault()
    }

    // Handle New Password
    const handleNewPasswordChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword })
    }

    const handleMouseDownNewPassword = event => {
        event.preventDefault()
    }

    // Handle Confirm New Password
    const handleConfirmNewPasswordChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowConfirmNewPassword = () => {
        setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
    }

    const handleMouseDownConfirmNewPassword = event => {
        event.preventDefault()
    }

    return (
        <form>
            <CardContent sx={{ paddingBottom: 0 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
                                    <OutlinedInput
                                        label='Current Password'
                                        value={values.currentPassword}
                                        id='account-settings-current-password'
                                        type={values.showCurrentPassword ? 'text' : 'password'}
                                        onChange={handleCurrentPasswordChange('currentPassword')}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    aria-label='toggle password visibility'
                                                    onClick={handleClickShowCurrentPassword}
                                                    onMouseDown={handleMouseDownCurrentPassword}
                                                >
                                                    {values.showCurrentPassword ? EyeOpen : EyeClose}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ marginTop: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
                                    <OutlinedInput
                                        label='New Password'
                                        value={values.newPassword}
                                        id='account-settings-new-password'
                                        onChange={handleNewPasswordChange('newPassword')}
                                        type={values.showNewPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onClick={handleClickShowNewPassword}
                                                    aria-label='toggle password visibility'
                                                    onMouseDown={handleMouseDownNewPassword}
                                                >
                                                    {values.showNewPassword ? EyeOpen : EyeClose}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm New Password</InputLabel>
                                    <OutlinedInput
                                        label='Confirm New Password'
                                        value={values.confirmNewPassword}
                                        id='account-settings-confirm-new-password'
                                        type={values.showConfirmNewPassword ? 'text' : 'password'}
                                        onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    aria-label='toggle password visibility'
                                                    onClick={handleClickShowConfirmNewPassword}
                                                    onMouseDown={handleMouseDownConfirmNewPassword}
                                                >
                                                    {values.showConfirmNewPassword ? EyeOpen : EyeClose}

                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>

                                <Box sx={{ mt: 5, mb: 10}}>
                                    <Button variant='contained' sx={{ marginRight: 3.5 }}>
                                        Save Changes
                                    </Button>
                                    <Button
                                        type='reset'
                                        variant='outlined'
                                        color='secondary'
                                        onClick={() => setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })}
                                    >
                                        Reset
                                    </Button>
                                </Box>

                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid
                        item
                        sm={6}
                        xs={12}
                        sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
                    >
                        <img width={800} alt='avatar' height={300} src='/images/reset-password-illustration.svg' />
                    </Grid>


                </Grid>
            </CardContent>

            <Divider sx={{ margin: 0 }} />

            <CardContent>
                <Box sx={{ mt: 1.75, display: 'flex', alignItems: 'center' }}>
                    {/* <KeyOutline sx={{ marginRight: 3 }} /> */}
                    {TwoFactorAuth}
                    <Typography sx={{ marginLeft: "10px" }} variant='h6'>Two-Factor Authentication - Coming Soon</Typography>
                </Box>

                <Box sx={{ mt: 5.75, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            maxWidth: 368,
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >

                        {/* <Image src='/images/apple-touch-icon.png' width={250} height={85} alt='company_logo' /> */}
                        <img width={183} alt='avatar' height={256} src='/images/barrier-svgrepo-com.svg' />

                        <Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
                        Enhanced Security, Coming Your Way!
                        </Typography>
                        <Typography variant='body2'>
                        We're working on adding two-factor authentication (2FA) to strengthen your account security. With 2FA, you’ll have an added layer of protection to keep your CRM data safe. Stay tuned – it's coming soon!
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </form>
    )
}

export default UserSecurityInfo
