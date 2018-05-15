import request from '@/utils/request'

export function removeAllSysLog() {
  return request({
    url: '/api/sysLog/removeAll',
    method: 'post',
    data: {}
  })
}
export function listSysLog(data) {
  return request({
    url: '/api/sysLog/list',
    method: 'post',
    data: data
  })
}

