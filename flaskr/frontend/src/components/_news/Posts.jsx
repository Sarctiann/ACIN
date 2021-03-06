import { useContext, useState, useMemo, useRef } from 'react'
import {
  Grid, Box, Alert, AlertTitle, Divider, Chip, Stack, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  CircularProgress
} from '@mui/material';
import { Alarm } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios'

import {
  PostContext, UserContext, UserSettingsContext
} from '../tools/contexts'
import { api_url } from '../tools/routes'
import daysAgo from '../tools/daysAgo'

import style from './markdownStyle.module.css'


const PostPreview = (props) => {

  const { newPost, newSeverity, to, userSettings } = props

  let post_props
  switch (newSeverity) {
    case 'Reminder':
      post_props = {
        icon: <Alarm />, severity: 'success'
      }
      break
    case 'Normal':
      post_props = { severity: 'warning' }
      break
    case 'Urgent':
      post_props = { severity: 'error' }
      break
    default:
      post_props = {}
      break
  }

  const date = () => {
    return new Date(
      new Date().setDate(
        new Date().getDate() + (parseInt(newPost.days_offset) || 0)
      )
    ).toLocaleDateString()
  }

  return (
    < Grid item>
      <Alert variant='outlined' {...post_props}
        style={{
          fontFamily: `${userSettings.postsFontFamily}, Helvetica`
          , fontSize: '1em'
        }}
      >
        <AlertTitle>
          <Typography variant='h5'>
            {newPost.title} (Preview)
          </Typography>
        </AlertTitle>
        <ReactMarkdown className={style.mdStyle}
          remarkPlugins={[remarkGfm]} children={
            `${newPost.content}\n\n*Own ${to}* | *${date()}*`
          }
        />
      </Alert>
    </Grid >
  )
}

const Posts = (props) => {


  const {
    filter: { severity, owner },
    newPost, setNewPost, newSeverity, to, contentFocus, handleMessage
  } = props
  const stackRef = useRef(null)
  const { fetchedPosts } = useContext(PostContext)
  const { user } = useContext(UserContext)
  const { userSettings } = useContext(UserSettingsContext)
  const [postToDelete, setPostToDelete] = useState('')

  const goUp = () => {
    stackRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    contentFocus()
  }

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
          const date = new Date(post._id.$date)
          const other_day = daysAgo(
            today,
            new Date(
              date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
            )
          )
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
          <Stack spacing={1} pr={1} ref={stackRef}
            sx={{ paddingBlockEnd: 2, height: '75vh', overflow: 'auto' }}
          >
            {(newPost.title || newPost.content) &&
              <PostPreview
                newPost={newPost}
                newSeverity={newSeverity}
                to={to}
                userSettings={userSettings}
              />
            }
            {posts?.length > 0 ? posts?.map(element => {
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
                let canEdit = {}
                if (user?.is_admin || element.owner._id === user?.email) {
                  post_props = {
                    ...post_props,
                    onClose: () => { setPostToDelete(element._id) }
                  }
                  canEdit = {
                    onClick: () => {
                      setNewPost({
                        title: '', content: element.content, days_offset: ''
                      })
                      goUp()
                    }
                  }
                }
                const content = element.content
                const owner = `**${element.owner.username}**`
                const pub = element.is_public ? 'to **All**' : 'just for **Me**'
                const date = new Date(element._id.$date).toLocaleDateString()
                component = (
                  <Grid item key={element._id['$date']}>
                    <Alert variant='filled' {...post_props}
                      style={{
                        fontFamily: `${userSettings.postsFontFamily}, Helvetica`
                        , fontSize: '1em'
                      }}
                    >
                      <AlertTitle>
                        <Typography variant='h5'>
                          {element.title}
                        </Typography>
                      </AlertTitle>
                      <div {...canEdit}>
                        <ReactMarkdown className={style.mdStyle}
                          remarkPlugins={[remarkGfm]} children={
                            `${content}\n\n*${owner} ${pub}* | *${date}*`
                          }
                        />
                      </div>
                    </Alert>
                  </Grid>
                )
              }
              return component
            }) :
              <Typography variant='h4' color='secondary'>
                L<CircularProgress size={17} color='secondary' />ading ...
              </Typography>
            }
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