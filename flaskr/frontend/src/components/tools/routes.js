// Do not change the order of "routes" and "sub_routes", 
// append new ones (to the tail) to make the app grow.
export const routes = [
  '/news',
  '/calculators',
  '/answers',
  '/settings',
]

export const sub_routes = [
  'answers',
  'calculator',
  'expressions'
]

const host = {
  development: 'http://localhost:5000/',
  production: 'https://audiocenter-in.herokuapp.com/'
}[process.env.NODE_ENV]

const api_root = '/api-v1'

export const api_url = host + api_root