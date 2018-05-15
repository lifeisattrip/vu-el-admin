import request from '@/utils/request'

export function updateSelfPassword(psw) {
  return request({
    url: '/api/sysUser/updateSelfPsw',
    method: 'post',
    data: psw
  })
}
