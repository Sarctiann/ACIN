import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconButton, Menu, MenuItem, Fade, Divider, ListItemIcon
} from '@mui/material'
import {
  Newspaper, Calculate, ViewList, Settings, ArrowForwardIos
} from '@mui/icons-material'
import { Menu as MI } from '@mui/icons-material'

import { routes, sub_routes } from './tools/routes'


const NavMenu = props => {

  const { setTabValue, disabled, user, ...others } = props

  const items = [
    { label: 'DIVIDER', icon: Newspaper, key: 0 },
    { label: 'News', route: routes[0] },
    { label: 'DIVIDER', icon: Calculate, key: 1 },
    { label: 'Calculators', route: `${routes[1]}` },
    { label: 'DIVIDER', icon: ViewList, key: 2 },
    { label: 'Answers', route: routes[2] },
    { label: 'DIVIDER', icon: Settings, key: 3 },
    { label: 'Answers Settings', route: `${routes[3]}/${sub_routes[0]}` }
  ]
  if (user?.is_admin) {
    items.push(
      { label: 'Calculator Settings', route: `${routes[3]}/${sub_routes[1]}` }
    )
  }
  items.push(
    { label: 'Regexs Settings', route: `${routes[3]}/${sub_routes[2]}` }
  )

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const justClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = (route) => {
    setAnchorEl(null)
    navigate(route)
    setTabValue(`/${route.split('/')[1]}`)
  }

  return (
    <>
      <IconButton aria-label="Go to..." onClick={handleClick} {...others}
        sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        disabled={disabled}
      >
        <MI />
      </IconButton>
      <Menu
        id="aria_menu"
        anchorEl={anchorEl}
        open={open}
        onClose={justClose}
        TransitionComponent={Fade}>
        {items.map((item) => {
          if (item.label === 'DIVIDER') {
            return (
              <Divider key={item.key} textAlign='right'>
                {<item.icon />}
              </Divider>
            )
          } else {
            return (
              <MenuItem
                onClick={() => { handleClose(item.route) }} key={item.label}>
                <ListItemIcon>
                  <ArrowForwardIos />
                </ListItemIcon>
                {item.label}
              </MenuItem>
            )
          }
        })}
      </Menu>
    </>
  )
}

export default NavMenu;