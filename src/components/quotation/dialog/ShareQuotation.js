import { forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Fade from '@mui/material/Fade'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const ShareQuotation = ({ open, handleClose, pdfUrl }) => {
  const [showCopyMessage, setShowCopyMessage] = useState({ status: false, message: '' })
  const {
    control: emailControl,
    reset: emailReset,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const {
    control: whatsappControl,
    reset: whatsappReset,
    handleSubmit: handleWhatsappSubmit,
    formState: { errors: whatsappErrors }
  } = useForm({
    defaultValues: {
      whatsapp: ''
    }
  })

  const handleWhatsApp = data => {
    const link = document.createElement('a')

    const message =
      `Your Adventure Awaits!%0A%0A` +
      `Here’s your personalised travel itinerary with all the details you need for an unforgettable journey.%0A%0A` +
      `Click the link below to view your itinerary:%0A%0A` +
      `${pdfUrl}%0A%0A` +
      `Feel free to reach out if you have any questions.%0A` +
      `Safe travels and happy exploring!`

    link.href = `https://wa.me/${data.whatsapp}/?text=${message}`

    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSendMail = data => {
    const subject = encodeURIComponent('Your Travel Itinerary')
    const body = encodeURIComponent(
      `We are excited to share your travel itinerary for the upcoming trip. Please find the details in the PDF attached below. Click the link to download the itinerary:%0A%0A${pdfUrl}%0A%0A Thank you for choosing Adventure Richa Holidays. If you have any questions or need assistance, feel free to reply to this email.%0A%0A Wishing you a memorable journey!%0A%0A`
    )

    const link = document.createElement('a')
    link.href = `mailto:${data.email}?subje  ct=${subject}&body=${body}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(pdfUrl)
      .then(() => {
        setShowCopyMessage({ status: true, message: 'Link copied' })
        // toast.success('Copied to clipboard')
      })
      .catch(err => {
        setShowCopyMessage({ status: true, message: 'Unable to copy link, Try again!' })
        // toast.error('Unable to copy text to clipboard')
      })
  }

  const resetFields = () => {
    emailReset()
    whatsappReset()
    setShowCopyMessage({ status: false, message: '' })
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={resetFields}
      TransitionComponent={Transition}
      onBackdropClick={resetFields}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pt: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box sx={{ mb: 8 }}>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Share Your Travel Itinerary Instantly!
          </Typography>
          <InputLabel htmlFor='refer-email' sx={{ mb: 2, display: 'inline-flex', whiteSpace: 'break-spaces' }}>
            Send via Email
          </InputLabel>
          <Box
            sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
            noValidate
            component='form'
            autoComplete='off'
            onSubmit={handleEmailSubmit(handleSendMail)}
          >
            <FormControl fullWidth sx={{ mr: { xs: 0, sm: 4 } }}>
              <Controller
                name='email'
                control={emailControl}
                rules={{ required: 'Email is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    size='small'
                    id='refer-email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="Enter recipient's email address"
                    error={Boolean(emailErrors.email)}
                  />
                )}
              />
              {emailErrors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>{emailErrors.email.message}</FormHelperText>
              )}
            </FormControl>
            <Button variant='contained' type='submit' sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              Send
            </Button>
          </Box>
          <InputLabel htmlFor='refer-email' sx={{ mb: 2, display: 'inline-flex', whiteSpace: 'break-spaces', mt: 5 }}>
            Share on WhatsApp
          </InputLabel>
          <Box
            sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
            component='form'
            autoComplete='off'
            onSubmit={handleWhatsappSubmit(handleWhatsApp)}
          >
            <FormControl fullWidth sx={{ mr: { xs: 0, sm: 4 } }}>
              <Controller
                name='whatsapp'
                control={whatsappControl}
                rules={{ required: 'Whatsapp Number is required' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    size='small'
                    id='refer-whatsapp'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter WhatsApp number with country code'
                    error={Boolean(whatsappErrors.whatsapp)}
                  />
                )}
              />
              {whatsappErrors.whatsapp && (
                <FormHelperText sx={{ color: 'error.main' }}>{whatsappErrors.whatsapp.message}</FormHelperText>
              )}
            </FormControl>
            <Button variant='contained' type='submit' sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              Send
            </Button>
          </Box>
        </Box>
        <div>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Copy Itinerary Link
          </Typography>
          <InputLabel htmlFor='refer-social' sx={{ mb: 2, display: 'inline-flex', whiteSpace: 'break-spaces' }}>
            You can also copy and send it or share it with your client's.
          </InputLabel>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['flex-end', 'initial']
            }}
          >
            <OutlinedInput
              fullWidth
              size='small'
              id='refer-social'
              sx={{ pr: 1.25, mr: [0, 4] }}
              defaultValue={pdfUrl}
              disabled
              endAdornment={
                <InputAdornment position='end'>
                  <Button onClick={handleCopyLink} size='small'>
                    Copy Link
                  </Button>
                </InputAdornment>
              }
            />
          </Box>
          {showCopyMessage.status && (
            <Typography variant='body2' sx={{ mt: 2, color: 'success.main' }}>
              {showCopyMessage.message}
            </Typography>
          )}
        </div>
        <DialogActions>
          <Button onClick={resetFields} variant='outlined'>
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default ShareQuotation
