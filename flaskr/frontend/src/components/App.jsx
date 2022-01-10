import { useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { cyan, orange } from "@mui/material/colors"
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
import RegexsSettings from './_settings/regexs/RegexsSettings'
import UserLogin from './_user/UserLogin'
import UserAccount from './_user/UserAccount'

import { UserContext, AuthContext } from './tools/contexts'


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: orange
  }
})

const App = () => {

  const { user, setUser } = useContext(UserContext)
  const { auth, setAuth } = useContext(AuthContext)

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
                    path={sub_routes[2]} element={<RegexsSettings />} />
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
