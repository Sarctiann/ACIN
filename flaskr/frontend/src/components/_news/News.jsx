import { useState, useRef } from 'react'
import { Container, Grid, Snackbar, Alert } from '@mui/material';

import { useAxios } from '../tools/axiosTool'

import Posts from './Posts'
import FullPanel from './FullPanel'
import Filter from './Filter'
import CreatePost from './CreatePost'

const News = () => {

  const contentRef = useRef(null)
  const [severity, setSeverity] = useState('All')
  const [owner, setOwner] = useState('from All')
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [open, setOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '', content: '', days_offset: ''
  })
  const [newSeverity, setNewSeverity] = useState('Normal')
  const [to, setTo] = useState('to Me')

  const contentFocus = () => {
    contentRef.current.focus()
  }

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

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpen(true)
  }

  const sender = useAxios(
    'post', '/news/create-post', 'msg',
    (d) => {
      handleMessage(d.msg, 'success')
      setNewPost({ title: '', content: '', days_offset: '' })
      setNewSeverity('Normal')
      setTo('to Me')
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

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

    sender({
      title: newPost.title,
      content: newPost.content,
      severity: getSeverity(),
      days_offset: days_offset,
      is_public: getPublic(),
      localeTimeOffset: new Date().getTimezoneOffset() / 60
    })
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

  const handleClose = () => {
    setOpen(false)
  }

  const filter = {
    severity: severity,
    setSeverity: setSeverity,
    owner: owner,
    setOwner: setOwner
  }

  const creation = {
    newPost: newPost,
    newSeverity: newSeverity,
    setNewSeverity: setNewSeverity,
    to: to,
    setTo: setTo,
    handleChange: handleChange,
    handleSend: handleSend,
    send_props: send_props
  }

  return (
    <Container maxWidth='xl'>

      <Grid
        container spacing={1} margin={0} pt={3}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <FullPanel
          filter={filter}
          contentRef={contentRef}
          {...creation}
        />
        <Posts
          filter={{ severity: severity, owner: owner }}
          newPost={newPost}
          setNewPost={setNewPost}
          newSeverity={newSeverity}
          to={to}
          contentFocus={contentFocus}
          handleMessage={handleMessage}
        />
      </Grid>

      <Grid
        container spacing={1} margin={0} pt={1}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <Filter
          filter={filter}
        />
        <Posts
          filter={{ severity: severity, owner: owner }}
          newPost={newPost}
          setNewPost={setNewPost}
          newSeverity={newSeverity}
          to={to}
          contentFocus={contentFocus}
          handleMessage={handleMessage}
        />
        <CreatePost
          {...creation}
        />
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert variant='filled' color={message.vnt}>
          {message.msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default News;