import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton, Avatar, Menu, MenuItem, Fade } from '@mui/material'

function stringAvatar(name) {

  return name.split(' ').length > 1 ? 
      `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` :
      name[0]
}

const AvatarMenu = (props) => {

  const { userName, ...others } = props
  const location = useLocation()
  const navigate = useNavigate()

  const bg = location.pathname.split('/')[1] === 'user' ?
    'secondary.main' :
    'primary.main'

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
    navigate('/user/account')
  }
  
  const handleLogout = () => {
    setAnchorEl(null)
    console.log('handle Logout!!!')
    navigate('/user/login')
  }

  
  return (
    <>
    <IconButton variant='outlined' color='secondary' {...others}
        id='id_menu'
        aria-controls="aria_menu"
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
      
      <Avatar sx={{bgcolor: bg}} children={stringAvatar(userName)}/> 
    
    </IconButton>
  <Menu
    id="aria_menu"
    anchorEl={anchorEl}
    open={open}
    onClose={justClose}
    TransitionComponent={Fade}>
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