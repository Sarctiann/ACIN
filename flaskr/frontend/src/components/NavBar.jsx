import { useState, useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Tabs, Tab, Badge } from '@mui/material'
import { Newspaper, Calculate, ViewList, Settings } from '@mui/icons-material'

import { routes, sub_routes } from './tools/routes'
import { AuthContext, UserContext, PostContext } from './tools/contexts'
import MenuTab from './MenuTab'
import AvatarMenu from './AvatarMenu'
import NavMenu from './NavMenu'



const Navbar = () => {

  const { auth } = useContext(AuthContext)
  const { user } = useContext(UserContext)
  const { fetchedPosts } = useContext(PostContext)
  const disabled = !Boolean(auth)

  const location = useLocation()

  let currentTab
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
  const [count, setCount] = useState(0)

  const handleChange = (_, newValue) => {
    switch (newValue) {
      case routes[0]:
      case routes[1]:
      case routes[2]:
        setTabValue(newValue)
        break;
      default:
        break;
    }
  }

  const newPosts = useMemo(() => {

    const length = fetchedPosts.length
    if (tabValue === routes[0]) {
      setCount(length)
    }

    return length - count
  }, [fetchedPosts.length, count, tabValue])

  const items = [
    { label: 'Answers Settings', sub_route: sub_routes[0] }
  ]
  if (user?.is_admin) {
    items.push(
      { label: 'Calculator Settings', sub_route: sub_routes[1] }
    )
  }
  items.push({ label: 'Expressions Settings', sub_route: sub_routes[2] })

  return (
    <>
      <AppBar position='sticky' color='default'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          <NavMenu setTabValue={setTabValue} disabled={disabled}
            user={user}
          />

          <Tabs sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}
            indicatorColor='primary'
            onChange={handleChange}
            value={tabValue}>

            <Tab value={routes[0]} label='News'
              icon={
                <Badge color='error' badgeContent={newPosts}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Newspaper />
                </Badge>
              } iconPosition='start'
              component={Link} to={routes[0]} disabled={disabled} />

            <Tab value={routes[1]} label='Calculators'
              icon={<Calculate />} iconPosition='start'
              component={Link} to={routes[1]} disabled={disabled} />

            <Tab value={routes[2]} label='Answers'
              icon={<ViewList />} iconPosition='start'
              component={Link} to={routes[2]} disabled={disabled} />

            <MenuTab value={routes[3]}
              label='Settings' icon={<Settings />}
              setTabValue={setTabValue} items={items} disabled={disabled} />

          </Tabs>

          <AvatarMenu setTabValue={setTabValue} disabled={disabled} />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
