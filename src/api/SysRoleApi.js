import request from '@/utils/request'

export function removeSysRole(id) {
  const ids = [id]
  return request({
    url: '/api/sysRole/remove',
    method: 'post',
    data: { ids: ids }
  })
}

export function addSysRole(data) {
  return request({
    url: '/api/sysRole/add',
    method: 'post',
    data: data
  })
}

export function updateSysRole(data) {
  return request({
    url: '/api/sysRole/update',
    method: 'post',
    data: data
  })
}

export function listSysRole(data) {
  return request({
    url: '/api/sysRole/list',
    method: 'post',
    data: data
  })
}

export function detailSysRole(id) {
  return request({
    url: '/api/sysRole/detail',
    method: 'post',
    data: { id: id }
  })
}

