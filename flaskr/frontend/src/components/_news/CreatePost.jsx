import { useState, useContext } from 'react'
import {
  Typography, Grid, Box, Divider, TextField, Button, Paper
} from '@mui/material';
import { Send } from '@mui/icons-material'
import PostSelect from './PostSelect'
import axios from 'axios';

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'

const CreatePost = (props) => {

  const { handleMessage } = props
  const { user } = useContext(UserContext)

  const [newPost, setNewPost] = useState({
    title: '', content: '', days_offset: ''
  })
  const [newSeverity, setNewSeverity] = useState('Normal')
  const [to, setTo] = useState('to Me')

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewPost({ ...newPost, [name]: value })
  }

  const getSeverity = () => {
    switch (newSeverity) {
      case 'Reminder':
        return 'rem'
      default:
      case 'Normal':
        return 'nor'
      case 'Urgent':
        return 'urg'
    }
  }

  const getPublic = () => {
    switch (to) {
      default:
      case 'to Me':
        return false
      case 'to All':
        return true
    }
  }

  const handleSend = () => {

    if (!newPost.title) {
      handleMessage('You must provide a Title', 'error')
      return
    }
    if (!newPost.content) {
      handleMessage('You must provide a Content', 'error')
      return
    }
    const days_offset = parseInt((newPost.days_offset || 0))
    if (0 > days_offset || 7 < days_offset) {
      handleMessage('"within days" must be between 0 and 7', 'error')
      return
    }

    (async () => {
      try {
        const res = await axios.post(
          api_url + '/news/create-post',
          {
            title: newPost.title,
            content: newPost.content,
            severity: getSeverity(),
            days_offset: days_offset,
            is_public: getPublic()
          },
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        if (res.data['msg']) {
          handleMessage(res.data['msg'], 'success')
          setNewPost({ title: '', content: '', days_offset: '' })
          setNewSeverity('Normal')
          setTo('to Me')
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

  let send_props
  switch (newSeverity) {
    case 'Reminder':
      send_props = { color: 'success' }
      break
    case 'Normal':
      send_props = { color: 'warning' }
      break
    case 'Urgent':
      send_props = { color: 'error' }
      break
    default:
      send_props = {}
      break
  }

  return (
    <Grid item xs={12} md={5}>
      <Paper elevation={3}>
        <Box sx={{ paddingBlockEnd: 2, height: '60vh' }}
          border={2} p={2} borderRadius={1} borderColor='secondary.main'
        >
          <Grid container spacing={1} align='center' pr={2} alignItems='center'
            sx={{ height: '55vh', overflow: 'auto' }}
          >
            <Grid item xs={12}>
              <Divider>
                <Typography color='secondary'>CREATE NEW POST</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size='small' label='TITLE'
                name='title'
                value={newPost.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth rows={8} multiline size='small'
                label='CONTENT (Markdown Supported)'
                name='content'
                value={newPost.content}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={7} md={3}>
              <PostSelect
                options={['Urgent', 'Normal', 'Reminder']}
                option={newSeverity}
                setOption={setNewSeverity}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <PostSelect
                options={['to Me', 'to All']}
                option={to}
                setOption={setTo}
              />
            </Grid>
            <Grid item xs={7} md={3}>
              <TextField fullWidth label='within days' size='small'
                name='days_offset'
                type='number'
                inputProps={{ min: '0', max: '7', step: '1' }}
                value={newPost.days_offset}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <Button variant='contained' fullWidth size='small'
                onClick={handleSend} {...send_props} endIcon={<Send />}
              >
                <Typography variant='h6'>
                  Send
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default CreatePost