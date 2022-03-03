import { useMemo } from 'react'
import {
  Paper, Typography, Tooltip, Grid, Box, Divider, Chip
} from '@mui/material'

import daysAgo from '../tools/daysAgo'

const CalcHistory = (props) => {

  const { history } = props

  const registries = useMemo(() => {

    const dividedRegistries = []
    const today = new Date().getTime()
    let last_day = today

    if (history.length > 0) {
      history.forEach(reg => {
        const date = new Date(reg._id['$date'])
        const other_day = daysAgo(
          today,
          new Date(
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
          )
        )
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
        backgroundColor: 'info.main'
      }} borderRadius={3} p={2}>
        <Grid container spacing={1} align='center' pr={2} alignItems='top'
          alignContent='flex-start'
          sx={{ height: '70vh', overflow: 'auto' }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" color="initial">
              Result / History
            </Typography>
          </Grid>
          {registries.map((reg, item) => {
            let component
            if (reg.divider) {
              component = (
                <Grid item xs={12} key={reg.divider}>
                  <Divider>
                    <Chip color='warning' size='small' label={reg.divider} />
                  </Divider>
                </Grid>
              )
            }
            if (reg._id) {

              let tColor
              if (item !== 1) {
                tColor = { color: 'info.light' }
              }

              component = (
                <Grid item xs={12} key={reg._id.$date}>
                  <Paper elevation={7}>
                    <Tooltip title={reg.footnote}
                      placement='right' disableInteractive arrow followCursor
                    >
                      <Typography variant="h6" {...tColor}
                        sx={{ whiteSpace: 'pre-line' }}
                      >
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