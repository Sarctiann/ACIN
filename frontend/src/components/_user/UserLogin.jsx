import { Typography, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router'


const UserLogin = (props) => {

  const navigate = useNavigate()
  const location = useLocation()

  const { setToken } = props

  const handleLogin = (e) => {
    e.preventDefault()
    try {
      setToken({"token":"123"})
      console.log('OK')
    }
    catch(error) {
      console.log(error)
    }
    navigate(location.pathname, {replace:true})
  }

  return (
    <>
    <Typography variant="h1" color="primary">User Login</Typography>
    <Button variant="contained" color="primary" onClick={handleLogin}>
      Login
    </Button>
    </>
  )
}

export default UserLogin;