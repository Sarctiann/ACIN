import { useState, useMemo } from 'react'
import {
  Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
  IconButton, TextField, Grid, Box, Paper
} from '@mui/material'
import { Done, Delete, Add, Edit, Cancel } from '@mui/icons-material'

import RDialog from '../../tools/ReusableDialog'
import { useAxiosEffect, useAxios } from '../../tools/axiosTool'


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

const EditCreditCards = (props) => {

  const { handleMessage } = props

  const [payMeths, setPayMeths] = useState([])

  useAxiosEffect(
    '/answers/get-payment-methods', 'payment_methods',
    (d) => { setPayMeths(d.payment_methods) },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

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
      formatedPayMeths.push({
        id: meth._id.$oid,
        card_name: meth.card_name,
        installments: meth.installments,
        increase: meth.increase,
        pos_code: meth.pos_code,
        description: meth.description
      })
    }
    return formatedPayMeths
  }, [payMeths])

  const initialValue = {
    id: '',
    card_name: '',
    installments: '',
    increase: '',
    pos_code: '',
    description: ''
  }

  const [newCard, setNewCard] = useState('')
  const [selected, setSelected] = useState(initialValue)
  const [method, setMethod] = useState(initialValue)

  const handleChangeNewCard = (e) => {
    setNewCard(e.target.value)
  }

  const handleChangeMethod = (e) => {
    const { name, value } = e.target
    setMethod({ ...method, [name]: value })
  }

  // QUERIES -------------------------------------------------------------------

  const handleAddCard = useAxios(
    'post', '/answers/create-payment-method', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleAddMethod = useAxios(
    'post', '/answers/create-payment-method', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleUpdateCardName = useAxios(
    'put', '/answers/update-credit-card', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleUpdateMethod = useAxios(
    'put', '/answers/update-method', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleDropCard = useAxios(
    'delete', '/answers/delete-credit-card', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleDropMethod = useAxios(
    'delete', '/answers/delete-method', 'payment_methods',
    (d) => {
      setPayMeths(d.payment_methods)
      handleMessage(d.msg, 'success')
      setNewCard('')
      setSelected(initialValue)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  // ---------------------------------------------------------------------------

  return (
    <Grid item xs={12}>
      <Box sx={{ paddingBlockEnd: 2, height: '75vh' }}
        border={2} p={2} borderRadius={1} borderColor='secondary.main'
        backgroundColor='#323232'
      >
        <Grid container spacing={1} align='center' pr={2} alignItems='center'>
          <Grid item xs={12}>
            <Typography variant='body1' color='secondary.main'>
              Edit Credit Cards Payments Methods
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ borderRadius: '15px 15px 0px 0px' }}>
              <Paper elevation={3} sx={{
                borderRadius: '15px 15px 0px 0px',
                backgroundColor: '#553311',
                height: 40
              }}
              >
                <Typography variant="body1" color="initial" p={1}>
                  Card Name
                </Typography>
              </Paper>
              <TableContainer sx={{ height: '60vh' }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <CustomCell width='25%'>
                        Installments
                      </CustomCell>
                      <CustomCell width='25%'>
                        Description
                      </CustomCell>
                      <CustomCell width='25%'>
                        Increase
                      </CustomCell>
                      <CustomCell width='25%'>
                        Code
                      </CustomCell>
                      <CustomCell width='5%'>
                        Upg
                      </CustomCell>
                      <CustomCell width='5%'>
                        Drop
                      </CustomCell>
                      <CustomCell width='5%'>
                        Add
                      </CustomCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <CustomCell width='90%' colSpan={6}
                        sx={{
                          borderRadius: '50px 0px 0px 50px',
                          backgroundColor: '#388e3c'
                        }}
                      >
                        <TextField fullWidth label='Card Name' size='small'
                          variant='standard' value={newCard} color='secondary'
                          inputProps={{ style: { textAlign: 'center' } }}
                          onChange={handleChangeNewCard}
                        />
                      </CustomCell>
                      <CustomCell
                        sx={{
                          borderRadius: '0px 50px 50px 0px',
                          backgroundColor: '#388e3c'
                        }}
                      >
                        <IconButton size='small' color='warning'
                          disabled={!Boolean(newCard)}
                          onClick={() => handleAddCard({
                            method: {
                              card_name: newCard, installments: 0,
                              increase: 0, pos_code: 0, description: 'FIXME'
                            }
                          })}
                        >
                          <Add fontSize='small' />
                        </IconButton>
                      </CustomCell>
                    </TableRow>

                    {paymentMethods.map(item => {

                      let component
                      if (selected.id === item.id) {

                        component = item.header ? (
                          <TableRow key={item.header}>
                            <CustomCell width='90%' colSpan={4}
                              sx={{
                                borderRadius: '50px 0px 0px 0px',
                                backgroundColor: '#775533'
                              }}
                            >
                              <TextField label='Card Name' size='small'
                                variant='standard' value={method.header}
                                name='header'
                                onChange={handleChangeMethod}
                              />
                            </CustomCell>
                            <CustomCell sx={{ backgroundColor: '#775533' }}>
                              <RDialog title='Update' confirmText='Update'
                                message='Confirm Update Payment Method?'
                                color='warning'
                                action={() => handleUpdateCardName(
                                  { name: item.id, new_name: method.header }
                                )}
                              >
                                <IconButton size='small' color='warning'>
                                  <Done fontSize='small' />
                                </IconButton>
                              </RDialog>
                            </CustomCell>
                            <CustomCell sx={{ backgroundColor: '#775533' }}>
                              <IconButton size='small' color='info'
                                onClick={() => setSelected(initialValue)}
                              >
                                <Cancel fontSize='small' />
                              </IconButton>
                            </CustomCell>
                            <CustomCell
                              sx={{
                                borderRadius: '0px 50px 50px 0px',
                                backgroundColor: '#775533'
                              }}
                            >
                              <IconButton size='small' color='info'
                                onClick={() => handleAddMethod({
                                  method: {
                                    card_name: item.header, installments: 0,
                                    increase: 0, pos_code: 0,
                                    description: 'FIXME'
                                  }
                                })}
                              >
                                <Add fontSize='small' />
                              </IconButton>
                            </CustomCell>
                          </TableRow>
                        ) : (
                          <TableRow hover key={item.id}>
                            <CustomCell>
                              <TextField label='Installments' size='small'
                                variant='standard'
                                name='installments'
                                value={method.installments}
                                onChange={handleChangeMethod}
                              />
                            </CustomCell>
                            <CustomCell>
                              <TextField label='Description' size='small'
                                variant='standard'
                                name='description'
                                value={method.description}
                                onChange={handleChangeMethod}
                              />
                            </CustomCell>
                            <CustomCell>
                              <TextField label='Increase' size='small'
                                variant='standard'
                                name='increase'
                                value={method.increase}
                                onChange={handleChangeMethod}
                              />
                            </CustomCell>
                            <CustomCell>
                              <TextField label='Pos-Code' size='small'
                                variant='standard'
                                name='pos_code'
                                value={method.pos_code}
                                onChange={handleChangeMethod}
                              />
                            </CustomCell>
                            <CustomCell>
                              <RDialog title='Update' confirmText='Update'
                                message='Confirm Update Payment Method?'
                                color='success' action={
                                  () => handleUpdateMethod(
                                    { method: { ...method } }
                                  )
                                }
                              >
                                <IconButton size='small' color='success'
                                >
                                  <Done fontSize='small' />
                                </IconButton>
                              </RDialog>
                            </CustomCell>
                            <CustomCell>
                              <IconButton size='small' color='info'
                                onClick={() => setSelected(initialValue)}
                              >
                                <Cancel fontSize='small' />
                              </IconButton>
                            </CustomCell>
                          </TableRow>
                        )

                      } else {

                        component = item.header ? (
                          <TableRow key={item.header}>
                            <CustomCell width='90%' colSpan={4}
                              sx={{
                                borderRadius: '50px 0px 0px 0px',
                                backgroundColor: '#775533'
                              }}
                            >
                              {item.header}
                            </CustomCell>
                            <CustomCell sx={{ backgroundColor: '#775533' }}>
                              <IconButton size='small' color='warning'
                                onClick={() => {
                                  setSelected(item)
                                  setMethod(item)
                                }}
                              >
                                <Edit fontSize='small' />
                              </IconButton>
                            </CustomCell>
                            <CustomCell
                              sx={{ backgroundColor: '#775533' }}>
                              <RDialog title='Drop' confirmText='Drop'
                                message='Confirm Drop Payment Method?'
                                color='error' action={() => handleDropCard(
                                  { card_name: item.header }
                                )}
                              >
                                <IconButton size='small' color='error'
                                >
                                  <Delete fontSize='small' />
                                </IconButton>
                              </RDialog>
                            </CustomCell>
                            <CustomCell
                              sx={{
                                borderRadius: '0px 50px 50px 0px',
                                backgroundColor: '#775533'
                              }}
                            >
                              <IconButton size='small' color='info'
                                onClick={() => handleAddMethod({
                                  method: {
                                    card_name: item.header, installments: 0,
                                    increase: 0, pos_code: 0,
                                    description: 'FIXME'
                                  }
                                })}
                              >
                                <Add fontSize='small' />
                              </IconButton>
                            </CustomCell>
                          </TableRow>
                        ) : (
                          <TableRow hover key={item.id}>
                            <CustomCell>
                              {item.installments}
                            </CustomCell>
                            <CustomCell>
                              {item.description}
                            </CustomCell>
                            <CustomCell>
                              {item.increase}
                            </CustomCell>
                            <CustomCell>
                              {item.pos_code}
                            </CustomCell>
                            <CustomCell>
                              <IconButton size='small' color='warning'
                                onClick={() => {
                                  setSelected(item)
                                  setMethod(item)
                                }}
                              >
                                <Edit fontSize='small' />
                              </IconButton>
                            </CustomCell>
                            <CustomCell>
                              <RDialog title='Drop' confirmText='Drop'
                                message='Confirm Drop Payment Method?'
                                color='error'
                                action={() => handleDropMethod(
                                  { method: { id: item.id } }
                                )}
                              >
                                <IconButton size='small' color='error'
                                >
                                  <Delete fontSize='small' />
                                </IconButton>
                              </RDialog>
                            </CustomCell>
                          </TableRow>
                        )

                      }
                      return component
                    })}
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

export default EditCreditCards;
