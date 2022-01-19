import { useState } from 'react'
import {
  Container, Grid, Snackbar, Alert
} from '@mui/material'

import EditCreditCards from './EditCreditCards'
import EditAnswers from './EditAnswers'

const AnswersSettings = () => {

  const [openSB, setOpenSB] = useState(false)
  const [message, setMessage] = useState({ msg: '', vnt: '' })

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt });
    setOpenSB(true)
  }

  const handleClose = () => {
    setOpenSB(false)
  }


  return (
    <Container maxWidth='xl'>
      <Grid container spacing={1} margin={0} pt={3}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <Grid item md={6}>
          <EditCreditCards
            handleMessage={handleMessage}
          />
        </Grid>
        <Grid item md={6}>
          <EditAnswers
            handleMessage={handleMessage}
          />
        </Grid>
      </Grid>

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
    </Container>
  )
}

export default AnswersSettings;