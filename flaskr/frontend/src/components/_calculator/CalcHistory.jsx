import { useEffect, useContext, useMemo } from 'react'
import { 
  Paper, Typography, Tooltip, Grid, Box, Divider, Chip 
} from '@mui/material'
import axios from 'axios'

import { UserContext } from '../tools/contexts'
import { api_url } from '../tools/routes'
import daysAgo from '../tools/daysAgo'

const CalcHistory = (props) => {

  const { history, setHistory } = props
  const { user } = useContext(UserContext)

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        api_url + '/calculator/get-history',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      if (res.data['hist']) {
        setHistory(res.data['hist'])
      }
      if (res.data['msg']) {
        console.warn(res.data['msg'])
      }
      if (res.data['err']) {
        console.error(res.data['err'])
      }
    })()
  }, [user, setHistory])

  const registries = useMemo(() => {

    const dividedRegistries = []
    const today = new Date().getTime()
    let last_day = today

    if (history.length > 0) {
      history.forEach(reg => {
        const other_day = daysAgo(today, reg._id['$date'])
        if (last_day !== other_day) {
          dividedRegistries.push({ divider: other_day })
          last_day = other_day
        }
        dividedRegistries.push(reg)
      })
    } else {
      dividedRegistries.push(
        { divider: 'There are no previous calculations' }
      )
    }

    return dividedRegistries

  }, [history])

  return (
    <Grid item xs={12} md={5}>
      <Box sx={{
        paddingBlockEnd: 2,
        height: '75vh',
        backgroundColor: 'primary.dark'
      }} borderRadius={3} p={2}>
        <Grid container spacing={1} align='center' pr={2} alignItems='top'
          alignContent='flex-start'
          sx={{ height: '70vh', overflow: 'auto' }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" color="initial">
              History
            </Typography>
          </Grid>
          {registries.map(reg => {
            let component
            if (reg.divider) {
              component = (
                <Grid item xs={12} key={reg.divider}>
                  <Divider>
                    <Chip color='success' size='small' label={reg.divider} />
                  </Divider>
                </Grid>
              )
            }
            if (reg._id) {
              component = (
                <Grid item xs={12} key={reg._id.$date}>
                  <Paper elevation={7}>
                    <Tooltip title={reg.footnote}
                      placement='right' disableInteractive arrow followCursor
                    >
                      <Typography variant="h6" color="initial">
                        {reg.calculation}
                      </Typography>
                    </Tooltip>
                  </Paper>
                </Grid>
              )
            }
            return component
          })}
        </Grid>
      </Box>
    </Grid>
  )
}

export default CalcHistory