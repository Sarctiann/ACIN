import {
  Typography, Grid, Box, Divider, TextField, Button, Paper
} from '@mui/material';
import { Send } from '@mui/icons-material'
import PostSelect from './PostSelect'

const CreatePost = (props) => {

  const { 
    newPost, newSeverity, setNewSeverity, to, setTo,
    handleChange, handleSend, send_props 
  } = props

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