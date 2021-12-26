import { useContext, useState, useEffect, useMemo } from 'react'
import {
  Grid, Box, Alert, AlertTitle, Divider, Chip, Stack, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { Alarm } from '@mui/icons-material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'

const daysAgo = (today, date) => {
  const delta = ((today - date) / (1000 * 3600 * 24)).toFixed()
  let label
  switch (delta) {
    case '0':
      label = 'Today'
      break
    case '1':
      label = 'Yesterday'
      break
    default:
      label = `${delta} days ago`
      break
  }
  return label
}

const Posts = (props) => {

  const { filter: { severity, owner }, handleMessage } = props
  const { user } = useContext(UserContext)
  const [timeStamp, setTimeStamp] = useState(null)
  const [fetchedPosts, setFetchedPosts] = useState([])
  const [postToDelete, setPostToDelete] = useState('')

  useEffect(() => {
    const source = axios.CancelToken.source()
    const checkForNewPosts = async () => {
      try {
        const res = await axios.post(
          api_url + '/news/fetch-posts',
          { last_post: timeStamp },
          {
            cancelToken: source.token,
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user['token']}`
            }
          }
        )
        if (res.data['newest_post']) {
          setTimeStamp(res.data['newest_post'])
          setFetchedPosts(res.data['posts'])
        } else {
          if (res.data['wrn']) { console.log(res.data['wrn']) }
          if (res.data['err']) { console.log(res.data['err']) }
        }
      }
      catch (error) {
        console.error(error)
      }
    }
    checkForNewPosts()
    const watcher = setInterval(() => {
      checkForNewPosts()
    }, 3000)
    return () => {
      clearInterval(watcher)
      source.cancel('Leaving News page or the data is already loaded')
    }
  }, [user, timeStamp, setFetchedPosts])

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
      const owner_filter = owner === 'from All' ? null : user.email

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
  }, [fetchedPosts, severity, owner, user.email])

  const handleDelete = (post) => {
    (async () => {
      const res = await axios.delete(
        api_url + '/news/delete-post',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user['token']}`
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
                if (user.is_admin || element.owner._id === user.email) {
                  post_props = {
                    ...post_props,
                    onClose: () => { setPostToDelete(element._id) }
                  }
                }
                component = (
                  <Grid item key={element._id['$date']}>
                    <Alert variant='filled' {...post_props}>
                      <AlertTitle>
                        <Typography variant='h5'>
                          {element.owner.username} - {element.title}
                        </Typography>
                      </AlertTitle>
                      <Typography variant='body1'
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {element.content}
                      </Typography>
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