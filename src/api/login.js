import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/auth/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'get'
  })
}
