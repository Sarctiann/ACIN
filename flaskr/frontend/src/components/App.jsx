import { useContext, useEffect, useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { cyan, deepOrange, deepPurple } from "@mui/material/colors"
import { Paper, CssBaseline } from "@mui/material"

import Navbar from './NavBar'
import AuthenticatedContent from './AuthenticatedContent'
import { routes, sub_routes } from './tools/routes'

import News from './_news/News'
import Calculators from './_calculator/Calculators'
import Answers from './_answers/Answers'
import Settings from './_settings/Settings'
import AnswersSettings from './_settings/answers/AnswersSettings'
import CalculatorSettings from './_settings/calculator/CalculatorSettings'
import ExpressionsSettings from './_settings/expressions/ExpressionsSettings'
import UserLogin from './_user/UserLogin'
import UserAccount from './_user/UserAccount'

import { UserContext, AuthContext, UserSettingsContext } from './tools/contexts'

const App = () => {

  const { user, setUser } = useContext(UserContext)
  const { auth, setAuth } = useContext(AuthContext)
  const { userSettings } = useContext(UserSettingsContext)

  const theme = useMemo(() =>
    userSettings.theme_mode !== 'light' ?
      createTheme({
        palette: {
          mode: 'dark',
          primary: cyan,
          secondary: deepOrange,
          info: deepPurple
        },
        typography: {
          fontSize: 13
        }
      })
      :
      createTheme({
        palette: {
          mode: userSettings.theme_mode,
          primary: cyan,
          secondary: deepOrange,
          info: deepPurple,
          background: {
            paper: '#eaeaea',
            default: '#fafafa'
          }
        },
        typography: {
          fontSize: 13
        }
      })
    , [userSettings.theme_mode]
  )

  useEffect(() => {
    if (user?.token) {
      setAuth(true)
    }
  }, [user, setAuth])


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme>
        <Paper sx={{ paddingBlockEnd: 2, minHeight: '100vh' }} square>
          <Navbar />
          {(auth ?
            <AuthenticatedContent
              setAuth={setAuth} user={user} setUser={setUser}
            >
              <Routes>
                <Route path={'/'} element={<Navigate to={routes[0]} />} />
                <Route path={routes[0]} element={<News />} />
                <Route path={routes[1]} element={<Calculators />} />
                <Route path={routes[2]} element={<Answers />} />
                <Route path={routes[3]} element={<Settings />} >
                  <Route
                    path={sub_routes[0]} element={<AnswersSettings />} />
                  <Route
                    path={sub_routes[1]} element={<CalculatorSettings />} />
                  <Route
                    path={sub_routes[2]} element={<ExpressionsSettings />} />
                </Route>
                <Route path={'login'} element={<UserLogin />} />
                <Route path={'account'} element={<UserAccount />} />
              </Routes>
            </AuthenticatedContent>
            :
            <UserLogin />
          )}
        </Paper>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
