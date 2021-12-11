import { Container, Grid, Typography, Paper } from '@mui/material'

const UserAccount = () => {
  return (
    <Container>
      <Grid item xs={12}>
        <Typography variant="h3" color="secondary">User Account</Typography>
      </Grid>
      <Grid container spacing={3}>

        {/* UPDATE CURRENT USER ACCOUNT */}

        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Grid item xs={12} p={3}>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Update My User Account
                </Typography>
              </Grid>
              <Grid xs={6} item p={3}>
                <Typography variant="body1" color="inherit">
                  Username
                </Typography>
                <Typography variant="body1" color="inherit">
                  email
                </Typography>
                <Typography variant="body1" color="inherit">
                  First Name
                </Typography>
                <Typography variant="body1" color="inherit">
                  Last Name
                </Typography>
                <Paper elevation={0} sx={{ background: 'gray' }}>
                  <Typography variant="body1" color="inherit">
                    New Password
                  </Typography>
                  <Typography variant="body1" color="inherit">
                    Confirm New Password
                  </Typography>
                </Paper>
                <Typography variant="body1" color="inherit">
                  Old Password
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* UPDATE OTHER USER ACCOUNT (ADMIN) */}

        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Grid item xs={12} p={3}>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Update Another User's Account
                </Typography>
              </Grid>
              <Grid xs={6} item p={3}>
                <Typography variant="body1" color="inherit">
                  Username
                </Typography>
                <Typography variant="body1" color="inherit">
                  email
                </Typography>
                <Typography variant="body1" color="inherit">
                  First Name
                </Typography>
                <Typography variant="body1" color="inherit">
                  Last Name
                </Typography>
                <Paper elevation={0} sx={{ background: 'gray' }}>
                  <Typography variant="body1" color="inherit">
                    New Password
                  </Typography>
                  <Typography variant="body1" color="inherit">
                    Confirm New Password
                  </Typography>
                </Paper>
                <Typography variant="body1" color="inherit">
                  Old Password
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* CREATE NEW USER ACCOUNT (ADMIN) */}

        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Grid item xs={12} p={3}>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Create New User Account
                </Typography>
              </Grid>
              <Grid xs={6} item p={3}>
                <Typography variant="body1" color="inherit">
                  Username
                </Typography>
                <Typography variant="body1" color="inherit">
                  email
                </Typography>
                <Typography variant="body1" color="inherit">
                  First Name
                </Typography>
                <Typography variant="body1" color="inherit">
                  Last Name
                </Typography>
                <Paper elevation={0} sx={{ background: 'gray' }}>
                  <Typography variant="body1" color="inherit">
                    New Password
                  </Typography>
                  <Typography variant="body1" color="inherit">
                    Confirm New Password
                  </Typography>
                </Paper>
                <Typography variant="body1" color="inherit">
                  Old Password
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

      </Grid>
    </Container >
  )
}

export default UserAccount;