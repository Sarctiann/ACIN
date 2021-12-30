import { Grid, Paper, Box } from '@mui/material'

const Complete = () => {

  return (
    <Grid item xs={12} md={7}>
      <Paper elevation={5} sx={{ borderRadius: 3 }}>
        <Box sx={{ paddingBlockEnd: 2, height: '65vh', }} p={2}>
          <Grid container spacing={1} align='center' pr={2} alignItems='center'
            sx={{ height: '60vh', overflow: 'auto' }}
          >
            <Grid item xs={6}>
              <h1>Complete</h1>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Complete