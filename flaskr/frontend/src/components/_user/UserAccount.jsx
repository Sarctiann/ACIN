import { useContext, useEffect, useState } from 'react'
import {
  Container, Grid, Typography, Paper, TextField, Button, Switch,
  ListItem, ListItemButton, IconButton, ListItemText, FormControlLabel
} from '@mui/material'
import { Delete } from '@mui/icons-material'
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

const getUsers = async (user, setUsersData) => {
  try {
    const res = await axios.get(
      'http://localhost:5000/api-v1/users/get-users',
      {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${user['token']}`
        }
      }
    )
    setUsersData(res.data)
  }
  catch (error) {
    console.log(error)
  }
}

const UserAccount = () => {

  const { user } = useContext(UserContext)

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
  const [usersData, setUsersData] = useState([])
  const [otherUserData, setOtherUserData] = useState({
    username: '',
    password: '',
    email: '',
    confirm_email: '',
    first_name: '',
    last_name: '',
    is_admin: false
  })

  useEffect(() => {
    getUserData(user, setUserData)
    getUsers(user, setUsersData)
  }, [user])

  const handleChangeUser = (e) => {
    const { id, value, checked } = e.target
    setUserData({
      ...userData,
      [id]: id !== 'is_admin' ? value : checked
    })
  }

  const [samePassword, setSamePassword] = useState(true)
  const handleSamePassword = (e) => {
    const { id, value } = e.target
    if (id === 'new_password') {
      setUserData({
        ...userData,
        [id]: value
      })
      setSamePassword(
        userData['confirm_new_password'] === value
      )
    } else {
      setUserData({
        ...userData,
        [id]: value
      })
      setSamePassword(
        userData['new_password'] === value
      )
    }
  }

  const handleChangeOtherUser = (e) => {
    const { id, value, checked } = e.target
    setOtherUserData({
      ...otherUserData,
      [id]: id !== 'is_admin' ? value : checked
    })
  }

  const [sameEmail, setSameEmail] = useState(true)
  const handleSameEmail = (e) => {
    const { id, value } = e.target
    if (id === 'email') {
      setOtherUserData({
        ...otherUserData,
        [id]: value
      })
      setSameEmail(
        otherUserData['confirm_email'] === value
      )
    } else {
      setOtherUserData({
        ...otherUserData,
        [id]: value
      })
      setSameEmail(
        otherUserData['email'] === value
      )
    }
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    console.log(userData)
  }

  const [edit, setEdit] = useState(false)
  const handleUpdateOtherUser = (e) => {
    e.preventDefault()
    console.log(otherUserData)
    setEdit(false)
  }

  const handleEditUser = (e) => {
    console.log('Edit Me')
    setEdit(true)
  }

  const handleCancelEditUser = (e) => {
    setEdit(false)
  }

  const handleDeleteUser = (e) => {
    console.log('Delete Me')
  }

  return (
    <> {userData && otherUserData &&
      <Container maxWidth='xl'>
        <Grid item xs={12}>
          <Typography variant="h3" color="secondary">User Account</Typography>
        </Grid>
        <Grid container spacing={3}>

          {/* UPDATE CURRENT USER ACCOUNT */}

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
                    id='username'
                    label='Username'
                    value={userData['username']}
                    onChange={handleChangeUser}
                  />
                </Grid>
                <Grid item mb={0}>
                  <FormControlLabel control={
                    <Switch
                      id='is_admin'
                      checked={userData['is_admin']}
                      onChange={handleChangeUser}
                    />
                  }
                    label='Is Admin'
                  />
                </Grid>
                <Grid item>
                  <TextField size='small'
                    id='first_name'
                    label='First Name'
                    value={userData['first_name']}
                    onChange={handleChangeUser}
                  />
                </Grid>
                <Grid item>
                  <TextField size='small'
                    id='last_name'
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
                        id='new_password'
                        label='New Password'
                        type='password'
                        value={userData['new_password']}
                        onChange={handleSamePassword}
                      />
                    </Grid>
                    <Grid item>
                      <TextField size='small' error={!samePassword}
                        id='confirm_new_password'
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
                        id='password'
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

          {/* LIST OF ACTIVE USERS (ADMIN) */}

          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <Grid container spacing={2} margin={0} p={{ xs: 0, md: 3 }}>
                <Grid item>
                  <Typography variant="h6" color="primary">
                    List of Active Users
                  </Typography>
                </Grid>
                {usersData.map((user) => {
                  return (
                    <ListItem key={user['username']} secondaryAction={
                      <IconButton edge='end' onClick={handleDeleteUser}>
                        <Delete fontSize='large' color='error' />
                      </IconButton>
                    }>
                      <ListItemButton onClick={handleEditUser}>
                        <ListItemText
                          primary={
              `${user['username']} - ${user['first_name']} ${user['last_name']}`
                          }
                          secondary={user['email']}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </Grid>
            </Paper>
          </Grid>

          {/* USERS FORM TO UPDATE AND CREATE (ADMIN) */}

          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <Grid container spacing={2} margin={0} p={{ xs: 0, md: 3 }}>
                <Grid item>
                  <Typography variant="h6" color="primary">
                    Update My User Account
                  </Typography>
                </Grid>
                {!edit && <>
                  <Grid item>
                    <Paper elevation={1} sx={{
                      background: 'darkGray2',
                      display: 'inline-block'
                    }}>
                      <Grid item pb={2}>
                        <TextField size='small' error={!sameEmail}
                          id='email'
                          label='Email (ID - immutable)'
                          value={otherUserData['email']}
                          onChange={handleSameEmail}
                        />
                      </Grid>
                      <Grid item>
                        <TextField size='small' error={!sameEmail}
                          id='confirm_email'
                          label='Confirm Email'
                          value={otherUserData['confirm_email']}
                          onChange={handleSameEmail}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                </>}
                <Grid item>
                  <TextField size='small'
                    id='username'
                    label='Username'
                    value={otherUserData['username']}
                    onChange={handleChangeOtherUser}
                  />
                </Grid>
                <Grid item mb={0}>
                  <FormControlLabel control={
                    <Switch
                      id='is_admin'
                      checked={otherUserData['is_admin']}
                      onChange={handleChangeOtherUser}
                    />
                  }
                    label='Is Admin'
                  />
                </Grid>
                <Grid item>
                  <TextField size='small'
                    id='first_name'
                    label='Fisrs Name'
                    value={otherUserData['first_name']}
                    onChange={handleChangeOtherUser}
                  />
                </Grid>
                <Grid item>
                  <TextField size='small'
                    id='last_name'
                    label='Last Name'
                    value={otherUserData['last_name']}
                    onChange={handleChangeOtherUser}
                  />
                </Grid>


                <Grid item>
                  <Grid container columns={2} sx={{ alignItems: 'flex-end' }}>


                    {
                      edit ?
                        <>
                          <Grid item pl={2} pb={2}>
                            <Button variant="contained" color="error"
                              onClick={handleCancelEditUser}
                            >
                              CANCEL
                            </Button>
                          </Grid>
                          <Grid item pl={2} pb={2}>
                            <Button variant="contained" color="warning"
                              onClick={handleUpdateOtherUser}
                            >
                              UPDATE
                            </Button>
                          </Grid>
                        </>
                        :
                        <>
                          <Grid item>
                            <Paper elevation={1} sx={{
                              maxWidth: '230px',
                              background: 'darkGray2',
                              display: 'inline-block'
                            }}>
                              <Grid item p={2}>
                                <Typography variant="body1"
                                  color="warning.main"
                                >
                                  By default the password will be "abc123"
                                  the user must change it later
                                </Typography>
                              </Grid>
                            </Paper>
                          </Grid>
                          <Grid item px={2} py={2}>
                            <Button variant="contained" color="success"
                              onClick={handleUpdateOtherUser}
                            >
                              CREATE
                            </Button>
                          </Grid>
                        </>
                    }

                  </Grid>
                </Grid>

              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </Container >
    } </>
  )
}

export default UserAccount;