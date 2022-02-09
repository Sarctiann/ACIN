import { Grid, Box, Paper } from '@mui/material';
import PostSelect from './PostSelect'

const Filter = (props) => {

  const { filter: { severity, setSeverity, owner, setOwner } } = props

  return (
    <Grid item xs={12} md={5}>
      <Paper elevation={3}>
        <Box sx={{ paddingBlockEnd: 2 }}
          border={2} p={2} borderRadius={1} borderColor='secondary.main'
        >
          <Grid container spacing={1} align='center' pr={2} alignItems='center'>
            <Grid item xs={6}>
              <PostSelect
                options={['All', 'Urgent', 'Normal', 'Reminder']}
                option={severity}
                setOption={setSeverity}
              />
            </Grid>
            <Grid item xs={6}>
              <PostSelect
                options={['from All', 'Mine only']}
                option={owner}
                setOption={setOwner}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Filter