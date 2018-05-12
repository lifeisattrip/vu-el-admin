import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function saveUserInfo(userInfo) {
  return request({
    url: '/person/saveInfo',
    method: 'post',
    data: userInfo
  })
}

export function updateSelfPassword(psw) {
  return request({
    url: '/sys/user/updateSelfPsw',
    method: 'post',
    data: psw
  })
}
