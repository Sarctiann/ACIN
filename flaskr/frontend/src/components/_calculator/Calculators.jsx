import { useContext, useEffect, useState } from 'react'
import {
  Container, Grid, Snackbar, Alert, FormControlLabel, Switch, Typography
} from '@mui/material'
import axios from 'axios'

import Complete from './Complete'
import Basic from './Basic'
import CalcHistory from './CalcHistory'
import { api_url } from '../tools/routes'
import { UserContext } from '../tools/contexts'

const Calculator = () => {

  const { user } = useContext(UserContext)
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [history, setHistory] = useState([])
  const [openSB, setOpenSB] = useState(false)
  const [basic, setBasic] = useState(true)

  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      const res = await axios.get(
        api_url + '/calculator/get-history',
        {
          cancelToken: source.token,
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      if (res.data['hist']) {
        setHistory(res.data['hist'])
      }
      if (res.data['msg']) {
        // console.warn(res.data['msg'])
      }
      if (res.data['err']) {
        console.error(res.data['err'])
      }
    })()
    return () => {
      source.cancel()
    }
  }, [user, setHistory])

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpenSB(true)
  }

  const handleBasic = (e) => {
    const { checked } = e.target
    setBasic(checked)
  }

  const handleClose = () => {
    setOpenSB(false)
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} margin={0} pt={3}>
        <Grid item xs={12}>
          <FormControlLabel labelPlacement='start'
            label={
              <Typography px={1}>
                Calculator
              </Typography>
            }
            control={
              <FormControlLabel
                control={<Switch checked={basic} onChange={handleBasic} />}
                label="Basic"
              />
            }
          />
        </Grid>
        {basic
          ?
          <Basic
            history={history}
            setHistory={setHistory}
            handleMessage={handleMessage}
          />
          :
          <Complete
            history={history}
            setHistory={setHistory}
            handleMessage={handleMessage}
          />
        }
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