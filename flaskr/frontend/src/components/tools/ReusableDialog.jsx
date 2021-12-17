import { useState } from 'react'
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material'

const RDialog = (props) => {

  const { title, message, confirmText, action, children, ...others } = props

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  
  const handleClose = (e) => {
    setOpen(false)
    try {
      action(e)
    }
    catch (error) {
      console.error(`add <action> prop, or: ${error}`)
    }
  }

  const justClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div onClick={handleOpen}>
        {children}
      </div>
      <Dialog {...others}
        open={open}
        onClose={justClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogTitle id="title">
          {title || 'add <title> prop'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            {message || 'add <message> prop'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={justClose}>
            Cancel </Button>
          <Button onClick={handleClose} color='error' autoFocus>
            {confirmText || 'add <confirmText> prop'} </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RDialog