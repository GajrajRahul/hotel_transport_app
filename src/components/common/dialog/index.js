import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Icon from 'src/@core/components/icon'

const CommonDialog = props => {
  const {
    open,
    onCancel,
    onSuccess,
    cancelButtonName = 'Cancel',
    successButtonname = 'Yes',
    title,
    description
  } = props

  return (
    <Dialog fullWidth open={open} onClose={onCancel} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(6)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            '& svg': { mb: 6, color: 'warning.main' }
          }}
        >
          <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
          {title && (
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              {title}
            </Typography>
          )}
          {description && <Typography>{description}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' sx={{ mr: 2 }} onClick={onSuccess}>
          {successButtonname}
        </Button>
        <Button variant='outlined' color='secondary' onClick={onCancel}>
          {cancelButtonName}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CommonDialog
