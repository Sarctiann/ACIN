import { useState, useContext } from 'react'
import {
  Grid, Box, TextField, IconButton, Stack, Button, Typography, Paper, Switch,
  FormControlLabel, Snackbar, Alert
} from '@mui/material'
import { Save, Delete, Cancel } from '@mui/icons-material'

import { UserContext } from '../../tools/contexts'
import RDialog from '../../tools/ReusableDialog'
import { useAxiosEffect, useAxios } from '../../tools/axiosTool'

const ExpressionsSettings = () => {

  const { user } = useContext(UserContext)

  const initialExpression = {
    id: '',
    is_system: false,
    identifier: '',
    pattern: '',
    replacement: ''
  }

  const [openSB, setOpenSB] = useState(false)
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [sysRegex, setSysRegex] = useState([])
  const [ownRegex, setOwnRegex] = useState([])
  const [expression, setExpression] = useState(initialExpression)
  const [edit, setEdit] = useState(false)

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt });
    setOpenSB(true)
  }

  const handleClose = () => {
    setOpenSB(false)
  }

  const handleChangeExpression = (e) => {
    const { name, value, checked } = e.target
    setExpression({
      ...expression,
      [name]: name !== 'is_system' ? value : checked
    })
  }

  const handleClickExpression = (exp) => {
    setExpression(exp)
    setEdit(true)
  }

  const handleCancel = () => {
    setExpression(initialExpression)
    setEdit(false)
  }

  const queryHandlers = [
    (d) => {
      if (d.answers['sys_regex']) {
        setSysRegex(d.answers.sys_regex)
      }
      if (d.answers['own_regex']) {
        setOwnRegex(d.answers.own_regex)
      }
      if (d.msg) {
        handleMessage(d.msg, 'success')
      }
      setExpression(initialExpression)
      setEdit(false)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  ]

  useAxiosEffect(
    '/answers/get-expressions', 'answers',
    ...queryHandlers
  )

  const handleCreateAnswer = useAxios(
    'post', '/answers/create-expression', 'answers',
    ...queryHandlers
  )

  const handleUpdateAnswer = useAxios(
    'put', '/answers/update-expression', 'answers',
    ...queryHandlers
  )

  const handleDeleteAnswer = useAxios(
    'delete', '/answers/delete-expression', 'answers',
    ...queryHandlers
  )

  return (
    <>
      <Grid item xs={12} md={6}>
        <Paper elevation={7}>
          <Box sx={{ paddingBlockEnd: 2, minHeight: '80vh' }}
            border={2} p={2} borderRadius={1} borderColor='info.main'
          >
            <Grid container spacing={1} align='center' pr={2}>
              <Grid item xs={12} md={8}>
                <TextField size='small' label='Identifier' color='warning'
                  fullWidth name='identifier'
                  value={expression.identifier}
                  onChange={handleChangeExpression}
                />
              </Grid>

              {user?.is_admin && !edit &&
                <Grid item xs={12} md={3}>
                  <FormControlLabel control={
                    <Switch
                      name='is_system'
                      checked={expression.is_system}
                      onChange={handleChangeExpression}
                    />
                  }
                    label='System'
                  />
                </Grid>
              }
              <Grid item xs={12} md={11}>
                <TextField size='small' label='Pattern' color='warning'
                  fullWidth name='pattern'
                  value={expression.pattern} onChange={handleChangeExpression}
                />
              </Grid>
              <Grid item xs={12} md={11}>
                <TextField label='Replacement' color='warning'
                  fullWidth multiline rows={4} name='replacement'
                  value={expression.replacement}
                  onChange={handleChangeExpression}
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <RDialog title={edit ? 'Update Answer' : 'Create Answer'}
                  confirmText={edit ? 'Update' : 'Create'} message={
                    edit ? 'Confirm Update Answer?' : 'Confirm Create Answer?'
                  } action={edit ? () => handleUpdateAnswer({
                    expression: {
                      ...expression, id: expression._id.$oid
                    }
                  }) : () => handleCreateAnswer({
                    expression: expression
                  })} color={edit ? 'warning' : 'success'}
                >
                  <IconButton color={edit ? 'primary' : 'success'}
                    disabled={!Boolean(expression.identifier)}
                  >
                    <Save />
                  </IconButton>
                </RDialog>
                <RDialog title='Delete Answer' message='Confirm Delete Answer?'
                  confirmText='Delete' action={() => handleDeleteAnswer({
                    expression: {
                      id: expression._id.$oid
                    }
                  })}
                >
                  <IconButton color='error'
                    disabled={!Boolean(expression.identifier)}
                  >
                    <Delete />
                  </IconButton>
                </RDialog>
                <IconButton color='warning'
                  disabled={!Boolean(expression.identifier)}
                  onClick={handleCancel}
                >
                  <Cancel />
                </IconButton>
              </Grid>
              {user?.is_admin &&
                <Grid item xs={12} md={6}>
                  <Typography variant='h6'>
                    System
                  </Typography>
                  <Stack spacing={1} p={1}
                    sx={{
                      paddingBlockEnd: 2, height: '38vh', overflow: 'auto'
                    }}
                  >
                    {sysRegex.map((exp) => {
                      return (
                        <Button key={exp._id.$oid} fullWidth variant='contained'
                          color='error'
                          onClick={() => handleClickExpression(exp)}
                        >
                          {exp.identifier}
                        </Button>
                      )
                    })}
                  </Stack>
                </Grid>
              }
              <Grid item xs={12} md={6}>
                <Typography variant='h6'>
                  Own
                </Typography>
                <Stack spacing={1} p={1}
                  sx={{ paddingBlockEnd: 2, height: '38vh', overflow: 'auto' }}
                >
                  {ownRegex.map((ans) => {
                    return (
                      <Button key={ans._id.$oid} fullWidth variant='contained'
                        color='primary'
                        onClick={() => handleClickExpression(ans)}
                      >
                        {ans.identifier}
                      </Button>
                    )
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSB}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert variant='filled' color={message.vnt}
          sx={{ whiteSpace: 'pre-line' }}
        >
          {message.msg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ExpressionsSettings