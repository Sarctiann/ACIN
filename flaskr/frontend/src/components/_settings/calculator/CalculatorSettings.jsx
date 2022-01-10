import { useEffect, useState, useContext } from 'react'
import { Grid, Typography, Snackbar, Alert } from '@mui/material'
import axios from 'axios'

import { UserContext } from '../../tools/contexts'
import { api_url } from '../../tools/routes'
import NewItem from './NewItem'
import Lists from './Lists'
import Items from './Items'


const CalculatorSettings = () => {

  const { user } = useContext(UserContext)

  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [open, setOpen] = useState(false)

  const [dates, setDates] = useState([])
  const [lists, setLists] = useState([])
  const [hasChanged, setHasChanged] = useState(false)

  useEffect(() => {
    const source = axios.CancelToken.source();
    try {
      (async () => {
        const res = await axios.get(
          api_url + '/calculator/get-lists-data',
          {
            cancelToken: source.token,
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        if (res.data['dates']) {
          setDates(res.data.dates)
          setLists(res.data.lists)
        }
        if (res.data['err']) {
          console.error(res.data.err)
        }
      })()
    }
    catch (error) {
      console.error(error)
    }
    return () => {
      source.cancel()
    }
  }, [user])

  const handleClose = () => {
    setOpen(false)
  }

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpen(true)
  }

  return (
    <>
      {user?.is_admin ?
        <>
          <Grid item xs={12} md={6}>

            <NewItem
              dates={dates}
              setDates={setDates}
              setHasChanged={setHasChanged}
              handleMessage={handleMessage}
            />

            <Lists
              lists={lists}
              setLists={setLists}
              setDates={setDates}
              setHasChanged={setHasChanged}
              handleMessage={handleMessage}
            />

          </Grid>
          <Grid item xs={12} md={6}>

            <Items
              dates={dates}
              setDates={setDates}
              lists={lists}
              setLists={setLists}
              hasChanged={hasChanged}
              setHasChanged={setHasChanged}
              handleMessage={handleMessage}
            />

          </Grid>

        </>
        :
        <Grid item>
          <Typography variant='h3' color='error'>
            ⛔ This section is for admins only
          </Typography>
        </Grid>
      }
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
    </>
  )
}

export default CalculatorSettings;