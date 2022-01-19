import {
  Grid, Box
} from '@mui/material'

const AnswerButtons = (props) => {
  return (
    <Grid item xs={12}>
      <Box sx={{ paddingBlockEnd: 2, height: '80vh' }}
        border={2} p={2} borderRadius={1} borderColor='primary.main'
      >
        <Grid container spacing={1} align='center' pr={2} alignItems='center'
          sx={{ height: '70vh', overflow: 'auto' }}
        >
        </Grid>
      </Box>
    </Grid>
  )
}

export default AnswerButtons