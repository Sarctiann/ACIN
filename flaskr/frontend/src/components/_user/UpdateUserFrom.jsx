import { Fragment, useContext, useEffect, useState } from 'react'
import {
  Grid, Typography, Paper, TextField, Button, Switch, FormControlLabel
} from '@mui/material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'


const getUserData = async (user, setUserData) => {
  try {
    const res = await axios.get(
      'http://localhost:5000/api-v1/users/get-user-data',
      {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${user['token']}`
        }
      }
    )
    setUserData({
      password: '',
      new_password: '',
      confirm_new_password: '',
      ...res.data
    })
  }
  catch (error) {
    console.log(error)
  }
}

const UpdateUserForm = (props) => {

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    new_password: '',
    confirm_new_password: '',
    email: '',
    first_name: '',
    last_name: '',
    is_admin: false
  })

  const { user } = useContext(UserContext)

  useEffect(() => {
    getUserData(user, setUserData)
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

  const handleUpdateUser = (e) => {
    e.preventDefault()
    console.log(userData)
  }


  return (
    <Fragment {...props}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3}>
          <Grid container spacing={2} margin={0} p={{ xs: 0, md: 3 }}>
            <Grid item>
              <Typography variant="h6" color="primary">
                Update My User Account
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
            <Grid item mb={0}>
              <FormControlLabel control={
                <Switch
                  name='is_admin'
                  checked={userData['is_admin']}
                  onChange={handleChangeUser}
                />
              }
                label='Is Admin'
              />
            </Grid>
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
                <Grid item px={2} pb={2}>
                  <Button variant="contained" color="warning"
                    onClick={handleUpdateUser}
                  >
                    UPDATE
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  )
}

export default UpdateUserForm