import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconButton, Avatar, Menu, MenuItem, Typography, Divider, Fade, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  ListItemIcon
} from '@mui/material'
import { PersonOff as AvIcon, Person, Logout } from '@mui/icons-material'

import { UserContext, AuthContext } from './tools/contexts'

const stringAvatar = user => {

  if (user) {
    return [user.first_name[0], user.last_name[0]].join('').toUpperCase()
  }
  return <AvIcon />
}

const AvatarMenu = props => {

  const { user, setUser } = useContext(UserContext)
  const { setAuth } = useContext(AuthContext)
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
    setAuth(false)
    localStorage.removeItem('user')
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
        <Typography variant='overline' color='secondary' marginX={2} mb={1} >
          {[user?.first_name, user?.last_name].join(' ')}
        </Typography>
        <Typography variant='subtitle1' color='GrayText' marginX={2} mb={1} >
          {user?.email}
        </Typography>
        <Divider />
        <MenuItem onClick={handleOptions}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          Options
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
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