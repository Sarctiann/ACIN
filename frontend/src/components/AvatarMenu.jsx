import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  IconButton, Avatar, Menu, MenuItem, Typography, Divider, Fade 
} from '@mui/material'

function stringAvatar(name) {

  return name.split(' ').map(word => {return word[0]}).join('').toUpperCase()
}

const AvatarMenu = (props) => {

  const { userName, disabled, setToken, ...others } = props
  const location = useLocation()
  const navigate = useNavigate()

  let bg = location.pathname.split('/')[1] === 'account' ?
    'secondary.main' :
    'primary.main'

  if (disabled) {bg='default'}

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const justClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleOptions = () => {
    setAnchorEl(null)
    console.log('Give me Options!!!')
    navigate('/account')
  }

  const handleLogout = () => {
    setAnchorEl(null)
    setToken({"token":""})
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
        aria-expanded={open ? 'true' : undefined}
        color='secondary' 
        disabled={disabled} >

        <Avatar sx={{ bgcolor: bg }} children={stringAvatar(userName)} />

      </IconButton>
      <Menu
        id="aria_menu"
        anchorEl={anchorEl}
        open={open}
        onClose={justClose}
        TransitionComponent={Fade} >
        <Typography variant='body2' color='secondary' marginX={2} mb={1} >
          {userName}
        </Typography>
        <Divider />
        <MenuItem onClick={handleOptions}>
          Options
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default AvatarMenu;