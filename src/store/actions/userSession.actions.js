import axios from 'axios'
import jwt from 'jsonwebtoken'
import history from '../configuration/history'
import { getAccessToken, getUserName, removeAccessToken, setAccessToken } from '../api'
import {
  CHECK_LOGGED_STATUS,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from '../constants'
import { requestStart, requestComplete, requestFailure } from './request.actions'
import { openResponseModal } from './apiResponse.actions'
import getRandomString from '../../helpers/getRandomString'

/* eslint-disable */
const clientId = process.env.REACT_APP_CLIENT_ID || MAIN_CONFIG.gateway.client_id;
const scope = process.env.REACT_APP_SCOPE || MAIN_CONFIG.gateway.scope;
const state = getRandomString();
const URL_GET_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN_URL || MAIN_CONFIG.gateway.github_token_url;
const URL_GET_JANUS_TOKEN = process.env.REACT_APP_JANUS_TOKEN_URL || MAIN_CONFIG.gateway.janus_token_url;
const URL_GITHUB_AUTHORIZE = process.env.REACT_APP_GITHUB_AUTHORIZE_URL || MAIN_CONFIG.gateway.github_authorize_url;
const URL_JANUS = process.env.REACT_APP_JANUS_URI || MAIN_CONFIG.gateway.uri;
/* eslint-enable */

export const getJWTtoken = (hash) => async dispatch => {
  const getParameterByName = (name, url) => {
    if (!url) url = window.location.href
    name = name.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(url)

    if (!results) return null
    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  const extractToken = (string) => {
    const param = 'access_token'
    const name = param.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp(name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(string)

    if (!results) return null
    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  const extractParameter = (hash, parameter, url) => getParameterByName(parameter, url)
  const code = extractParameter(hash, 'code')

  try {
    dispatch(requestStart())
    const response = await axios.post(
      `${URL_GET_GITHUB_TOKEN}?client_id=${clientId}&code=${code}`
    )
    // extract access_token
    const accessToken = await extractToken(response.data)
    // set Authorization headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    const finalResponse = await axios.post(
      `${URL_GET_JANUS_TOKEN}/login?provider=github`
    )
    // receive JWT token to use Janus-GW
    const JWTtoken = finalResponse.data.access_token

    setAccessToken(JWTtoken)
    history.push('/')
    dispatch(getUserStatus())
    dispatch(requestComplete())
  } catch (error) {
    console.log(error)
    dispatch(requestFailure())
    dispatch(openResponseModal({
      message: error.message
    }))
  }
}

export const checkLoggedStatus = () => ({
  type: CHECK_LOGGED_STATUS
})

export const loginRequest = () => ({
  type: LOGIN_START
})

export const loginSuccess = (userName, isAdmin) => ({
  type: LOGIN_SUCCESS,
  payload: {
    userName,
    isAdmin
  }
})

export const loginFailure = () => ({
  type: LOGIN_FAILURE,
  payload: 'The login or password you entered is incorrect.'
})

export const authorizeThroughGithub = () => async dispatch => {
  dispatch(requestStart())
  window.location.href = `${URL_GITHUB_AUTHORIZE}?response_type=code&state=${state}&client_id=${clientId}&scope=${scope}`
}

export const authorizeBasic = payload => async dispatch => {
  dispatch(requestStart())
  dispatch(loginRequest())

  try {
    const url = `${URL_JANUS}/login`
    const response = await axios.post(url, {
      username: payload.username,
      password: payload.password
    })

    setAccessToken(response.data.access_token, payload.username)
    history.push('/')
    dispatch(getUserStatus())
    dispatch(requestComplete())
  } catch (error) {
    dispatch(requestFailure())

    if (error.response.status === 401) {
      dispatch(loginFailure())
    } else {
      dispatch(openResponseModal({
        message: error.message
      }))
    }
  }
}

export const logout = () => dispatch => {
  removeAccessToken()
  dispatch(getUserStatus())
  dispatch({
    type: LOGOUT
  })
}

export const getUserStatus = () => dispatch => {
  dispatch(checkLoggedStatus())
  const JWTtoken = getAccessToken()

  if (JWTtoken) {
    const userName = getUserNameFromToken(JWTtoken) || getUserName()
    const userRole = getUserRoleFromToken(JWTtoken) || true

    dispatch(loginSuccess(
      userName,
      userRole
    ))
  } else {
    history.push('/login')
  }
}

function getUserNameFromToken (token) {
  const payload = jwt.decode(token)

  return payload ? payload.sub : false
}

function getUserRoleFromToken (token) {
  const payload = jwt.decode(token)

  return payload ? payload.is_admin : false
}
