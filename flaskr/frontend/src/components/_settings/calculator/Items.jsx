import { useState, useContext } from 'react'
import {
  Grid, Paper, Box, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, TextField, Button
} from '@mui/material'
import {
  Done, Cancel, Edit, Delete
} from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../../tools/contexts'
import { api_url } from '../../tools/routes'
import RDialog from '../../tools/ReusableDialog'

const Items = (props) => {

  const {
    dates, setDates, lists, setLists, hasChanged, setHasChanged, handleMessage
  } = props

  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState({ _id: '', percent: '' })
  const [oneDate, setOneDate] = useState({ _id: '', percent: '' })

  const handleChangeSelected = (e) => {
    const { name, value } = e.target
    setOneDate({ ...oneDate, [name]: value })
  }

  const handleUpdateOne = () => {
    let newDates = dates.map(item => {
      return item._id !== selected._id ? item
        : { _id: oneDate._id, percent: parseFloat(oneDate.percent) }
    })
    if (selected._id !== oneDate._id) {
      newDates.push({ ...selected, percent: -1 })
    }
    setDates(newDates)
    setSelected({ _id: '', percent: '' })
    setHasChanged(true)
  }

  const handleDeleteOne = (id) => {
    const newDates = dates.filter(item => item._id !== id)
    setDates(newDates)
    setHasChanged(true)
  }

  const handleUpdateTable = () => {
    try {
      (async () => {
        const res = await axios.post(
          api_url + '/calculator/load-list',
          { dates: dates },
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.token}`
            }
          }
        )
        if (res.data['msg']) {
          const newLists = lists
          newLists.unshift({
            _id: { $oid: new Date().getTime() },
            list_name: res.data.new_list
          })
          setLists(newLists)
          const newDates = dates
            .filter(item => item.percent !== -1)
            .sort((a, b) => a._id > b._id ? -1 : (a._id < b._id ? 1 : 0))
          setDates(newDates)
          handleMessage(res.data.msg, 'success')
          setHasChanged(false)
        }
        if (res.data['err']) {
          handleMessage(res.data.err, 'error')
        }
      })()
    }
    catch (error) {
      console.error(error)
    }
  }

  return (
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box borderRadius={3} p={2}
        sx={{ paddingBlockEnd: 2, minHeight: '80vh' }}
      >
        <Grid container spacing={1} align='center' pr={2}
          alignItems='top'
          alignContent='flex-start'
          sx={{ height: '65vh', overflow: 'auto' }}
        >
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell align='center' width='50%'
                  sx={{ borderRadius: '5px 5px 0px 0px' }}
                >
                  Date (y/m/d)
                </TableCell>
                <TableCell align='center' width='30%'
                  sx={{ borderRadius: '5px 5px 0px 0px' }}
                >
                  Percentage
                </TableCell>
                <TableCell align='center' width='10%'
                  sx={{ borderRadius: '5px 5px 0px 0px' }}
                >
                  Edit
                </TableCell>
                <TableCell align='center' width='10%'
                  sx={{ borderRadius: '5px 5px 0px 0px' }}
                >
                  Drop
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                dates?.map(date => {
                  const dis = (
                    selected._id === oneDate._id &&
                    selected.percent.toString() ===
                    oneDate.percent.toString()
                  )
                  const component = (selected._id === date._id
                    ?
                    <TableRow key={date._id} hover selected>
                      <TableCell>
                        {<TextField size='small' variant='standard'
                          inputProps={{
                            style: { textAlign: 'center' }
                          }}
                          name='_id'
                          value={oneDate._id}
                          onChange={handleChangeSelected}
                        />}
                      </TableCell>
                      <TableCell>
                        <TextField size='small' variant='standard'
                          inputProps={{
                            style: { textAlign: 'center' },
                            min: 0
                          }}
                          type='number'
                          name='percent'
                          value={oneDate.percent}
                          onChange={handleChangeSelected}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' color='success'
                          disabled={dis}
                          onClick={handleUpdateOne}
                        >
                          <Done />
                        </IconButton>
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' color='info'
                          onClick={() =>
                            setSelected({ _id: '', percent: '' })
                          }
                        >
                          <Cancel />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    :
                    <TableRow key={date._id} hover>
                      <TableCell align='center'>
                        {date._id}
                      </TableCell>
                      <TableCell align='center'>
                        {date.percent}
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' color='warning'
                          onClick={() => {
                            setOneDate({
                              _id: date._id, percent: date.percent
                            })
                            setSelected({
                              _id: date._id, percent: date.percent
                            })
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell align='right'>
                        <RDialog title='Delete Data?'
                          message='Confirm delete Data Percentage?'
                          confirmText='Delete'
                          action={() => handleDeleteOne(date._id)}
                        >
                          <IconButton size='small' color='error'>
                            <Delete />
                          </IconButton>
                        </RDialog>
                      </TableCell>
                    </TableRow>
                  )
                  return component
                })
              }
            </TableBody>
          </Table>
        </Grid>
        <Grid container spacing={2} py={2}>
          <Grid item xs={6} md={9}></Grid>
          <Grid item xs={6} md={3}>
            <RDialog title='Update Table' message='Confirm Update Table?'
              confirmText='UPDATE' action={handleUpdateTable} color='warning'
              disabled={!hasChanged}
            >
              <Button fullWidth variant='contained' color='error'
                disabled={!hasChanged}
              >
                Update Table
              </Button>
            </RDialog>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default Items