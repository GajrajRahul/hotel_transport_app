import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

const AmountDisplayDialog = ({ open, handleClose, amounts }) => {
  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 3
          }
        }}
        textAlign='center'
      >
        Total Amount
      </DialogTitle>
      <DialogContent>
        {amounts && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Typography>Transport Amount</Typography>
              <Typography>{amounts.transport}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Typography>Hotel Amount</Typography>
              <Typography>{amounts.hotel}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 5 }}>
              <Typography>Total Amount:</Typography>
              <Typography>{amounts.total}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AmountDisplayDialog
