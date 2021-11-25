import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material'

import MenuTab from './MenuTab'

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

  const [tabValue, setTabValue] = useState(
    location.pathname !== '/' ? `/${location.pathname.split('/')[1]}` : false
  )

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
        <Toolbar>
          <Tabs
            indicatorColor='primary'
            onChange={handleChange}
            value={tabValue}>

            <Tab value={routes[0]} label='News'
              component={Link} to={routes[0]} />

            <MenuTab value={routes[1]} label='Calculator' 
             setTabValue={setTabValue} items={[
              { label:'Complete Calculator', sub_route: sub_routes[0]},
              { label:'Basic Calculator', sub_route: sub_routes[1]}
             ]} />

            <Tab value={routes[2]} label='Answers'
              component={Link} to={routes[2]} />

            <MenuTab value={routes[3]} label='Settings' 
             setTabValue={setTabValue} items={[
              { label:'Answers Settings', sub_route: sub_routes[2]},
              { label:'Calculator Settings', sub_route: sub_routes[3]},
              { label:'Regexs Settings', sub_route: sub_routes[4]}
             ]} />

          </Tabs>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
