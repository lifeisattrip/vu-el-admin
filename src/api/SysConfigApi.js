import request from '@/utils/request'

export function removeSysConfig(id) {
  const ids = [id]
  return request({
    url: '/api/sysConfig/remove',
    method: 'post',
    data: { ids: ids }
  })
}

export function addSysConfig(data) {
  return request({
    url: '/api/sysConfig/add',
    method: 'post',
    data: data
  })
}

export function updateSysConfig(data) {
  return request({
    url: '/api/sysConfig/update',
    method: 'post',
    data: data
  })
}

export function listSysConfig(data) {
  return request({
    url: '/api/sysConfig/list',
    method: 'post',
    data: data
  })
}

export function detailSysConfig(id) {
  return request({
    url: '/api/sysConfig/detail',
    method: 'post',
    data: { id: id }
  })
}

export function getDataTypeMap() {
  return request({
    url: '/api/sysConfig/DataTypeMap',
    method: 'get'
  })
}
