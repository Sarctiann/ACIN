import { useState } from 'react'
import {
  Grid, Paper, Box, Button, TextField, Typography, FormControlLabel, Checkbox,
  Divider
} from '@mui/material'
import { ArrowUpward, Add } from '@mui/icons-material'
import RDialog from '../../tools/ReusableDialog'

const NewItem = (props) => {

  const { dates, setDates, setHasChanged, handleMessage } = props

  const initialNewOne = { str_date: '', percent: '', increaseAll: true }

  const [newOne, setNewOne] = useState(initialNewOne)
  const [upAll, setUpAll] = useState('')

  const handleChangeNewOne = (e) => {
    const { name, value, checked } = e.target
    setNewOne({ ...newOne, [name]: name === 'increaseAll' ? checked : value })
  }

  const addSuccessiveIncreases = (inc) => {
    const b = parseFloat(inc)
    return dates.map(item => {
      const a = parseFloat(item.percent)
      const newPercent = a + b + (a * b / 100)
      return { _id: item._id, percent: newPercent.toFixed(2) }
    })
  }

  const handleAddOne = () => {
    const newDate = newOne.str_date.split('-').join('/')
    const newPercent = parseFloat(newOne.percent)
    for (let date of dates) {
      if (date._id === newDate) {
        handleMessage(`'${date._id}' is already on the list`, 'error')
        return
      }
    }
    let newDates = newOne.increaseAll
      ? addSuccessiveIncreases(newPercent)
      : dates
    setDates([
      { _id: newDate, percent: newPercent },
      ...newDates
    ])
    setHasChanged(true)
    setNewOne(initialNewOne)
  }
  
  const handleUpdateAll = () => {
    setDates(addSuccessiveIncreases(upAll))
    setHasChanged(true)
    setUpAll('')
  }

  return (
    <Grid item pb='1vh'>
      <Paper elevation={5} sx={{ borderRadius: 1 }}>
        <Box borderRadius={3} p={2}
          sx={{ paddingBlockEnd: 2, minHeight: '39vh' }}
        >
          <Grid container spacing={1} align='center' pr={2}
            alignItems='center'
            sx={{ minHeight: '35vh', overflow: 'auto' }}
          >
            <Grid item xs={12}>
              <Typography variant='h6' color='success.main'>
                Add New Date - Percentage
              </Typography>
            </Grid>
            <Grid item xs={8} md={4}>
              <TextField fullWidth size='small' label='Date'
                focused
                type='date'
                name='str_date'
                value={newOne.str_date}
                onChange={handleChangeNewOne}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <TextField fullWidth size='small' label='Percentage'
                inputProps={{ min: 0 }}
                type='number'
                name='percent'
                value={newOne.percent}
                onChange={handleChangeNewOne}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel label='Increase All' control={
                <Checkbox color='warning'
                  name='increaseAll'
                  checked={newOne.increaseAll}
                  onChange={handleChangeNewOne}
                />
              } />
            </Grid>
            <Grid item xs={6} md={3}>
              <RDialog title='Add New Date-Percentage Pair'
                message='Confirm add a new one?' confirmText='ADD'
                color='success' action={handleAddOne}
              >
                <Button fullWidth variant='contained' color='success'
                  disabled={
                    !Boolean(newOne.str_date)
                    || !Boolean(newOne.percent)
                  }
                  sx={{ height: '100%' }} startIcon={<Add />}
                >
                  ADD
                </Button>
              </RDialog>
            </Grid>
            <Grid item xs={12} py={2}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' color='warning.main'>
                Increase All Percentages
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size='small' label='Percentage'
                inputProps={{ min: 0 }}
                type='number'
                value={upAll}
                onChange={(e) => setUpAll(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RDialog title='Update Date-Percentage Table'
                message='Confirm update table?' confirmText='UPDATE'
                action={handleUpdateAll}
              >
                <Button fullWidth variant='contained' color='warning'
                  disabled={!Boolean(upAll)}
                  sx={{ height: '100%' }} startIcon={<ArrowUpward />}
                >
                  UPDATE TABLE
                </Button>
              </RDialog>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default NewItem