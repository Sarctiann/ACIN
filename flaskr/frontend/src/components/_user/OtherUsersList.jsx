import { Fragment, useContext, useEffect, useState } from 'react'
import {
  Grid, Typography, Paper, ListItem, ListItemButton, IconButton, ListItemText
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'


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

const OtherUsersList = (props) => {

  const { setEdit, setOtherUserData, ...others } = props

  const { user } = useContext(UserContext)

  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    getUsers(user, setUsersData)
  }, [user])

  const handleEditUser = (e) => {
    console.log('Edit Me')
    setEdit(true)
  }

  const handleDeleteUser = (e) => {
    console.log('Delete Me')
  }

  return (
    <Fragment {...others}>
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
                      primary={[
                        `${user['username']} -`,
                        user['first_name'],
                        user['last_name']
                      ].join(' ')}
                      secondary={user['email']}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  )
}

export default OtherUsersList