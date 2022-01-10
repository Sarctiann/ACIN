import { useState, useContext } from 'react'
import {
  Grid, Paper, Box, Typography, TextField, InputAdornment, Button, Radio,
  FormControl, RadioGroup, FormControlLabel, Divider
} from '@mui/material'
import { LooksOne, LooksTwo, Looks3, Calculate } from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'

const Complete = (props) => {

  const { handleMessage, history, setHistory } = props
  const { user } = useContext(UserContext)
  const [fields, setFields] = useState({ first: '', second: '', third: '' })
  const [sign, setSign] = useState('pri')
  const [operation, setOperation] = useState('add')
  const [expression, setExpression] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields({ ...fields, [name]: value })
  }

  const handleSign = (e) => {
    const { value } = e.target
    setSign(value)
    setFields({ ...fields, first: '', third: '' })
  }

  const handleOperation = (e) => {
    const { value } = e.target
    setOperation(value)
    setFields({ ...fields, second: '' })
  }

  const handleExpressionChange = (e) => {
    const { value } = e.target
    setExpression(value)
  }

  const handleQuery = (url, data, to_set) => {
    for (let [field, value] of Object.entries(data)) {
      if (!value) {
        handleMessage(`The ${field} field is required`, 'error')
        return
      }
    }
    data = { ...data, sign: sign, operation: operation };
    (async () => {
      try {
        const res = await axios.post(
          api_url + url,
          data,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        if (res.data['result'] !== undefined) {
          handleMessage(`$${res.data.result}`, 'success')
          setHistory([
            {
              _id: { $date: new Date().getTime() },
              calculation: res.data.calculation,
              footnote: res.data.footnote
            },
            ...history
          ])
          setFields({ ...fields, [to_set]: res.data.result })
          if (!data.expression) {
            setExpression(res.data.result)
          }
        }
        if (res.data['err']) {
          handleMessage(res.data['err'], 'error')
        }
      }
      catch (error) {
        console.error(error)
      }
    })()
  }

  const handleGetFirst = () => {
    let dataset = { second: fields.second, third: fields.third }
    handleQuery('/calculator/get-first-term', dataset, 'first')
  }

  const handleGetSecond = () => {
    let dataset = { first: fields.first, third: fields.third }
    handleQuery('/calculator/get-second-term', dataset, 'second')
  }

  const handleGetThird = () => {
    let dataset = { first: fields.first, second: fields.second }
    handleQuery('/calculator/get-result', dataset, 'third')
  }

  const handleEvaluate = () => {
    handleQuery('/calculator/resolve-expression', { expression: expression })
  }

  const handleEnterOnFields = () => {

    if (fields.first === '' && fields.second !== '' && fields.third !== '') {
      handleGetFirst()
    } else if (
      fields.first !== '' && fields.second === '' && fields.third !== ''
    ) {
      handleGetSecond()
    } else if (
      fields.first !== '' && fields.second !== '' && fields.third === ''
    ) {
      handleGetThird()
    } else if (
      fields.first !== '' && fields.second !== '' && fields.third !== ''
    ) {
      handleMessage('impossible to know which operation to perform!', 'warning')
    } else {
      handleMessage('You must provide 2 fields at least!', 'warning')
    }
  }

  const handleClear = () => {
    setFields({ first: '', second: '', third: '' })
    setExpression('')
  }

  return (
    <Grid item xs={12} md={7}>
      <Paper elevation={5} sx={{ borderRadius: 3 }}>
        <Box sx={{ paddingBlockEnd: 2, minHeight: '65vh' }} p={2}>
          <Grid container spacing={3} align='center' pr={2}
            sx={{ minHeight: '60vh', overflow: 'auto' }}
          >
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: '100%' }} component='fieldset'>
                <RadioGroup name='sign'
                  value={sign} onChange={handleSign}
                >
                  <Paper>
                    <Grid item px={3}>
                      <FormControlLabel
                        value='pri'
                        control={<Radio />} label={
                          <Typography variant='h5' color='primary'>
                            $
                          </Typography>
                        } />
                      <FormControlLabel
                        value='per'
                        control={<Radio color='secondary' />} label={
                          <Typography variant='h5' color='secondary'>
                            %
                          </Typography>
                        } />
                    </Grid>
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: '100%' }} component='fieldset'>
                <RadioGroup name='operation'
                  value={operation} onChange={handleOperation}
                >
                  <Paper>
                    <Grid px={3}>
                      <FormControlLabel
                        value='add'
                        control={<Radio />} label={
                          <Typography variant='h4' color='primary'>
                            +
                          </Typography>
                        } />
                      <FormControlLabel
                        value='sub'
                        control={<Radio color='secondary' />} label={
                          <Typography variant='h4' color='secondary'>
                            -
                          </Typography>
                        } />
                    </Grid>
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}></Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size='small' type='number'
                label={sign === 'pri' ? 'Price' : 'Percentage'}
                InputProps={{
                  inputProps: { min: '0', step: '10' },
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='h5'
                      color={sign === 'pri' ? 'primary' : 'secondary'}
                    >
                      {sign === 'pri' ? '$' : ''}
                    </Typography>
                  </InputAdornment>,
                  endAdornment: <InputAdornment position='start'>
                    <Typography variant='h5' color='secondary'>
                      {sign === 'pri' ? '' : '%'}
                    </Typography>
                  </InputAdornment>
                }}

                name='first'
                value={fields.first}
                onChange={handleChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleEnterOnFields()
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label='day/month/year | Percentage'
                size='small' InputProps={{
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='h4'
                      color={operation === 'add' ? 'primary' : 'secondary'}
                    >
                      {operation === 'add' ? '+' : '-'}
                    </Typography>
                  </InputAdornment>,
                  endAdornment: <InputAdornment position='start'>
                    <Typography variant='h5' color='inherit'>
                      %
                    </Typography>
                  </InputAdornment>
                }}
                name='second'
                value={fields.second}
                onChange={handleChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleEnterOnFields()
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label='Result' type='number'
                size='small' InputProps={{
                  inputProps: { min: '0', step: '10' },
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='h5' color='inherit'>
                      {sign === 'pri' ? '= $' : '='}
                    </Typography>
                  </InputAdornment>,
                  endAdornment: <InputAdornment position='start'>
                    <Typography variant='h5' color='inherit'>
                      {sign === 'pri' ? '' : '%'}
                    </Typography>
                  </InputAdornment>
                }}
                name='third'
                value={fields.third}
                onChange={handleChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleEnterOnFields()
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleGetFirst} size='large'
                sx={{ minHeight: '100%' }}
                variant='contained' color='success'
                endIcon={<LooksOne />}
              >
                <Typography variant='body1'>
                  GET
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleGetSecond} size='large'
                sx={{ minHeight: '100%' }}
                variant='contained' color='success'
                endIcon={<LooksTwo />}
              >
                <Typography variant='body1'>
                  GET
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleGetThird} size='large'
                sx={{ minHeight: '100%' }}
                variant='contained' color='success'
                endIcon={<Looks3 />}
              >
                <Typography variant='body1'>
                  GET
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} py={2}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Evaluate Expression' size='small'
                name='expression' InputProps={{
                  style: { fontFamily: 'monospace', fontSize: 20 },
                  startAdornment: <InputAdornment position='start'>
                    <Typography variant='h4' color='primary'>
                      {'>>>'}
                    </Typography>
                  </InputAdornment>
                }}
                InputLabelProps={{
                  style: { fontFamily: 'monospace', fontSize: 20 }
                }}
                value={expression}
                onChange={handleExpressionChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleEvaluate()
                }}
              />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleClear} size='large'
                sx={{ minHeight: '100%' }}
                variant='contained' color='error'
                endIcon={<Calculate />}
              >
                <Typography variant='body1'>
                  Clear
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth onClick={handleEvaluate} size='large'
                sx={{ minHeight: '100%' }}
                variant='contained' color='primary'
                endIcon={<Calculate />}
              >
                <Typography variant='body1'>
                  Evaluate
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Complete