import { Outlet } from 'react-router'
import {Container, Grid } from '@mui/material'

const Settings = () => {

  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} margin={0} pt={3}>
        <Outlet />
      </Grid>
    </Container>
  )
}

export default Settings;