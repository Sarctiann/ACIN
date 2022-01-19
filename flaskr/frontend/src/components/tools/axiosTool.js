import { useContext, useEffect } from 'react'
import axios from 'axios'

import { UserContext } from './contexts'
import { api_url } from './routes'

export const useAxios = (
  method, uri, expected, suc, wrn, err,
  TCErr = (e) => { console.error(e) }
) => {

  const { user } = useContext(UserContext)
  const headers = {
    Accept: '*/*',
    Authorization: `Bearer ${user?.token}`
  }

  return async (data) => {
    try {
      let res
      switch (method) {
        default:
          res = await axios.get(
            api_url + uri, { headers: headers }
          )
          break
        case 'post':
          res = await axios.post(
            api_url + uri, data, { headers: headers }
          )
          break
        case 'put':
          res = await axios.put(
            api_url + uri, data, { headers: headers }
          )
          break
        case 'delete':
          res = await axios.delete(
            api_url + uri, { headers: headers, data: data }
          )
          break
      }
      if (res.data[expected]) {
        suc(res.data)
      }
      if (res.data['wrn']) {
        wrn(res.data)
      }
      if (res.data['err']) {
        err(res.data)
      }
    }
    catch (error) {
      TCErr(error)
    }
  }
}

export const useAxiosEffect = (
  uri, expected, suc, wrn, err,
  TCErr = (e) => { console.error(e) }
) => {

  const { user } = useContext(UserContext)
  useEffect(() => {
    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${user?.token}`
    }
    const source = axios.CancelToken.source();
    (async () => {
      try {
        const res = await axios.get(
          api_url + uri, { cancelToken: source.token, headers: headers }
        )
        if (res.data[expected]) {
          suc(res.data)
        }
        if (res.data['wrn']) {
          wrn(res.data)
        }
        if (res.data['err']) {
          err(res.data)
        }
      }
      catch (error) {
        TCErr(error)
      }
    })()
    return () => {
      source.cancel('useAxios: canceled')
    }
    // eslint-disable-next-line
  }, [user])
}