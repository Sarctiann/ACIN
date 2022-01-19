import {
  Grid, Box
} from '@mui/material'

const EditAnswers = (props) => {

  

  return (
    <Grid item xs={12}>
      <Box sx={{ paddingBlockEnd: 2, height: '75vh' }}
        border={2} p={2} borderRadius={1} borderColor='secondary.main'
        backgroundColor='#323232'
      >
        <Grid container spacing={1} align='center' pr={2} alignItems='center'
          sx={{ height: '70vh', overflow: 'auto' }}
        >
        </Grid>
      </Box>
    </Grid>
  )
}

export default EditAnswers