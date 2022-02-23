import { useContext, useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useSound from 'use-sound'

import { api_url } from './tools/routes'
import { PostContext, UserSettingsContext } from './tools/contexts'
import beep from './tools/beep.mp3'

const AuthenticatedContent = (props) => {

  const { children, setAuth, user, setUser } = props

  const { fetchedPosts, setFetchedPosts } = useContext(PostContext)
  const { userSettings } = useContext(UserSettingsContext)
  const [timeStamp, setTimeStamp] = useState(null)
  const navigate = useNavigate()
  const soundOptions = useMemo(() => {
    return { volume: parseFloat(userSettings.notifVol) }
  }, [userSettings])
  const [playBeep] = useSound(beep, soundOptions)

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
              Authorization: `Bearer ${user?.token}`
            }
          }
        )
        if (res.data['newest_post']) {
          if (
            timeStamp !== null && res.data.posts.length > fetchedPosts.length
          ) {
            playBeep()
          }
          setTimeStamp(res.data['newest_post'])
          setFetchedPosts(res.data['posts'])
        } else if (res.data['wrn']) {
          console.warn(res.data['wrn'])
        } else if (res.data['err']) {
          setAuth(false)
          console.error(res.data['err'])
        }
      }
      catch (error) {
        const errCode = error.response?.status
        if (errCode === 422 || errCode === 401) {
          navigate('/login')
          setUser(null)
          setAuth(false)
          localStorage.removeItem('user')
        }
      }
    }
    if (user) {
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
    // eslint-disable-next-line
  }, [user, timeStamp, fetchedPosts.length])

  useEffect(() => {
    const source = axios.CancelToken.source()
    const refreshing = setInterval(() => {
      if (user?.token) {
        (async () => {
          try {
            const res = await axios.get(
              api_url + '/users/refresh-auth',
              {
                cancelToken: source.token,
                headers: {
                  Accept: '*/*',
                  Authorization: `Bearer ${user.token}`
                }
              }
            )
            if (res.data['user']) {
              setUser(res.data.user)
            }
          }
          catch (error) {
            console.error(error)
          }
        })()
      }
    }, 60 * 60 * 1000)
    return () => {
      clearInterval(refreshing)
      source.cancel('Abort refresh token')
    }
  }, [user, setUser])

  useEffect(() => {

    let timer = null

    const refresh = () => {
      const nd = new Date()
      let diff = new Date(
        nd.getFullYear(), nd.getMonth(), nd.getDate(), 10, 30
      ) - new Date()
      if (diff < 0) {
        diff = new Date(
          nd.getFullYear(), nd.getMonth(), nd.getDate() + 1, 10, 30
        ) - new Date()
      }
      setTimeStamp(null)
      console.log('what do we have for today?')

      timer = setTimeout(refresh, diff)
    }
    refresh()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return children
}

export default AuthenticatedContent