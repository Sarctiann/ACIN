import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { cyan, orange } from "@mui/material/colors"
import { Paper } from "@mui/material"

import Navbar from './NavBar'
import { routes, sub_routes } from './tools/routes'

import News from './_news/News'
import Calculator from './_calculator/Calculator'
import CompleteCalculator from './_calculator/CompleteCalculator'
import BasicCalculator from './_calculator/BasicCalculator'
import Answers from './_answers/Answers'
import Settings from './_settings/Settings'
import AnswersSettings from './_settings/AnswersSettings'
import CalculatorSettings from './_settings/CalculatorSettings'
import RegexsSettings from './_settings/RegexsSettings'
import UserLogin from './_user/UserLogin'
import UserAccount from './_user/UserAccount'

import { TokenContext } from './tools/contexts'


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: orange
  }
})

const App = () => {

  const { token } = useContext(TokenContext)

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ height: '100vh' }} square>
        <Navbar />
        {(token &&
          <Routes>

            <Route path={'/'} element={<Navigate to={routes[0]} />} />

            <Route path={routes[0]} element={<News />} />

            <Route path={routes[1]} element={<Calculator />} >
              <Route
                path={sub_routes[0]} element={<CompleteCalculator />} />
              <Route
                path={sub_routes[1]} element={<BasicCalculator />} />
            </Route>

            <Route path={routes[2]} element={<Answers />} />

            <Route path={routes[3]} element={<Settings />} >
              <Route
                path={sub_routes[2]} element={<AnswersSettings />} />
              <Route
                path={sub_routes[3]} element={<CalculatorSettings />} />
              <Route
                path={sub_routes[4]} element={<RegexsSettings />} />
            </Route>

            <Route path={'login'} element={ <UserLogin />} />
            <Route path={'account'} element={<UserAccount />} />
              
          </Routes>
        ) || ( 
          <UserLogin />
        )}

      </Paper>
    </ThemeProvider>
  );
}

export default App;
