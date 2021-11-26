import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material'
import { Newspaper, Calculate, ViewList, Settings } from '@mui/icons-material'

import MenuTab from './MenuTab'
import AvatarMenu from './AvatarMenu'

// Do not change the order of "routes" and "sub_routes", 
// append new ones (to the tail) to make the app grow.
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
  let currentTab = false;
  
  switch (location.pathname.split('/')[1]) {
    case routes[0]: 
      currentTab = routes[0]
      break;
    case routes[1]: 
      currentTab = routes[1]
      break;
    case routes[2]: 
      currentTab = routes[2]
      break;
    case routes[3]: 
      currentTab = routes[3]
      break;
    default:
      currentTab = false
      break;
  }

  const [tabValue, setTabValue] = useState(currentTab)

  const handleChange = (_, newValue) => {
    switch (newValue) {
      case routes[0]:
      case routes[2]:
        setTabValue(newValue)
        break;
      default:
        break;
    }
  }

  return (
    <>
      <AppBar position='sticky'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Tabs
            indicatorColor='primary'
            onChange={handleChange}
            value={tabValue}>

            <Tab value={routes[0]} label='News'
              icon={<Newspaper />} iconPosition='start'
              component={Link} to={routes[0]} />

            <MenuTab value={routes[1]} label='Calculator' icon={<Calculate />}
              setTabValue={setTabValue} items={[
                { label: 'Complete Calculator', sub_route: sub_routes[0] },
                { label: 'Basic Calculator', sub_route: sub_routes[1] }
              ]} />

            <Tab value={routes[2]} label='Answers'
              icon={<ViewList />} iconPosition='start'
              component={Link} to={routes[2]} />

            <MenuTab value={routes[3]}
              label='Settings' icon={<Settings />}
              setTabValue={setTabValue} items={[
                { label: 'Answers Settings', sub_route: sub_routes[2] },
                { label: 'Calculator Settings', sub_route: sub_routes[3] },
                { label: 'Regexs Settings', sub_route: sub_routes[4] }
              ]} />

          </Tabs>

          <AvatarMenu userName='Sebastián Atlántico' />

        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
