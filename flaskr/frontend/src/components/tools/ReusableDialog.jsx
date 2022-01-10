import { useState } from 'react'
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material'

const RDialog = (props) => {

  const {
    title = 'add <title> prop', message = 'add <message> prop',
    confirmText = 'add <confirmText> prop', color = 'error', disabled = false,
    action, children, ...others
  } = props

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

  const divProps = !disabled ? {
    onClick: handleOpen
  } : {}

  return (
    <>
      <div {...divProps}>
        {children}
      </div>
      <Dialog {...others}
        open={open}
        onClose={justClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogTitle id="title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={justClose}>
            Cancel </Button>
          <Button onClick={handleClose} color={color} autoFocus>
            {confirmText} </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RDialog