import { useState, useContext } from 'react'
import {
  Grid, Paper, Box, Table, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Typography
} from '@mui/material'
import { ArrowUpward, Download, Delete } from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../../tools/contexts'
import { api_url } from '../../tools/routes'
import RDialog from '../../tools/ReusableDialog'


const Lists = (props) => {

  const { lists, setLists, setDates, setHasChanged, handleMessage } = props

  const { user } = useContext(UserContext)
  const [selectedList, setSelectedList] = useState('')

  const fetchList = () => {
    try {
      (async () => {
        const res = await axios.get(
          api_url + '/calculator/get-lists-data',
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        if (res.data['dates']) {
          setDates(res.data.dates)
        }
        if (res.data['err']) {
          console.error(res.data.err)
        }
      })()
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleLoadList = () => {
    try {
      (async () => {
        const res = await axios.post(
          api_url + '/calculator/load-list',
          { list_name: selectedList },
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.token}`
            }
          }
        )
        if (res.data['msg']) {
          fetchList()
          handleMessage(res.data.msg, 'success')
        }
        if (res.data['err']) {
          handleMessage(res.data.err, 'error')
        }
      })()
      setSelectedList('')
      setHasChanged(false)
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleDownloadList = (name) => {
    try {
      (async () => {
        const res = await axios.post(
          api_url + '/calculator/get-list-file',
          { file_name: name },
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.token}`
            }
          }
        )
        if (res.data['err']) {
          console.error(res.data.err)
        } else {
          const fileToSave = window.URL.createObjectURL(
            new Blob(
              [JSON.stringify(res.data, undefined, 2)],
              { type: 'application/json' }
            )
          )
          const link = document.createElement('a')
          link.href = fileToSave
          link.setAttribute('download', `${name}`)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
      })()
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleDropList = (name) => {
    try {
      (async () => {
        const res = await axios.delete(
          api_url + '/calculator/drop-list',
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user?.token}`
            },
            data: { file_name: name }
          }
        )
        if (res.data['msg']) {
          const new_list = lists.filter(i => i.list_name !== name)
          setLists(new_list)
          setSelectedList('')
          handleMessage(res.data.msg, 'info')
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
    <Grid item>
      <Paper elevation={5} sx={{ borderRadius: 1 }}>
        <Box borderRadius={3} p={2}
          sx={{ paddingBlockEnd: 2, minHeight: '40vh' }}
        >
          <Grid container spacing={1} align='center' pr={2}
            alignItems='center'
            alignContent='flex-start'
          >
            <Grid item xs={12} md={6}>
              <Typography variant='h6' color='error.main'>
                Load Table
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} pb={2}>
              <RDialog title='Load Table'
                message='Confirm load table?'
                confirmText='LOAD' disabled={!Boolean(selectedList)}
                action={handleLoadList}
              >
                <Button fullWidth variant='contained' color='error'
                  disabled={!Boolean(selectedList)}
                  sx={{ height: '100%' }} startIcon={<ArrowUpward />}
                >
                  LOAD TABLE
                </Button>
              </RDialog>
            </Grid>
            <Grid item xs={12}>
              <Grid container align='center'
                alignItems='center'
                alignContent='flex-start'
                sx={{ height: '25vh', overflow: 'auto' }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center' width='80%'
                        sx={{ borderRadius: '5px 5px 0px 0px' }}
                      >
                        Table Name
                      </TableCell>
                      <TableCell align='center' width='10%'
                        sx={{ borderRadius: '5px 5px 0px 0px' }}
                      >
                        Download
                      </TableCell>
                      <TableCell align='center' width='10%'
                        sx={{ borderRadius: '5px 5px 0px 0px' }}
                      >
                        Drop
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lists.map(list => {
                      const is_sel = selectedList === list.list_name
                      return (
                        <TableRow key={list._id.$oid} hover
                          selected={is_sel}
                        >
                          <TableCell align='center'
                            onClick={() => {
                              is_sel ?
                                setSelectedList('')
                                :
                                setSelectedList(list.list_name)
                            }}>
                            {list.list_name}
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton size='small' color='info'
                              onClick={() =>
                                handleDownloadList(list.list_name)
                              }
                            >
                              <Download />
                            </IconButton>
                          </TableCell>
                          <TableCell align='center'>
                            <RDialog title='Drop Data Table?'
                              message='Confirm drop Table?'
                              confirmText='DROP'
                              action={() => {
                                handleDropList(list.list_name)
                              }}
                            >
                              <IconButton size='small' color='error'>
                                <Delete />
                              </IconButton>
                            </RDialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Lists