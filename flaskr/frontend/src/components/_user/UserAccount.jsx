import { useContext, useState } from 'react'
import {
  Container, Grid, Typography,
} from '@mui/material'

import { UserContext } from '../tools/contexts'
import UpdateUserForm from './UpdateUserFrom'
import OtherUsersList from './OtherUsersList'
import CreateUpdateOtherUser from './CreateUpdateOtherUser'


const UserAccount = () => {

  const { user, setUser } = useContext(UserContext)

  const initialOtherUser = {
    username: '',
    password: '',
    email: '',
    confirm_email: '',
    first_name: '',
    last_name: '',
    is_admin: false
  }

  const [edit, setEdit] = useState(false)
  const [otherUserData, setOtherUserData] = useState(initialOtherUser)
  const [usersSate, setUsersState] = useState({ msg: '', vnt: 'success' })

  return (
    <Container maxWidth='xl'>
      <Grid item xs={12}>
        <Typography variant="h3" color="secondary">User Account</Typography>
      </Grid>
      <Grid container spacing={3}>

        <UpdateUserForm 
          user={user}
          setUser={setUser}
        />

        {user.is_admin && <>
          <OtherUsersList
            user={user}
            setEdit={setEdit}
            usersSate={usersSate} 
            setUsersState={setUsersState}
            initialOtherUser={initialOtherUser}
            setOtherUserData={setOtherUserData}
            />

          <CreateUpdateOtherUser
            user={user}
            edit={edit}
            setEdit={setEdit} 
            setUsersState={setUsersState}
            initialOtherUser={initialOtherUser}
            otherUserData={otherUserData}
            setOtherUserData={setOtherUserData}
          />
        </>}

      </Grid>
    </Container >
  )
}

export default UserAccount;