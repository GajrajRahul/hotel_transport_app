import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

const Loader = ({ open, classes = '', backgroundColor = '', color = '', children }) => {
  return (
    <Backdrop
      className={classes}
      sx={{
        // color: color,
        zIndex: theme => Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
        backgroundColor: backgroundColor,
        color: theme => color || theme.palette.primary.main
      }}
      open={open}
    >
      {children ? children : <CircularProgress color='inherit' />}
    </Backdrop>
  )
}

export default Loader
