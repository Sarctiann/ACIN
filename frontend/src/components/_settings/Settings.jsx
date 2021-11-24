import { Outlet } from 'react-router'
import Typography from '@mui/material/Typography'

const Settings = () => {
  return (
    <>
    <Typography variant="h3" color="secondary">Settings</Typography>
    <Outlet/>
    </>
  )
}

export default Settings;