import React from 'react'

import Grid from '@mui/material/Grid'
import UserViewLeft from 'src/components/profile/UserViewLeft'

const Profile = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}></Grid>
    </Grid>
  )
}

export default Profile
