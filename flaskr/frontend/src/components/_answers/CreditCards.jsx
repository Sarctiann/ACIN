import { useState, useMemo } from 'react'
import {
  Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
  IconButton, TextField, InputAdornment, Grid, Box, Paper, Tooltip
} from '@mui/material'
import { ContentCopy } from '@mui/icons-material'

import strFormat from '../tools/strFormat'


const CustomCell = (props) => {

  const { children, sx, ...others } = props

  return (
    <TableCell align='center' sx={{ borderColor: '#FFFFFF', ...sx }}
      {...others}
    >
      {children}
    </TableCell>
  )
}

const CreditCards = (props) => {

  const { payMeths, sysRegex, handleMessage, priceRef } = props

  const [price, setPrice] = useState('')

  const paymentMethods = useMemo(() => {

    let last_card = ''
    let formatedPayMeths = []

    for (let meth of payMeths) {

      if (meth.card_name !== last_card) {
        last_card = meth.card_name
        formatedPayMeths.push({
          id: last_card,
          header: last_card
        })
      }
      const total = (
        parseFloat(price) * (1 + meth.increase / 100)
      ).toFixed() | 0
      const monthly = (total / meth.installments).toFixed()
      formatedPayMeths.push({
        id: meth._id.$oid,
        card_name: meth.card_name,
        installments: meth.installments,
        total: total,
        monthly: monthly,
        increase: meth.increase,
        pos_code: meth.pos_code,
        description: meth.description
      })
    }
    return formatedPayMeths
  }, [payMeths, price])

  const handleChangePrice = (e) => {
    setPrice(e.target.value)
  }


  const handleCopy = (item) => {

    (async () => {
      navigator.clipboard.writeText(
        strFormat(`${item.installments} ${item.monthly}`, sysRegex)
      )
    })()
    handleMessage('Text Copied to Clipboard', 'success')
  }

  return (
    <Grid item xs={12}>
      <Box sx={{ paddingBlockEnd: 2, height: '80vh' }}
        border={2} p={2} borderRadius={1} borderColor='primary.main'
      >
        <Grid container spacing={1} align='center' pr={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' color='primary.main'>
              Credit Cards Payments
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Price' size='small' autoFocus
              inputProps={{
                min: 0, step: 10
              }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>
                  <Typography variant='h6' color='primary'>
                    $
                  </Typography>
                </InputAdornment>
              }}
              inputRef={priceRef}
              type='number'
              value={price}
              onChange={handleChangePrice}
            />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ borderRadius: '15px 15px 0px 0px' }}>
              <Paper elevation={3} sx={{
                borderRadius: '15px 15px 0px 0px',
                backgroundColor: 'warning.dark',
                height: 40
              }}
              >
                <Typography variant="body1" color="initial" p={1}>
                  Card Name
                </Typography>
              </Paper>
              <TableContainer
                sx={{ height: { xs: '57vh', md: '60vh' } }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <CustomCell width='20%'>
                        Installments
                      </CustomCell>
                      <CustomCell width='20%'
                        sx={{ backgroundColor: 'error.dark' }}
                      >
                        Total
                      </CustomCell>
                      <CustomCell width='20%'
                        sx={{ backgroundColor: 'success.dark' }}
                      >
                        Monthly
                      </CustomCell>
                      <CustomCell width='20%'>
                        Increase
                      </CustomCell>
                      <CustomCell width='20%'>
                        PosCode
                      </CustomCell>
                      <CustomCell width='20%'>
                        Copy
                      </CustomCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentMethods.length > 0 ? paymentMethods.map(item => {
                      const component = item.header ? (
                        <TableRow key={item.header}>
                          <CustomCell width='100%' colSpan={6}
                            sx={{
                              borderRadius: '20px 20px 0px 0px',
                              backgroundColor: 'warning.dark'
                            }}
                          >
                            {item.header}
                          </CustomCell>
                        </TableRow>
                      ) : (
                        <Tooltip key={item.id}
                          title={item.description} disableInteractive
                          placement='right' arrow followCursor
                        >
                          <TableRow hover>
                            <CustomCell>
                              {item.installments}
                            </CustomCell>
                            <CustomCell
                              sx={{ backgroundColor: 'error.dark' }}
                            >
                              ${item.total}
                            </CustomCell>
                            <CustomCell
                              sx={{ backgroundColor: 'success.dark' }}
                            >
                              ${item.monthly}
                            </CustomCell>
                            <CustomCell>
                              {item.increase}%
                            </CustomCell>
                            <CustomCell>
                              *{item.pos_code}*
                            </CustomCell>
                            <CustomCell>
                              <IconButton size='small' color='primary'
                                onClick={() => handleCopy(item)}
                              >
                                <ContentCopy fontSize='small' />
                              </IconButton>
                            </CustomCell>
                          </TableRow>
                        </Tooltip>
                      )
                      return component
                    }) :
                      <TableRow>
                        <TableCell colSpan={6} align='center'>
                          <Typography variant='h4' color='primary'>
                            Loading...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default CreditCards
