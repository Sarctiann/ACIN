import { useState } from 'react'
import {
  Container, Grid, Typography,
} from '@mui/material'

import UpdateUserForm from './UpdateUserFrom'
import OtherUsersList from './OtherUsersList'
import CreateUpdateOtherUser from './CreateUpdateOtherUser'


const UserAccount = () => {

  const [edit, setEdit] = useState(false)
  const [otherUserData, setOtherUserData] = useState({
    username: '',
    password: '',
    email: '',
    confirm_email: '',
    first_name: '',
    last_name: '',
    is_admin: false
  })

  return (
    <Container maxWidth='xl'>
      <Grid item xs={12}>
        <Typography variant="h3" color="secondary">User Account</Typography>
      </Grid>
      <Grid container spacing={3}>
        <UpdateUserForm />
        
        <OtherUsersList 
          setEdit={setEdit} 
          setOtherUserData={setOtherUserData}
        />
        
        <CreateUpdateOtherUser 
          edit={edit}
          setEdit={setEdit}
          otherUserData={otherUserData}
          setOtherUserData={setOtherUserData}
        />

      </Grid>
    </Container >
  )
}

export default UserAccount;