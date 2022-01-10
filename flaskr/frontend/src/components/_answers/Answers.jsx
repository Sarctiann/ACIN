import { useState } from 'react'
import { Container, Grid, Snackbar, Alert, Typography } from '@mui/material'

const Settings = () => {

  const [openSB, setOpenSB] = useState(false)
  const [message, setMessage] = useState({ msg: '', vnt: '' })

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpenSB(true)
  }

  const handleClose = () => {
    setOpenSB(false)
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} margin={0} pt={3}>
        <Typography variant="h1" color="primary" onClick={
          () => handleMessage('On Development', 'info')
        }>
          🔧 Answers 🔨
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSB}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert variant='filled' color={message.vnt}>
            {message.msg}
          </Alert>
        </Snackbar>
      </Grid>
    </Container>
  )
}

export default Settings;