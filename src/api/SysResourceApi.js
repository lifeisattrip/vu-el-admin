import request from '@/utils/request'

export function removeSysResource(id) {
  const ids = [id]
  return request({
    url: '/api/sysResource/remove',
    method: 'post',
    data: { ids: ids }
  })
}

export function addSysResource(data) {
  return request({
    url: '/api/sysResource/add',
    method: 'post',
    data: data
  })
}

export function updateSysResource(data) {
  return request({
    url: '/api/sysResource/update',
    method: 'post',
    data: data
  })
}

export function listSysResource(data) {
  return request({
    url: '/api/sysResource/list',
    method: 'post',
    data: data
  })
}

export function detailSysResource(id) {
  return request({
    url: '/api/sysResource/detail',
    method: 'post',
    data: { id: id }
  })
}

export function getSysResourceTypeMap() {
  return request({
    url: '/api/sysResource/SysResourceTypeMap',
    method: 'get'
  })
}

export function getSysResourceTreeData() {
  return request({
    url: '/api/sysResource/treeData',
    method: 'get'
  })
}
