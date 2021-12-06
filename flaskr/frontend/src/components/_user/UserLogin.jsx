import { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import axios from 'axios'
import {
  Typography, Button, Grid, TextField, Container, Alert, Fade
} from '@mui/material'

import { TokenContext, UserContext } from '../tools/contexts'

const UserLogin = () => {

  const [uName, setUName] = useState('')
  const [uPass, setUPass] = useState('')
  const [loginState, setLoginState] = useState('')

  const { setUser } = useContext(UserContext)
  const { setToken } = useContext(TokenContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleUName = e => {
    setUName(e.target.value)
  }

  const handleUPass = e => {
    setUPass(e.target.value)
  }

  const handleLogin = async e => {
    e.preventDefault()

    const path = location.pathname === '/login' ? -1 : location.pathname

    try {
      const res = await axios.post(
        'http://localhost:5000/api-v1/users/signin',
        {
          'username': uName,
          'password': uPass
        }
      )
      console.log(res.data)
      if (res.data['user']['token']) {
        const full_name = `${res.data['user']['first_name']} ${res.data['user']['last_name']}`
        setUser(full_name)
        setToken({ 'token': res.data['user']['token'] })
      } else {
        setUName('')
        setUPass('')
        setLoginState(res.data['msg'])
        setTimeout(() => {
          setLoginState('')
        }, 2500);
      }
    }
    catch (error) {
      console.log(error)
    }
    navigate(path, { replace: true })
  }

  return (
    <Container>
      <Grid container spacing={3} margin={0} >
        <Grid item xs={12}>
          <Typography variant='h3' color='primary'>User Login</Typography>
        </Grid>
        <Grid item >
          <Fade in={Boolean(loginState)} timeout={1000}>
            <Alert severity='warning' variant='outlined'>
              {loginState}
            </Alert>
          </Fade>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='uName'
            label='Username'
            value={uName}
            onChange={handleUName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='uPass'
            label='Password'
            type='password'
            value={uPass}
            onChange={handleUPass}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={handleLogin}>
            Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserLogin;