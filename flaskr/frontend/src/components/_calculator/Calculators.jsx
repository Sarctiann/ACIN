import { useState } from 'react'
import {
  Container, Grid, Snackbar, Alert, FormControlLabel, Switch
} from '@mui/material'

import Complete from './Complete'
import Basic from './Basic'
import CalcHistory from './CalcHistory'

const Calculator = () => {

  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [history, setHistory] = useState([])
  const [openSB, setOpenSB] = useState(false)

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpenSB(true)
  }

  const calcProps = {
    handleMessage: handleMessage,
    history: history,
    setHistory: setHistory,
  }

  const calcType = {
    complete: <Complete {...calcProps} />,
    basic: <Basic {...calcProps} />
  }
  const [calculator, setCalculator] = useState(calcType.complete)

  const handleCalculator = (e) => {
    const { checked } = e.target
    if (checked) {
      setCalculator(calcType.basic)
    } else {
      setCalculator(calcType.complete)
    }
  }

  const handleClose = () => {
    setOpenSB(false)
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} margin={0} pt={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch onChange={handleCalculator} />}
            label="Basic"
          />
        </Grid>
        {calculator}
        <CalcHistory history={history} setHistory={setHistory} />
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

export default Calculator;