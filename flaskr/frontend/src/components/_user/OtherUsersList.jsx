import { Fragment, useEffect, useState } from 'react'
import {
  Grid, Typography, Paper, ListItem, ListItemButton, IconButton, ListItemText,
  Fade, Alert
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import axios from 'axios'

import { api_url } from '../tools/routes'
import RDialog from '../tools/ReusableDialog'


const OtherUsersList = (props) => {

  const { 
    user, setEdit, usersSate, setUsersState,
    initialOtherUser, setOtherUserData, ...others 
  } = props
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    const source = axios.CancelToken.source()
    if (user?.token) {
      (async () => {
        try {
          const res = await axios.get(
            api_url + '/users/get-users',
            {
              cancelToken: source.token,
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
      })()
    }
    return () => {
      source.cancel()
    }
  }, [user, usersSate])

  const handleEditUser = (user) => {
    setOtherUserData({ ...user })
    setEdit(true)
  }

  const handleDeleteUser = (email) => {
    (async () => {
      try {
        const res = await axios.post(
          api_url + '/users/delete-other-user',
          { email: email },
          {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${user['token']}`
            }
          }
          )
          if (res.data['msg']) {
            setUsersState({ msg: res.data['msg'], vnt: 'info' })
            setTimeout(() => {
              setUsersState({ msg: '', vnt: 'info' })
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
      setEdit(false)
      setOtherUserData(initialOtherUser)
    }

  return (
    <Fragment {...others}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3}>
          <Grid container spacing={2} margin={0} px={{ xs: 0, md: 3 }}>
            <Grid item>
              <Typography variant="h6" color="primary">
                List of Active Users
              </Typography>
            </Grid>
            {usersData.map((otherUser) => {
              return (
                <ListItem key={otherUser['username']} secondaryAction={
                  <RDialog title='Delete' message='Confirm user Delete?'
                    confirmText='DELETE' action={() => 
                      handleDeleteUser(otherUser['email'])
                    }
                  >
                    <IconButton edge='end'>
                      <Delete fontSize='large' color='error' />
                    </IconButton>
                  </RDialog>
                }>
                  <ListItemButton onClick={() => { handleEditUser(otherUser) }}>
                    <ListItemText
                      primary={[
                        `${otherUser['username']} -`,
                        otherUser['first_name'],
                        otherUser['last_name']
                      ].join(' ')}
                      secondary={otherUser['email']}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </Grid>
        </Paper>
          <Grid item pt={3}>
            <Fade in={Boolean(usersSate['msg'])} timeout={1000}>
              <Alert severity={usersSate['vnt']} variant='outlined'>
                {usersSate['msg']}
              </Alert>
            </Fade>
          </Grid>
      </Grid>
    </Fragment>
  )
}

export default OtherUsersList