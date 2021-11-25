import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab, Menu, MenuItem, Fade } from '@mui/material'

const MenuTab = (props) => {

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  
  const justClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = (sub_route) => {
    setAnchorEl(null)
    navigate(`${props.value}/${sub_route}`)
    props.setTabValue(props.value)
  }

  return (
    <>
      <Tab label={props.label}
        id='id_menu'
        aria-controls="aria_menu"
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined} />
      <Menu
        id="aria_menu"
        anchorEl={anchorEl}
        open={open}
        onClose={justClose}
        TransitionComponent={Fade}>
        {props.items.map((item) => {  
          return (
            <MenuItem 
              onClick={() => { handleClose(item.sub_route) }} key={item.label}>
              {item.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
  
}

export default MenuTab;