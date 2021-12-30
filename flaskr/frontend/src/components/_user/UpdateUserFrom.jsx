import { Fragment, useEffect, useState } from 'react'
import {
  Grid, Typography, Paper, TextField, Button, Switch, FormControlLabel,
  Fade, Alert
} from '@mui/material'
import axios from 'axios'

import { api_url } from '../tools/routes'
import RDialog from '../tools/ReusableDialog'


const UpdateUserForm = (props) => {

  const { user, setUser, ...others } = props

  const initialUser = {
    username: '',
    email: '',
    password: '',
    new_password: '',
    confirm_new_password: '',
    first_name: '',
    last_name: '',
    is_admin: false
  }
  const [userData, setUserData] = useState(initialUser)

  useEffect(() => {
    const source = axios.CancelToken.source()
    if (user?.token) {
      (async () => {
        try {
          const res = await axios.get(
            api_url + '/users/get-user-data',
            {
              cancelToken: source.token,
              headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${user['token']}`
              }
            }
          )
          setUserData({
            ...res.data,
            password: '',
            new_password: '',
            confirm_new_password: ''
          })
        }
        catch (error) {
          console.log(error)
        }
      })()
    }
    return () => {
      source.cancel()
    }
  }, [user])

  const handleChangeUser = (e) => {
    const { name, value, checked } = e.target
    setUserData({
      ...userData,
      [name]: name !== 'is_admin' ? value : checked
    })
  }

  const [samePassword, setSamePassword] = useState(true)
  const handleSamePassword = (e) => {
    const { name, value } = e.target
    if (name === 'new_password') {
      setUserData({
        ...userData,
        [name]: value
      })
      setSamePassword(
        userData['confirm_new_password'] === value
      )
    } else {
      setUserData({
        ...userData,
        [name]: value
      })
      setSamePassword(
        userData['new_password'] === value
      )
    }
  }

  const [updateState, setUpdateState] = useState({ msg: '', vnt: 'info' })
  const handleUpdateUser = () => {
    if (!samePassword) {
      setUpdateState({ msg: "new password doesn't match", vnt: 'error' })
      setTimeout(() => {
        setUpdateState({ msg: '', vnt: 'error' })
      }, 2500);
      return
    }

    (async () => {
      try {
        const res = await axios.post(
          api_url + '/users/update-user',
          userData,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${user['token']}`
            }
          }
        )
        if (res.data['msg']) {
          setUpdateState({ msg: res.data['msg'], vnt: 'success' })
          const resultUser = {
            ...user,
            username: userData['username'],
            first_name: userData['first_name'],
            last_name: userData['last_name'],
            is_admin: userData['is_admin']
          }
          setTimeout(() => {
            setUpdateState({ msg: '', vnt: 'success' })
          }, 2500)
          if (res.data['wrn']) {
            setTimeout(() => {
              setUpdateState({ msg: res.data['wrn'], vnt: 'warning' })
            }, 2600)
            setTimeout(() => {
              setUpdateState({ msg: '', vnt: 'warning' })
              setUser(resultUser)
            }, 5100)
          } else {
            setUser(resultUser)
          }
        } else {
          setUpdateState({ msg: res.data['err'], vnt: 'error' })
          setTimeout(() => {
            setUpdateState({ msg: '', vnt: 'error' })
          }, 2500)
        }
      }
      catch (error) {
        console.log(error)
      }
    })()

    setTimeout(() => {
      setSamePassword(true)
    }, 500);
  }


  return (
    <Fragment {...others}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3}>
          <Grid container spacing={2} margin={0} px={{ xs: 0, md: 3 }}>
            <Grid item>
              <Typography variant="h6" color="primary">
                Update My User Account
              </Typography>
            </Grid>
            <Grid item xs={12} mx={1}>
              <Typography variant='h6' color='GrayText'>
                {userData['email']}
              </Typography>
            </Grid>
            <Grid item>
              <TextField size='small'
                name='username'
                label='Username'
                value={userData['username']}
                onChange={handleChangeUser}
              />
            </Grid>
            {user['is_admin'] &&
              <Grid item mb={0}>
                <FormControlLabel control={
                  <Switch size='small'
                    name='is_admin'
                    checked={userData['is_admin']}
                    onChange={handleChangeUser}
                  />
                }
                  label='Is Admin'
                />
              </Grid>
            }
            <Grid item>
              <TextField size='small'
                name='first_name'
                label='First Name'
                value={userData['first_name']}
                onChange={handleChangeUser}
              />
            </Grid>
            <Grid item>
              <TextField size='small'
                name='last_name'
                label='Last Name'
                value={userData['last_name']}
                onChange={handleChangeUser}
              />
            </Grid>
            <Grid item>
              <Paper elevation={1} sx={{
                background: 'darkGray2',
                display: 'inline-block'
              }}>
                <Grid item pb={2}>
                  <TextField size='small' error={!samePassword}
                    name='new_password'
                    label='New Password'
                    type='password'
                    value={userData['new_password']}
                    onChange={handleSamePassword}
                  />
                </Grid>
                <Grid item>
                  <TextField size='small' error={!samePassword}
                    name='confirm_new_password'
                    label='Confirm New Password'
                    type='password'
                    value={userData['confirm_new_password']}
                    onChange={handleSamePassword}
                  />
                </Grid>
              </Paper>
              <Grid container columns={2} pt={2}>
                <Grid item pb={2}>
                  <TextField size='small' color='warning'
                    focused
                    name='password'
                    label='Password'
                    type='password'
                    value={userData['password']}
                    onChange={handleChangeUser}
                  />
                </Grid>
                <RDialog
                  title='Update User' message='Confirm user update?'
                  confirmText='UPDATE' action={handleUpdateUser}
                >
                  <Grid item px={2} pb={2}>
                    <Button variant="contained" color="warning">
                      UPDATE
                    </Button>
                  </Grid>
                </RDialog>
              </Grid>
              <Grid item pb={2}>
                <Fade in={Boolean(updateState['msg'])} timeout={1000}>
                  <Alert severity={updateState['vnt']} variant='outlined'>
                    {updateState['msg']}
                  </Alert>
                </Fade>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid >
    </Fragment >
  )
}

export default UpdateUserForm