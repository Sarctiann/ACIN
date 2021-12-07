import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material'
import { Newspaper, Calculate, ViewList, Settings } from '@mui/icons-material'

import { routes, sub_routes } from './tools/routes'
import { UserContext } from './tools/contexts'
import MenuTab from './MenuTab'
import AvatarMenu from './AvatarMenu'



const Navbar = () => {

  const { user } = useContext(UserContext)
  const disabled = !Boolean(user)

  const location = useLocation()

  let currentTab = false;
  switch (`/${location.pathname.split('/')[1]}`) {
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
              component={Link} to={routes[0]} disabled={disabled} />

            <MenuTab value={routes[1]} label='Calculator' icon={<Calculate />}
              setTabValue={setTabValue} items={[
                { label: 'Complete Calculator', sub_route: sub_routes[0] },
                { label: 'Basic Calculator', sub_route: sub_routes[1] }
              ]} disabled={disabled} />

            <Tab value={routes[2]} label='Answers'
              icon={<ViewList />} iconPosition='start'
              component={Link} to={routes[2]} disabled={disabled} />

            <MenuTab value={routes[3]}
              label='Settings' icon={<Settings />}
              setTabValue={setTabValue} items={[
                { label: 'Answers Settings', sub_route: sub_routes[2] },
                { label: 'Calculator Settings', sub_route: sub_routes[3] },
                { label: 'Regexs Settings', sub_route: sub_routes[4] }
              ]} disabled={disabled} />

          </Tabs>

          <AvatarMenu disabled={disabled} />

        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
