import React, { forwardRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'

import { styled } from '@mui/material/styles'

import Icon from 'src/@core/components/icon'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const defaultUserDetail = {
  logo: '/images/avatars/1.png',
  name: 'Owner',
  email: 'rahulgajraj@gmail.com',
  mobile: '7568901443',
  gender: 'male',
  address: 'G -22, Pushp Enclave, Sanganer, Sector 11, Pratap Nagar, Jaipur, Rajasthan - 302033',
  company: 'Self',
  status: 'pending',
  designation: 'Developer',
  tagline: 'Your Journey, Our Expertise',
  title: 'My name is Rahul Gajraj',
  about:
    "Specializing in both domestic and international travel, we create seamless, personalized tours that turn your travel dreams into reality. Whether you're exploring nearby or venturing abroad, we handle the details, ensuring a smooth and unforgettable experience."
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  // height: 120,
  //   marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ApproveButtonStyled = styled(Button)(({ theme }) => ({
  //   backgroundColor: theme.palette.success.main,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const BlockButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  //   backgroundColor: theme.palette.error.main,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const UserDetail = ({ show, onClose, selectedUserDetail }) => {
  const [userDetail, setUserDetail] = useState(defaultUserDetail)

  useEffect(() => {
    if (selectedUserDetail) {
      setUserDetail(selectedUserDetail)
    }
  }, [selectedUserDetail])

  return (
    <Dialog
      fullWidth
        open={show}
    //   open={true}
      maxWidth='md'
      scroll='body'
      onClose={onClose}
      TransitionComponent={Transition}
      onBackdropClick={onClose}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(13)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <IconButton size='small' onClick={onClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Manage User Access
          </Typography>
          <Typography variant='body2'>
            Take control with ease! Block or unblock user access in a click and stay informed with all essential user
            details like email, phone, and more—all in one place.
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}
            >
              <ImgStyled src={userDetail.logo} alt='Profile Pic' />
              {userDetail.status == 'pending' ? (
                <Box sx={{ textAlign: 'center' }}>
                  <ApproveButtonStyled
                    color='success'
                    component='label'
                    variant='contained'
                    htmlFor='account-settings-upload-image'
                  >
                    Approve
                  </ApproveButtonStyled>
                  <BlockButtonStyled color='error' variant='contained'>
                    Block
                  </BlockButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 2 }}>
                    Action needed: User awaits approval.
                  </Typography>
                </Box>
              ) : userDetail.status == 'blocked' ? (
                <Box sx={{ textAlign: 'center' }}>
                  <ApproveButtonStyled
                    color='success'
                    component='label'
                    variant='contained'
                    htmlFor='account-settings-upload-image'
                    sx={{ ml: 0 }}
                  >
                    Unblock
                  </ApproveButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 2 }}>
                    Click to unblock and restore user access.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <BlockButtonStyled sx={{ ml: 0 }} color='error' variant='contained'>
                    Block
                  </BlockButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 2 }}>
                    Click to block and revoke user access.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField disabled fullWidth defaultValue={userDetail.name} label='Name' />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField fullWidth label='Email' defaultValue={userDetail.email} disabled />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField disabled fullWidth label='Phone' defaultValue={userDetail.mobile} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
            <RadioGroup row defaultValue={userDetail.gender} aria-label='gender' name='account-settings-info-radio'>
              <FormControlLabel disabled value='male' label='Male' control={<Radio />} />
              <FormControlLabel disabled value='female' label='Female' control={<Radio />} />
              <FormControlLabel disabled value='other' label='Other' control={<Radio />} />
            </RadioGroup>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField disabled fullWidth label='Company Name' defaultValue={userDetail.company} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField disabled fullWidth label='Designation' defaultValue={userDetail.designation} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField multiline rows={2} disabled fullWidth label='Tagline' defaultValue={userDetail.tagline} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField multiline rows={2} disabled fullWidth label='Title' defaultValue={userDetail.title} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField multiline rows={2} disabled fullWidth label='About' defaultValue={userDetail.about} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField multiline rows={2} disabled fullWidth label='Address' defaultValue={userDetail.address} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default UserDetail
