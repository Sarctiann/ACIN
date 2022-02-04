import { Fragment, useState, useContext } from 'react'
import {
  Grid, Typography, Paper, Button, Switch, FormControlLabel, FormControl,
  Select, MenuItem, Snackbar, Alert, TextField
} from '@mui/material'

import { UserSettingsContext } from '../tools/contexts'
import RDialog from '../tools/ReusableDialog'
import { useAxios } from '../tools/axiosTool'


const UserOptions = (props) => {

  const { userSettings, setUserSettings } = useContext(UserSettingsContext)
  const [settings, setSettings] = useState(userSettings)
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt })
    setOpen(true)
  }

  const handleChangeSettings = (e) => {
    const { name, value, checked } = e.target
    setSettings({
      ...settings,
      [name]: name !== 'calculator' ? value : checked
    })
  }

  const handleSaveSettings = useAxios(
    'put', '/users/update-user-settings', 'settings',
    (d) => {
      setUserSettings(d.settings)
      handleMessage(d.msg, 'success')
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  return (
    <Fragment {...props}>
      <Grid item xs={12} mt={2}>
        <Paper elevation={3}>
          <Grid container spacing={2} margin={0} px={{ xs: 0, md: 3 }}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                User Settings
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <FormControl fullWidth>
                <Select size='small'
                  name='theme_mode'
                  value={settings.theme_mode}
                  onChange={handleChangeSettings}
                >
                  <MenuItem value='dark'> DARK THEME </MenuItem>
                  <MenuItem value='light'> LIGHT THEME</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={
                <Switch
                  name='calculator'
                  checked={settings.calculator}
                  onChange={handleChangeSettings}
                />
              }
                label='Basic Calculator for Default'
              />
            </Grid>
            <Grid item xs={11}>
              <TextField fullWidth size='small' label='Posts Font Family'
                name='postsFontFamily'
                value={settings.postsFontFamily}
                onChange={handleChangeSettings}
              />
            </Grid>
            <Grid item xs={11}>
              <TextField fullWidth size='small' label='Notification Volume'
                type='range'
                inputProps={{ min: 0, max: 1, step: 0.1}}
                name='notifVol'
                value={settings.notifVol}
                onChange={handleChangeSettings}
              />
            </Grid>
            <Grid item xs={12} px={2} pb={2}>
              <RDialog
                title='Save User Settings' confirmText='UPDATE'
                message='Confirm Save user settings?' color='warning'
                action={() => handleSaveSettings({
                  settings: {
                    theme_mode: settings.theme_mode,
                    calculator: settings.calculator,
                    postsFontFamily: settings.postsFontFamily,
                    notifVol: parseFloat(settings.notifVol)
                  }
                })}
              >
                <Button variant="contained" color="warning">
                  CONFIGURE
                </Button>
              </RDialog>
            </Grid>
          </Grid>
        </Paper>
      </Grid >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert variant='filled' color={message.vnt}>
          {message.msg}
        </Alert>
      </Snackbar>
    </Fragment >
  )
}

export default UserOptions
