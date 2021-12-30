import { useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { cyan, orange } from "@mui/material/colors"
import { Paper, CssBaseline } from "@mui/material"
import axios from 'axios'

import Navbar from './NavBar'
import { routes, sub_routes, api_url } from './tools/routes'

import News from './_news/News'
import Calculators from './_calculator/Calculators'
import Answers from './_answers/Answers'
import Settings from './_settings/Settings'
import AnswersSettings from './_settings/AnswersSettings'
import CalculatorSettings from './_settings/CalculatorSettings'
import RegexsSettings from './_settings/RegexsSettings'
import UserLogin from './_user/UserLogin'
import UserAccount from './_user/UserAccount'

import { UserContext, AuthContext, PostContext } from './tools/contexts'


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: orange
  }
})


const App = () => {

  const { user, setUser} = useContext(UserContext)
  const { auth, setAuth } = useContext(AuthContext)
  const { setFetchedPosts } = useContext(PostContext)
  const [timeStamp, setTimeStamp] = useState(null)

  useEffect(() => {
    const source = axios.CancelToken.source()
    const checkForNewPosts = async () => {
      try {
        const res = await axios.post(
          api_url + '/news/fetch-posts',
          { last_post: timeStamp },
          {
            cancelToken: source.token,
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${user['token']}`
            }
          }
        )
        if (res.data['newest_post']) {
          setTimeStamp(res.data['newest_post'])
          setFetchedPosts(res.data['posts'])
        } else if (res.data['wrn']) {
          console.log(res.data['wrn'])
        } else if (res.data['err']) {
          setAuth(false)
          console.log(res.data['err'])
        }
      }
      catch (error) {
        const errCode = error.response?.status
        if (errCode === 422 || errCode === 401) {
          setUser(undefined)
          setAuth(false)
          localStorage.removeItem('user')
          console.log('NOT AUTHORIZED', errCode)
        } else {
          console.log(error)
        }
      }
    }
    if (user?.token) {
      setAuth(true)
      checkForNewPosts()
    }
    const watcher = setInterval(() => {
      if (user?.token) {
        checkForNewPosts()
      }
    }, 3000)
    return () => {
      clearInterval(watcher)
      source.cancel('Leaving News page or the data is already loaded')
    }
  }, [user, setUser, setAuth, timeStamp, setFetchedPosts])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme>

        <Paper sx={{ paddingBlockEnd: 2, minHeight: '100vh' }} square>
          <Navbar />
          {(auth ?
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
            :
            <UserLogin />
          )}
        </Paper>

      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
