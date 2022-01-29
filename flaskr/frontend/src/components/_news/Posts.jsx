import { useContext, useState, useMemo } from 'react'
import {
  Grid, Box, Alert, AlertTitle, Divider, Chip, Stack, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { Alarm } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios'

import { PostContext, UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'
import daysAgo from '../tools/daysAgo'


const Posts = (props) => {

  const { filter: { severity, owner }, handleMessage } = props
  const { fetchedPosts } = useContext(PostContext)
  const { user } = useContext(UserContext)
  const [postToDelete, setPostToDelete] = useState('')

  const posts = useMemo(() => {
    if (fetchedPosts.length > 0) {
      let severity_filter
      switch (severity) {
        case 'Reminder':
          severity_filter = 'rem'
          break
        case 'Normal':
          severity_filter = 'nor'
          break
        case 'Urgent':
          severity_filter = 'urg'
          break
        default:
          severity_filter = null
          break
      }
      const owner_filter = owner === 'from All' ? null : user?.email

      let filteredPosts = fetchedPosts.filter(post =>
        (severity_filter ? post.severity === severity_filter : true)
        && (owner_filter ? post.owner._id === owner_filter : true)
      )

      const dividedPosts = []
      const today = new Date().getTime()
      let last_day = today

      if (filteredPosts.length > 0) {
        filteredPosts.forEach(post => {
          const other_day = daysAgo(today, post._id['$date'])
          if (last_day !== other_day) {
            dividedPosts.push({ divider: other_day })
            last_day = other_day
          }
          dividedPosts.push(post)
        })
      } else {
        dividedPosts.push(
          { divider: 'There are no posts with those conditions' }
        )
      }

      return dividedPosts
    }
  }, [fetchedPosts, severity, owner, user])

  const handleDelete = (post) => {
    (async () => {
      const res = await axios.delete(
        api_url + '/news/delete-post',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user?.token}`
          },
          data: post
        }
      )
      if (res.data['msg']) {
        handleMessage(res.data['msg'], 'info')
      }
      if (res.data['wrn']) {
        handleMessage(res.data['wrn'], 'warning')
      }
      if (res.data['err']) {
        handleMessage(res.data['err'], 'error')
      }
    })()
    setPostToDelete('')
  }

  const justClose = () => {
    setPostToDelete('')
  }

  return (
    <>
      <Grid item xs={12} md={7}>
        <Box border={2} p={2} borderRadius={1} borderColor='primary.main'
          sx={{ height: '80vh' }}
        >
          <Stack spacing={1} pr={1}
            sx={{ paddingBlockEnd: 2, height: '75vh', overflow: 'auto' }}
          >
            {posts?.map(element => {
              let component
              if (element.divider) {
                component = (
                  <Grid item key={element.divider}>
                    <Divider>
                      <Chip color='primary' label={element.divider} />
                    </Divider>
                  </Grid>
                )
              }
              if (element._id) {
                let post_props
                switch (element.severity) {
                  case 'rem':
                    post_props = {
                      icon: <Alarm />, severity: 'success'
                    }
                    break
                  case 'nor':
                    post_props = { severity: 'warning' }
                    break
                  case 'urg':
                    post_props = { severity: 'error' }
                    break
                  default:
                    post_props = {}
                    break
                }
                if (user?.is_admin || element.owner._id === user?.email) {
                  post_props = {
                    ...post_props,
                    onClose: () => { setPostToDelete(element._id) }
                  }
                }
                component = (
                  <Grid item key={element._id['$date']}>
                    <Alert variant='filled' {...post_props}
                      style={{fontFamily:'Noto Sans', fontSize:'1em'}}
                    >
                      <AlertTitle>
                        <Typography variant='h5'>
                          {element.owner.username} - {element.title}
                        </Typography>
                      </AlertTitle>
                      <ReactMarkdown
                        children={element.content} remarkPlugins={[remarkGfm]}
                      />
                    </Alert>
                  </Grid>
                )
              }
              return component
            })}
          </Stack>
        </Box>
      </Grid >
      <Dialog
        open={Boolean(postToDelete)}
        onClose={justClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogTitle id="title">
          Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            Confirm delete post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={justClose}>
            Cancel </Button>
          <Button
            onClick={() => handleDelete(postToDelete)} color='error' autoFocus
          >
            DELETE </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Posts