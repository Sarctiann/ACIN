import { Fragment, useState } from 'react'
import {
  Grid, Typography, Paper, TextField, Button, Switch, FormControlLabel
} from '@mui/material'
import axios from 'axios'

import { api_url } from '../tools/routes'
import RDialog from '../tools/ReusableDialog'


const CreateUpdateOtherUser = (props) => {

  const {
    user, edit, setEdit, setUsersState, initialOtherUser,
    otherUserData, setOtherUserData, ...others
  } = props

  const handleChangeOtherUser = (e) => {
    const { name, value, checked } = e.target
    setOtherUserData({
      ...otherUserData,
      [name]: name !== 'is_admin' ? value : checked
    })
  }

  const [sameEmail, setSameEmail] = useState(true)
  const handleSameEmail = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      setOtherUserData({
        ...otherUserData,
        [name]: value
      })
      setSameEmail(
        otherUserData['confirm_email'] === value
      )
    } else {
      setOtherUserData({
        ...otherUserData,
        [name]: value
      })
      setSameEmail(
        otherUserData['email'] === value
      )
    }
  }

  const handleCreateOtherUser = () => {
    for (let [field, value] of Object.entries(otherUserData)) {
      if (value === '') {
        setUsersState({ msg: `Missing Value ${field}`, vnt: 'error' })
        setTimeout(() => {
          setUsersState({ msg: '', vnt: 'error' })
        }, 2500);
        return
      }
    }
    if (!sameEmail) {
      setUsersState({ msg: "Email doesn't match", vnt: 'error' })
      setTimeout(() => {
        setUsersState({ msg: '', vnt: 'error' })
      }, 2500);
      return
    }
    (async () => {
      try {
        const res = await axios.post(
          api_url + '/users/signup',
          otherUserData,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${user['token']}`
            }
          }
        )
        if (res.data['msg']) {
          setUsersState({ msg: res.data['msg'], vnt: 'success' })
          setOtherUserData(initialOtherUser)
          setTimeout(() => {
            setUsersState({ msg: '', vnt: 'success' })
          }, 2500)
        } else {
          setUsersState({ msg: res.data['err'], vnt: 'error' })
          setTimeout(() => {
            setUsersState({ msg: '', vnt: 'error' })
          }, 2500)
        }
      }
      catch (error) {
        console.log(error)
      }
    })()

    setTimeout(() => {
      setSameEmail(true)
    }, 500);
  }

  const handleUpdateOtherUser = () => {
    (async () => {
      try {
        const res = await axios.post(
          api_url + '/users/update-other-user',
          (({ email, username, first_name, last_name, is_admin }) => (
            { email, username, first_name, last_name, is_admin }
          ))(otherUserData),
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${user['token']}`
            }
          }
        )
        if (res.data['msg']) {
          setUsersState({ msg: res.data['msg'], vnt: 'success' })
          setTimeout(() => {
            setUsersState({ msg: '', vnt: 'success' })
          }, 2500)
        } else {
          setUsersState({ msg: res.data['err'], vnt: 'error' })
          setTimeout(() => {
            setUsersState({ msg: '', vnt: 'error' })
          }, 2500)
        }
      }
      catch (error) {
        console.log(error)
      }
    })()
    setOtherUserData(initialOtherUser)
    setEdit(false)
  }

  const handleCancelEditUser = () => {
    setOtherUserData(initialOtherUser)
    setEdit(false)
    setSameEmail(true)
  }

  return (
    <Fragment {...others}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3}>
          <Grid container spacing={2} margin={0} px={{ xs: 0, md: 3 }}>
            <Grid item>
              <Typography variant="h6" color="primary">
                Update/Create User Account
              </Typography>
            </Grid>
            {!edit ? <>
              <Grid item>
                <Paper elevation={1} sx={{
                  background: 'darkGray2',
                  display: 'inline-block'
                }}>
                  <Grid item pb={2}>
                    <TextField size='small' error={!sameEmail}
                      name='email'
                      label='Email (ID - immutable)'
                      value={otherUserData['email']}
                      onChange={handleSameEmail}
                    />
                  </Grid>
                  <Grid item>
                    <TextField size='small' error={!sameEmail}
                      name='confirm_email'
                      label='Confirm Email'
                      value={otherUserData['confirm_email']}
                      onChange={handleSameEmail}
                    />
                  </Grid>
                </Paper>
              </Grid>
            </> :
              <Grid item xs={12} mx={1}>
                <Typography variant='h6' color='GrayText'>
                  {otherUserData['email']}
                </Typography>
              </Grid>
            }
            <Grid item>
              <TextField size='small'
                name='username'
                label='Username'
                value={otherUserData['username']}
                onChange={handleChangeOtherUser}
              />
            </Grid>
            <Grid item mb={0}>
              <FormControlLabel control={
                <Switch
                  name='is_admin'
                  checked={otherUserData['is_admin']}
                  onChange={handleChangeOtherUser}
                />
              }
                label='Is Admin'
              />
            </Grid>
            <Grid item>
              <TextField size='small'
                name='first_name'
                label='Fisrs Name'
                value={otherUserData['first_name']}
                onChange={handleChangeOtherUser}
              />
            </Grid>
            <Grid item>
              <TextField size='small'
                name='last_name'
                label='Last Name'
                value={otherUserData['last_name']}
                onChange={handleChangeOtherUser}
              />
            </Grid>
            <Grid item>
              <Grid container columns={2} sx={{ alignItems: 'flex-end' }}>
                {edit ? <>
                  <Grid item pl={2} pb={2}>
                    <Button variant="contained" color="error"
                      onClick={handleCancelEditUser}
                    >
                      CANCEL
                    </Button>
                  </Grid>
                  <RDialog title='Update Other User'
                    message='Confirm user update?' color='secondary'
                    confirmText='UPDATE' action={handleUpdateOtherUser}
                  >
                    <Grid item pl={2} pb={2}>
                      <Button variant="contained" color="warning">
                        UPDATE
                      </Button>
                    </Grid>
                  </RDialog>
                </> : <>
                  <Grid item pb={2}>
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
                  <Grid item px={2} pb={2}>
                    <Button variant="contained" color="success"
                      onClick={handleCreateOtherUser}
                    >
                      CREATE
                    </Button>
                  </Grid>
                </>}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  )
}

export default CreateUpdateOtherUser