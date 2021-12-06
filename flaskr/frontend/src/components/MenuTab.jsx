import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab, Menu, MenuItem, Fade } from '@mui/material'

const MenuTab = (props) => {

  const { value, items, setTabValue, icon, label, disabled, ...others } = props

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
    navigate(`${value}/${sub_route}`)
    setTabValue(value)
  }

  return (
    <>
      <Tab label={label} {...others}
        icon={icon} iconPosition='start'
        id='id_menu'
        aria-controls="aria_menu"
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined} disabled={disabled} />
      <Menu
        id="aria_menu"
        anchorEl={anchorEl}
        open={open}
        onClose={justClose}
        TransitionComponent={Fade}>
        {items.map((item) => {
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