import { useState } from 'react'
import {
  Container, Grid, Snackbar, Alert
} from '@mui/material';

import Posts from './Posts'
import FullPanel from './FullPanel'
import Filter from './Filter'
import CreatePost from './CreatePost'

const News = () => {

  const [severity, setSeverity] = useState('All')
  const [owner, setOwner] = useState('from All')
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const filter = {
    severity: severity,
    setSeverity: setSeverity,
    owner: owner,
    setOwner: setOwner
  }

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpen(true)
  }

  return (
    <Container maxWidth="xl">

      <Grid
        container spacing={1} margin={0} pt={3}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <FullPanel
          filter={filter}
          handleMessage={handleMessage}
        />
        <Posts
          filter={{ severity: severity, owner: owner }}
          handleMessage={handleMessage}
        />
      </Grid>

      <Grid
        container spacing={1} margin={0} pt={1}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <Filter
          filter={filter}
        />
        <Posts
          filter={{ severity: severity, owner: owner }}
          handleMessage={handleMessage}
        />
        <CreatePost
          handleMessage={handleMessage}
        />
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert variant='filled' color={message.vnt}>
          {message.msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default News;