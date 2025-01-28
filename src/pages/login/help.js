import React, { useState } from 'react'
import { CardContent, Typography, Tooltip, Popover, Button } from '@mui/material'
import { DarkHelpIcon, FAQsIcon, HandShake } from 'src/utils/icons'
import { Box } from '@mui/system'
import { useRouter } from 'next/router';

const HelpSection = () => {
  const router = useRouter(); 

  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  // Handle the close of the Popover
  const handleClose = () => {
    setOpen(false)
  }

  
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    setOpen(!open) // Toggle the popover visibility
  }

  const handleFaqClick = () => {
    // Redirect to the FAQ page
    router.push('/faqs'); // Make sure to replace '/faq' with your actual FAQ route
  };

  return (
    <CardContent
      sx={{
        pt: '15px !important',
        pb: '15px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '0.56rem', sm: '0.75rem', md: '0.56rem', laptopSm: '1rem', fontWeight: '500' }
        }}
        color='black'
      >
        © 2024 Adventure Richa Holidays
      </Typography>

      <Tooltip title='Need Help?' placement='left' arrow>
        <Box onClick={handleClick}>{DarkHelpIcon}</Box>
      </Tooltip>

      {/* Popover for the FAQ and Chat options */}
      <Popover
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'transparent', // Set background to transparent
            boxShadow: 'none', // Remove shadow
            padding: '0px', // Optional: remove padding if you want to minimize space
            border: 'none' // Optional: Remove the border if you want no outline
          }
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Box
          style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            background: '#ffffff00'
          }}
        >
          <Button
            sx={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ff7b00',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#ffb76b', // Change the background color on hover
                color: 'orange', // Change the text color on hover
                transform: 'scale(1.05)', // Optional: add a slight scale effect on hover
                boxShadow: 'none' // Optional: add a shadow on hover
              }
            }}
            onClick={handleFaqClick} // Set the onClick handler
          >
            {FAQsIcon}
            <Typography sx={{ fontWeight: '600', marginLeft: '10px', color: 'White' }}>FAQs</Typography>
          </Button>

          <Button
            sx={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ff7b00',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#ffb76b', // Change the background color on hover
                color: 'orange', // Change the text color on hover
                transform: 'scale(1.05)', // Optional: add a slight scale effect on hover
                boxShadow: 'none' // Optional: add a shadow on hover
              }
            }}
            onClick={() => window.open('https://wa.me/+919784189197?text=kindly%20describe%20your%20issue%20before%20starting%20the%20chat%20with%20our%20ARH%20support%20experts.%20Your%20details%20will%20help%20us%20assist%20you%20more%20efficiently!', '_blank')}
          >
            {HandShake}
            <Typography sx={{ fontWeight: '600', marginLeft: '10px', color: 'white'}}>Chat</Typography>
          </Button>
        </Box>
      </Popover>
    </CardContent>
  )
}

export default HelpSection
