import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconButton, Avatar, Menu, MenuItem, Typography, Divider, Fade,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material'
import { PersonOff as AvIcon } from '@mui/icons-material'

import { UserContext } from './tools/contexts'

const stringAvatar = user => {
  
  if (user) {
    return [user.first_name[0], user.last_name[0]].join('').toUpperCase()
  }
  return <AvIcon />
}

const AvatarMenu = props => {

  const { user, setUser } = useContext(UserContext)
  const { disabled, ...others } = props
  const location = useLocation()
  const navigate = useNavigate()

  let bg = location.pathname.split('/')[1] === 'account' ?
    'secondary.main' :
    'primary.main'

  if (disabled) { bg = 'default' }

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [openDialog, setOpenDialog] = useState(false)

  const justClose = () => {
    setAnchorEl(null)
    setOpenDialog(false)
  }

  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleOptions = () => {
    setAnchorEl(null)
    navigate('/account')
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    setOpenDialog(false)
    setUser(undefined)
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <IconButton variant='outlined' {...others}
        id='id_menu'
        aria-controls="aria_menu"
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        color='secondary'
        disabled={disabled} >

        <Avatar sx={{ bgcolor: bg }} children={stringAvatar(user)} />

      </IconButton>

      <Menu
        id="aria_menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={justClose}
        TransitionComponent={Fade} >
        <Typography variant='body2' color='secondary' marginX={2} mb={1} >
          {[user?.first_name, user?.last_name].join(' ')}
        </Typography>
        <Divider />
        <MenuItem onClick={handleOptions}>
          Options
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          Logout
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={justClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogTitle id="title">
          LOGOUT
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            Do you confirm logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={justClose}>
            Cancel </Button>
          <Button onClick={handleLogout} color='error' autoFocus>
            Logout </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AvatarMenu;