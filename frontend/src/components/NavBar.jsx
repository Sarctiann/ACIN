import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Tabs, Tab, Menu, MenuItem, Fade } from '@mui/material'

export const routes = [
  '/news', 
  '/calculator', 
  '/answers', 
  '/settings',
]

export const sub_routes = [  
  'complete', 
  'basic', 
  'answers', 
  'calculator', 
  'regexs'
]

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [tabValue, setTabValue] = useState(
    location.pathname !== '/' ? `/${location.pathname.split('/')[1]}` : false
    )
  const [anchorEl, setAnchorEl] = useState([null,null])
  const open = [Boolean(anchorEl[0]), Boolean(anchorEl[1])]
    
  const handleChange = (_, newValue) => {
    if (newValue !== routes[3] && newValue !== routes[1]) {
      setTabValue(newValue)
    }
  }
  
  const justClose = () => {
    setAnchorEl([null,null])
  }

  const handleClickC = (e) => {
    setAnchorEl([e.currentTarget, null])
  }
  
  const handleCloseC = (path) => {
    setAnchorEl([null,null])
    navigate(`${routes[1]}/${path}`)
    setTabValue(routes[1])
  }

  const handleClickS = (e) => {
    setAnchorEl([null, e.currentTarget])
  }
  
  const handleCloseS = (path) => {
    setAnchorEl([null,null])
    navigate(`${routes[3]}/${path}`)
    setTabValue(routes[3])
  }

  return (
    <>
      <AppBar position='sticky'>
        <Toolbar>
          <Tabs
            indicatorColor='primary'
            onChange={handleChange}
            value={tabValue}>
            
            <Tab value={routes[0]} label='News' 
              component={Link} to={routes[0]}/>
            
            <Tab value={routes[1]} label='Calculator' 
              id='fade-calculator' 
              aria-controls="calculator-menu" 
              onClick={handleClickC}
              aria-haspopup="true" 
              aria-expanded={open[0] ? 'true' : undefined} />
            
            <Tab value={routes[2]} label='Answers'  
              component={Link} to={routes[2]}/>
            
            <Tab value={routes[3]} label='Settings' 
              id='fade-settings' 
              aria-controls="settings-menu" 
              onClick={handleClickS}
              aria-haspopup="true" 
              aria-expanded={open[1] ? 'true' : undefined} />
          
          </Tabs>
        </Toolbar>
      </AppBar>

      <Menu
        id="calculator-menu"
        MenuListProps={{'aria-labelledby': 'fade-calculator'}}
        anchorEl={anchorEl[0]}
        open={open[0]}
        onClose={justClose}
        TransitionComponent={Fade}>
        <MenuItem onClick={()=>{handleCloseC(sub_routes[0])}}>
          Complete Calculator
        </MenuItem>
        <MenuItem onClick={()=>{handleCloseC(sub_routes[1])}}>
          Basic Calculator
        </MenuItem>
      </Menu>

      <Menu
        id="settings-menu"
        MenuListProps={{'aria-labelledby': 'fade-settings'}}
        anchorEl={anchorEl[1]}
        open={open[1]}
        onClose={justClose}
        TransitionComponent={Fade}>
        <MenuItem onClick={()=>{handleCloseS(sub_routes[2])}}>
          Answers
        </MenuItem>
        <MenuItem onClick={()=>{handleCloseS(sub_routes[3])}}>
          Calculator
        </MenuItem>
        <MenuItem onClick={()=>{handleCloseS(sub_routes[4])}}>
          Regexs
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;
