import { useContext, useState } from 'react'
import {
  Container, Grid, Typography,
} from '@mui/material'

import { UserContext } from '../tools/contexts'
import UpdateUserForm from './UpdateUserFrom'
import UserOptions from './UserOptions'
import OtherUsersList from './OtherUsersList'
import CreateUpdateOtherUser from './CreateUpdateOtherUser'


const UserAccount = () => {

  const { user, setUser } = useContext(UserContext)

  const initialOtherUser = {
    username: '',
    email: '',
    confirm_email: '',
    first_name: '',
    last_name: '',
    is_admin: false
  }

  const [edit, setEdit] = useState(false)
  const [otherUserData, setOtherUserData] = useState(initialOtherUser)
  const [usersSate, setUsersState] = useState({ msg: '', vnt: 'success' })

  const displayAdmin = user.is_admin ? 'block' : 'none'
  const displayNoAdmin = user.is_admin ? 'none' : 'block'

  return (
    <Container maxWidth='xl'>
      <Grid item xs={12}>
        <Typography variant="h3" color="secondary">User Account</Typography>
      </Grid>
      <Grid container spacing={2}>

        <Grid item xs={12} md={4} sx={{ display: displayAdmin }}>
          <UpdateUserForm
            user={user}
            setUser={setUser}
          />
          <Grid item mt={2}> </Grid>
          <UserOptions />
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: displayNoAdmin }}>
          <UpdateUserForm
            user={user}
            setUser={setUser}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: displayNoAdmin }} >
          <UserOptions />
        </Grid>

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