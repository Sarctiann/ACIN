import { useState, useContext } from 'react'
import {
  Grid, Paper, Box, Typography, TextField, InputAdornment, Button
} from '@mui/material'
import { Calculate } from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'

const Basic = (props) => {

  const { handleMessage, history, setHistory } = props
  const { user } = useContext(UserContext)
  const [fields, setFields] = useState({ price: '', str_date: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields({ ...fields, [name]: value })
  }

  const handleGetPrice = () => {
    for (let [field, value] of Object.entries(fields)) {
      if (!value) {
        handleMessage(`The ${field} field is required`, 'error')
        return
      }
    }
    (async () => {
      try {
        const res = await axios.post(
          api_url + '/calculator/price-add-percent',
          {
            ...fields,
            str_date: fields.str_date.split('-').reverse().join('/')
          },
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        if (res.data['result'] !== undefined) {
          setHistory([
            {
              _id: { $date: new Date().getTime() },
              calculation: res.data.calculation,
              footnote: res.data.footnote
            },
            ...history
          ]);
          (async () => {navigator.clipboard.writeText(`$${res.data.result}`)})()
          handleMessage(`$${res.data.result} Copied`, 'success')
        }
        if (res.data['err']) {
          handleMessage(res.data.err, 'error')
        }
      }
      catch (error) {
        console.error(error)
      }
    })()
  }

  return (
    <Grid item xs={12} md={7}>
      <Paper elevation={5} sx={{ borderRadius: 3 }}>
        <Box sx={{ paddingBlockEnd: 2, minHeight: '30vh' }} p={2}>
          <Grid container spacing={3} align='center' pr={2}
            sx={{ minHeight: '25vh', overflow: 'auto' }}
          >
            <Grid item xs={12}>
              <Typography variant='h5' color='initial'>
                basic calculator
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label='Price'
                type='number'
                name='price'
                InputProps={{
                  inputProps: { min: '0', step: '10' },
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='h5' color='primary'>
                      $
                    </Typography>
                  </InputAdornment>
                }}
                value={fields.price}
                onChange={handleChange}
                onKeyPress={
                  e => { if (e.key === 'Enter') { handleGetPrice() } }
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label='Date' type='date'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='body1' color='primary'>
                      from
                    </Typography>
                  </InputAdornment>
                }}
                name='str_date'
                value={fields.str_date}
                onChange={handleChange}
                onKeyPress={
                  e => { if (e.key === 'Enter') { handleGetPrice() } }
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleGetPrice} size='large'
                sx={{ minHeight: '75%' }}
                variant='contained' color='success' endIcon={<Calculate />}
              >
                <Typography variant='body1'>
                  GET PRICE
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Basic