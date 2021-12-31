import { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import axios from 'axios'
import {
  Typography, Button, Grid, TextField, Container, Alert, Fade
} from '@mui/material'

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'

const UserLogin = () => {

  const [uName, setUName] = useState('')
  const [uPass, setUPass] = useState('')
  const [loginState, setLoginState] = useState('')

  const { setUser } = useContext(UserContext)
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
      let res = await axios.post(
        api_url + '/users/signin',
        {
          'username': uName,
          'password': uPass
        }
      )
      if (res.data['user']) {
        setUser({ ...res.data['user'], username: uName })
      } else {
        setUName('')
        setUPass('')
        setLoginState(res.data['msg'])
        setTimeout(() => {
          setLoginState('')
        }, 2500);
      }
      // console.log(res.data['user'])
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
            onKeyPress={
              e => {if (e.key === 'Enter') {handleLogin(e)}}
            }
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