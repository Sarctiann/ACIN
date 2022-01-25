import { useState, useMemo } from 'react'
import {
  Grid, Box, TextField, IconButton, Stack, Button, Typography
} from '@mui/material'
import { ContentCopy, Cancel } from '@mui/icons-material'

import strFormat from '../tools/strFormat'

const AnswerButtons = (props) => {

  const { commonAnswers, ownAnswers, ownRegex, handleMessage } = props

  const [text, setText] = useState('')

  const answerList = useMemo(() => {
    if (commonAnswers.length > 0 && ownAnswers.length > 0) {
      return [...commonAnswers, ...ownAnswers].map(({ label, content }) => {
        return { [label]: content }
      }).reduce((resObj, curObj) => {
        return { ...resObj, ...curObj }
      })
    }

  }, [commonAnswers, ownAnswers])

  const handleClickAnswer = (text) => {
    setText(text)
  }

  const handleCopy = () => {
    (async () => {
      navigator.clipboard.writeText(
        strFormat(text, ownRegex, answerList)
      )
    })()
    handleMessage('Formatted Text Copied to Clipboard', 'success')
  }

  const handleCopyRaw = () => {
    (async () => {
      navigator.clipboard.writeText(text)
    })()
    handleMessage('Raw Text Copied to Clipboard', 'success')
  }

  return (
    <Grid item xs={12}>
      <Box sx={{ paddingBlockEnd: 2, minHeight: '80vh' }}
        border={2} p={2} borderRadius={1} borderColor='primary.main'
      >
        <Grid container spacing={1} align='center' pr={2}>
          <Grid item xs={12} md={11}>
            <TextField label='Content' focused color='warning'
              fullWidth multiline rows={4}
              InputProps={{ readOnly: true }}
              value={text}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <IconButton color='primary' onClick={handleCopy}>
              <ContentCopy />
            </IconButton>
            <IconButton color='info' onClick={handleCopyRaw}>
              <ContentCopy />
            </IconButton>
            <IconButton color='warning' onClick={() => setText('')}>
              <Cancel />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6'>
              Commons
            </Typography>
            <Stack spacing={1} p={1}
              sx={{ paddingBlockEnd: 2, height: '50vh', overflow: 'auto' }}
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
                    onClick={() => handleClickAnswer(ans.content)}
                  >
                    {ans.label}
                  </Button>
                )
              })}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6'>
              Own
            </Typography>
            <Stack spacing={1} p={1}
              sx={{ paddingBlockEnd: 2, height: '50vh', overflow: 'auto' }}
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
                    onClick={() => handleClickAnswer(ans.content)}
                  >
                    {ans.label}
                  </Button>
                )
              })}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default AnswerButtons