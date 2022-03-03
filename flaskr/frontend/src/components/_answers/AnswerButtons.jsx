import { useState, useMemo } from 'react'
import {
  Grid, Box, TextField, IconButton, Stack, Button, Typography, Tooltip
} from '@mui/material'
import { ContentCopy, Cancel } from '@mui/icons-material'

import strFormat from '../tools/strFormat'

const AnswerButtons = (props) => {

  const {
    commonAnswers, ownAnswers, sysRegex, ownRegex, handleMessage,
    commonStackRef, ownStackRef
  } = props

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
    (async () => {
      navigator.clipboard.writeText(
        strFormat(text, [...sysRegex, ...ownRegex], answerList)
      )
    })()
    setText(text)
    handleMessage('Formatted Text Copied to Clipboard', 'success')
  }

  const handleCopy = () => {
    (async () => {
      navigator.clipboard.writeText(
        strFormat(text, [...sysRegex, ...ownRegex], answerList)
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
            <Tooltip title='Copy Formated Text' placement='left'>
              <IconButton color='primary' onClick={handleCopy}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title='Copy Raw Text' placement='left'>
              <IconButton color='info' onClick={handleCopyRaw}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title='Unselect Answer' placement='left'>
              <IconButton color='warning' onClick={() => setText('')}>
                <Cancel />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6'>
              Commons
            </Typography>
            <Stack spacing={1} p={1}
              sx={{ paddingBlockEnd: 2, height: '49vh', overflow: 'auto' }}
            >
              {commonAnswers.length > 0 ? commonAnswers.map((ans, i) => {
                const reference = i === 0 ? {
                  ref: commonStackRef
                } : {}

                return (
                  <Tooltip title='Select and Copy Formatted Text' followCursor
                    enterDelay={1000} key={ans._id.$oid}
                  >
                    <Button fullWidth variant='contained' {...reference}
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
                  </Tooltip>
                )
              }) : 
                <Typography variant='h5' color='primary'>
                  Loading...
                </Typography>
              }
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6'>
              Own
            </Typography>
            <Stack spacing={1} p={1}
              sx={{ paddingBlockEnd: 2, height: '49vh', overflow: 'auto' }}
            >
              {ownAnswers.length > 0 ? ownAnswers.map((ans, i) => {

                const reference = i === 0 ? {
                  ref: ownStackRef
                } : {}

                return (
                  <Tooltip title='Select and Copy Formatted Text' followCursor
                    enterDelay={1000} key={ans._id.$oid}
                  >
                    <Button fullWidth variant='contained'
                      sx={{
                        color: '#FFFFFF',
                        background: ans.color, '&:hover': {
                          background: ans.color, filter: 'brightness(90%)'
                        }
                      }}
                      {...reference}
                      onClick={() => handleClickAnswer(ans.content)}
                    >
                      {ans.label}
                    </Button>
                  </Tooltip>
                )
              }) : 
              <Typography variant='h5' color='primary'>
                Loading...
              </Typography>
            }
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default AnswerButtons