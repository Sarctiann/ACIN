import { useState } from 'react'
import {
  Grid, Box, TextField, IconButton, Stack, Button, Typography, Paper, Switch,
  FormControl, FormControlLabel, MenuItem, Select
} from '@mui/material'
import { Save, Delete, Cancel } from '@mui/icons-material'

import RDialog from '../../tools/ReusableDialog'
import { useAxios } from '../../tools/axiosTool'

const EditAnswers = (props) => {

  const {
    user, commonAnswers, ownAnswers, setCommonAnswers, setOwnAnswers,
    handleMessage
  } = props

  const colors = {
    '#1976d2': 'BLUE',
    '#0097a7': 'CYAN',
    '#388e3c': 'GREEN',
    '#fbc02d': 'YELLOW',
    '#f57c00': 'ORANGE',
    '#d32f2f': 'RED',
    '#c2185b': 'PINK',
    '#7b1fa2': 'PURPLE',
    '#5d4037': 'BROWN',
    '#455a64': 'GREY'
  }

  const initialAnswer = {
    id: '',
    label: '',
    color: '',
    content: '',
    common: false,
    order: 0
  }

  const [answer, setAnswer] = useState(initialAnswer)
  const [edit, setEdit] = useState(false)

  const handleChangeAnswer = (e) => {
    const { name, value, checked } = e.target
    setAnswer({
      ...answer,
      [name]: name !== 'common' ? value : checked
    })
  }

  const handleClickAnswer = (ans) => {
    setAnswer(ans)
    setEdit(true)
  }

  const handleCancel = () => {
    setAnswer(initialAnswer)
    setEdit(false)
  }

  const queryHandlers = [
    (d) => {
      if (d.answers['common_answers']) {
        setCommonAnswers(d.answers.common_answers)
      }
      if (d.answers['own_answers']) {
        setOwnAnswers(d.answers.own_answers)
      }
      handleMessage(d.msg, 'success')
      setAnswer(initialAnswer)
      setEdit(false)
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  ]

  const handleCreateAnswer = useAxios(
    'post', '/answers/create-answer', 'answers',
    ...queryHandlers
  )

  const handleUpdateAnswer = useAxios(
    'put', '/answers/update-answer', 'answers',
    ...queryHandlers
  )

  const handleDeleteAnswer = useAxios(
    'delete', '/answers/delete-answer', 'answers',
    ...queryHandlers
  )

  return (
    <Grid item xs={12}>
      <Paper elevation={3}>
        <Box sx={{ paddingBlockEnd: 2, height: '80vh' }}
          border={2} p={2} borderRadius={1} borderColor='secondary.main'
        >
          <Grid container spacing={1} align='center' pr={2}>
            <Grid item xs={12} md={3}>
              <TextField size='small' label='Label' color='warning'
                fullWidth name='label'
                value={answer.label} onChange={handleChangeAnswer}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField size='small' label='Order' color='warning'
                fullWidth name='order' type='number'
                value={answer.order} onChange={handleChangeAnswer}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <Select size='small'
                  name='color'
                  value={answer.color}
                  onChange={handleChangeAnswer}
                >
                  {Object.entries(colors).map(([hex, name]) => {
                    return (
                      <MenuItem key={name} value={hex}>
                        <Typography color={hex}>
                          {name}
                        </Typography>
                      </MenuItem>
                    )
                  })
                  }
                </Select>
              </FormControl>
            </Grid>
            {user?.is_admin && !edit &&
              <Grid item xs={12} md={3}>
                <FormControlLabel control={
                  <Switch
                    name='common'
                    checked={answer.common}
                    onChange={handleChangeAnswer}
                  />
                }
                  label='Common'
                />
              </Grid>
            }
            <Grid item xs={12} md={11}>
              <TextField label='Content' color='warning'
                fullWidth multiline rows={4} name='content'
                value={answer.content} onChange={handleChangeAnswer}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <RDialog title={edit ? 'Update Answer' : 'Create Answer'}
                confirmText={edit ? 'Update' : 'Create'} message={
                  edit ? 'Confirm Update Answer?' : 'Confirm Create Answer?'
                } action={edit ? () => handleUpdateAnswer({
                  answer: {
                    ...answer, id: answer._id.$oid, color: colors[answer.color]
                  }
                }) : () => handleCreateAnswer({
                  answer: {
                    ...answer, color: colors[answer.color]
                  }
                })} color={edit ? 'warning' : 'success'}
              >
                <IconButton color={edit ? 'primary' : 'success'}
                  disabled={!Boolean(answer.label)}
                >
                  <Save />
                </IconButton>
              </RDialog>
              <RDialog title='Delete Answer' message='Confirm Delete Answer?'
                confirmText='Delete' action={() => handleDeleteAnswer({
                  answer: {
                    id: answer._id.$oid
                  }
                })}
              >
                <IconButton color='error' disabled={!Boolean(answer.label)}>
                  <Delete />
                </IconButton>
              </RDialog>
              <IconButton color='warning' disabled={!Boolean(answer.label)}
                onClick={handleCancel}
              >
                <Cancel />
              </IconButton>
            </Grid>
            {user?.is_admin &&
              <Grid item xs={12} md={6}>
                <Typography variant='h6'>
                  Commons
                </Typography>
                <Stack spacing={1} p={1}
                  sx={{ paddingBlockEnd: 2, height: '45vh', overflow: 'auto' }}
                >
                  {commonAnswers.map((ans) => {
                    return (
                      <Button key={ans._id.$oid} fullWidth variant='contained'
                        sx={{
                          color: '#FFFFFF',
                          background: ans.color, '&:hover': {
                            background: ans.color, filter: 'brightness(90%)'
                          }
                        }}
                        onClick={() => handleClickAnswer(ans)}
                      >
                        {ans.label}
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
                sx={{ paddingBlockEnd: 2, height: '45vh', overflow: 'auto' }}
              >
                {ownAnswers.map((ans) => {
                  return (
                    <Button key={ans._id.$oid} fullWidth variant='contained'
                      sx={{
                        color: '#FFFFFF',
                        background: ans.color, '&:hover': {
                          background: ans.color, filter: 'brightness(90%)'
                        }
                      }}
                      onClick={() => handleClickAnswer(ans)}
                    >
                      {ans.label}
                    </Button>
                  )
                })}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default EditAnswers