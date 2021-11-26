import { Outlet } from 'react-router'
import Typography from '@mui/material/Typography'

const User = () => {
  return (
    <>
    <Typography variant="h6" color="secondary">User</Typography>
    <Outlet/>
    </>
  )
}

export default User;