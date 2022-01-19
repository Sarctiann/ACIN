import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { api_url } from './tools/routes'
import { PostContext } from './tools/contexts'

const AuthenticatedContent = (props) => {

  const { children, setAuth, user, setUser } = props

  const { setFetchedPosts } = useContext(PostContext)
  const [timeStamp, setTimeStamp] = useState(null)
  const navigate = useNavigate()

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
  }, [user, setUser, setAuth, navigate, timeStamp, setFetchedPosts])

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

  return children
}

export default AuthenticatedContent